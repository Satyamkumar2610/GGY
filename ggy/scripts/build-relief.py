"""
Builds public/images/map/relief-west.jpg and content/relief.json: a hillshade
of western India, reprojected into the atlas's own projection so it can sit
under the state boundaries in the same camera group.

Elevation: Terrain Tiles on AWS (Mapzen "terrarium" encoding), zoom 7, built
from SRTM, GMTED2010 and ETOPO1 among others. See
https://github.com/tilezen/joerd/blob/master/docs/attribution.md

Usage (run isolated; tiles are passed as a directory, never imported):
  python3 -I scripts/build-relief.py <tiles-dir> <content/india-atlas.json> <out.jpg> <out.json>

Tiles are named 7_<x>_<y>.png.
"""

import json
import math
import sys

import numpy as np
from PIL import Image

tiles_dir, atlas_path, out_img, out_json = sys.argv[1:5]
atlas = json.load(open(atlas_path))
P = atlas["projection"]

# --- d3.geoConicConformal, inverted -------------------------------------------
phi0, phi1 = (math.radians(p) for p in P["parallels"])
HALF = math.pi / 2


def tany(y):
    return math.tan((HALF + y) / 2)


n = math.log(math.cos(phi0) / math.cos(phi1)) / math.log(tany(phi1) / tany(phi0))
f = math.cos(phi0) * tany(phi0) ** n / n
K = P["scale"]
TX, TY = P["translate"]
ROT = math.radians(P["rotate"][0])


def forward(lon, lat):
    lam = math.radians(lon) + ROT
    r = f / tany(math.radians(lat)) ** n
    x, y = r * math.sin(n * lam), f - r * math.cos(n * lam)
    return TX + K * x, TY - K * y


def inverse(X, Y):
    x = (X - TX) / K
    y = -(Y - TY) / K
    fy = f - y
    r = np.sign(n) * np.sqrt(x * x + fy * fy)
    lam = np.arctan2(x, np.abs(fy)) * np.sign(fy)
    lon = np.degrees(lam / n - ROT)
    lat = np.degrees(2 * np.arctan((f / r) ** (1 / n)) - HALF)
    return lon, lat


# Check against the points d3 projected when the atlas was built.
gx, gy = forward(72.6369, 23.2156)
ex, ey = atlas["points"]["Gandhinagar"]
assert abs(gx - ex) < 0.2 and abs(gy - ey) < 0.2, (gx, gy, ex, ey)

# --- Output frame in atlas units ---------------------------------------------
X0, Y0, X1, Y1 = 0.0, 360.0, 600.0, 1100.0
PX = 3  # output pixels per atlas unit
W, H = int((X1 - X0) * PX), int((Y1 - Y0) * PX)
xs = X0 + (np.arange(W) + 0.5) / PX
ys = Y0 + (np.arange(H) + 0.5) / PX
XX, YY = np.meshgrid(xs, ys)
lon, lat = inverse(XX, YY)

# --- Sample elevation from the tiles -----------------------------------------
Z = 7
N = 2**Z
tx = (lon + 180) / 360 * N
lat_r = np.radians(lat)
ty = (1 - np.log(np.tan(lat_r) + 1 / np.cos(lat_r)) / math.pi) / 2 * N
cache = {}


def tile(x, y):
    key = (x, y)
    if key not in cache:
        try:
            a = np.asarray(Image.open(f"{tiles_dir}/{Z}_{x}_{y}.png").convert("RGB"), dtype=np.float64)
            cache[key] = a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768
        except FileNotFoundError:
            cache[key] = np.zeros((256, 256))
    return cache[key]


elev = np.zeros((H, W))
ix = np.floor(tx).astype(int)
iy = np.floor(ty).astype(int)
px = np.clip(((tx - ix) * 256).astype(int), 0, 255)
py = np.clip(((ty - iy) * 256).astype(int), 0, 255)
for x, y in set(zip(ix.ravel().tolist(), iy.ravel().tolist())):
    m = (ix == x) & (iy == y)
    elev[m] = tile(x, y)[py[m], px[m]]

# --- Hillshade: light from the north-west, exaggerated for a printed relief ---
km_per_px = 6371 / K / PX
cell = km_per_px * 1000
dzdx = np.gradient(elev, axis=1) / cell
dzdy = np.gradient(elev, axis=0) / cell
EXAG = 7.0
slope = np.arctan(EXAG * np.hypot(dzdx, dzdy))
aspect = np.arctan2(-dzdx, dzdy)
az, alt = math.radians(315), math.radians(42)
shade = np.sin(alt) * np.cos(slope) + np.cos(alt) * np.sin(slope) * np.cos(az - aspect)
flat = math.sin(alt)
# Only shadows: the image is multiplied over the map, so flat ground is white.
out = 1 - np.clip((flat - shade) * 1.25, 0, 1) * 0.9
out[elev <= 0] = 1
img = Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8), mode="L")
img.save(out_img, quality=72, optimize=True, progressive=True)
json.dump(
    {
        "x": X0,
        "y": Y0,
        "width": X1 - X0,
        "height": Y1 - Y0,
        "source": "Terrain Tiles on AWS (Mapzen terrarium, zoom 7): SRTM, GMTED2010, ETOPO1 and others. Hillshade, vertical exaggeration 7x.",
    },
    open(out_json, "w"),
)
print("wrote", out_img, W, "x", H)
