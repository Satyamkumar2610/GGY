/**
 * Renders the share cards in public/og/: one per state, 1200 x 630.
 *
 * It draws each card inside a live page of the site, so the cards use the
 * site's own typefaces (Gambetta, Switzer and the Anek faces for Devanagari
 * and Gujarati) and the same geometry as the map.
 *
 * Usage: start the site (npm run dev or npm start), then
 *   node scripts/build-share-cards.cjs [http://localhost:3000]
 * Requires Playwright with a Chromium build available (not a dependency of
 * the site itself).
 */
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const base = process.argv[2] || "http://localhost:3000";
const atlas = require("../content/india-atlas.json");

const STATES = [
  { slug: "gujarat", iso: "IN-GJ", name: "Gujarat", native: "ગુજરાત", cls: "script-guj", ring: "GUJARAT ✦ GANDHINAGAR ✦ 23.22° N 72.64° E ✦ ", photo: "/images/map/gujarat-sabarmati-ashram.jpg" },
  { slug: "goa", iso: "IN-GA", name: "Goa", native: "गोंय", cls: "script-deva", ring: "GOA ✦ PANAJI ✦ 15.49° N 73.83° E ✦ ", photo: "/images/map/goa-basilica-bom-jesus.jpg" },
  { slug: "maharashtra", iso: "IN-MH", name: "Maharashtra", native: "महाराष्ट्र", cls: "script-deva", ring: "MAHARASHTRA ✦ MUMBAI ✦ 19.08° N 72.88° E ✦ ", photo: "/images/map/maharashtra-gateway-of-india.jpg" },
];

const card = (s) => {
  const st = atlas.states.find((x) => x.iso === s.iso);
  const [x0, y0, x1, y1] = st.bounds;
  // Goa is small: give it a wider frame so the outline reads.
  const side = Math.max(x1 - x0, y1 - y0, s.iso === "IN-GA" ? 46 : 0) * 1.14;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const vb = `${cx - side / 2} ${cy - side / 2} ${side} ${side}`;
  return `
  <div style="position:fixed;inset:0;z-index:9999;background:#f4f0e8;color:#191817;display:grid;grid-template-columns:1.05fr 0.95fr;overflow:hidden">
    <div style="padding:60px 56px 52px 64px;display:flex;flex-direction:column;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:16px">
        <span style="display:grid;gap:4px;width:34px"><i style="display:block;height:4px;background:#871b38"></i><i style="display:block;height:4px;width:72%;background:#b66c4c"></i><i style="display:block;height:4px;width:44%;background:#871b38"></i></span>
        <span style="font:600 15px var(--font-switzer);letter-spacing:.2em;text-transform:uppercase;color:#6a625a">Good Governance Yatra</span>
      </div>
      <div>
        <div style="font:600 15px var(--font-switzer);letter-spacing:.2em;text-transform:uppercase;color:#6a625a;margin-bottom:18px">State dossier</div>
        <div style="font-family:var(--font-gambetta);font-weight:300;font-size:${s.name.length > 8 ? 112 : 150}px;line-height:.95;letter-spacing:-.03em">${s.name}</div>
        <div class="${s.cls}" style="font-size:58px;line-height:1.2;color:#871b38;margin-top:14px">${s.native}</div>
      </div>
      <div style="font:400 19px/1.45 var(--font-switzer);color:#46413b;max-width:470px">The upcoming edition travels through Maharashtra, Goa and Gujarat. Stops and dates are to be announced.</div>
    </div>
    <div style="position:relative;display:grid;place-items:center;background:#e9e2d5">
      <svg viewBox="${vb}" style="width:520px;height:520px;overflow:visible">
        <defs><clipPath id="c" clipPathUnits="userSpaceOnUse"><path d="${st.d}"/></clipPath></defs>
        <g clip-path="url(#c)"><image href="${base}${s.photo}" x="${x0 - 4}" y="${y0 - 4}" width="${x1 - x0 + 8}" height="${y1 - y0 + 8}" preserveAspectRatio="xMidYMid slice"/></g>
        <path d="${st.d}" fill="none" stroke="#871b38" stroke-width="2.2" vector-effect="non-scaling-stroke"/>
      </svg>
      <div style="position:absolute;right:34px;bottom:30px;width:150px;height:150px;rotate:-9deg;color:#871b38;opacity:.9">
        <svg viewBox="0 0 200 200" style="width:100%;height:100%;overflow:visible">
          <defs><path id="r" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"/></defs>
          <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" stroke-width="3"/>
          <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" stroke-width="1.2"/>
          <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" stroke-width="1.2"/>
          <text style="font:600 13px var(--font-switzer);letter-spacing:.12em" fill="currentColor"><textPath href="#r" textLength="458" lengthAdjust="spacing">${s.ring}</textPath></text>
        </svg>
        <div class="${s.cls}" style="position:absolute;inset:0;display:grid;place-items:center;font-size:30px;padding-bottom:6%;color:#871b38">${s.native}</div>
      </div>
    </div>
  </div>`;
};

(async () => {
  const out = path.join(__dirname, "..", "public", "og");
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(`${base}/journal`, { waitUntil: "networkidle" });
  for (const s of STATES) {
    await page.evaluate((html) => {
      // The development server's badge must not end up in the picture.
      document.querySelectorAll("nextjs-portal").forEach((n) => n.remove());
      document.getElementById("og-card")?.remove();
      const d = document.createElement("div");
      d.id = "og-card";
      d.innerHTML = html;
      document.body.appendChild(d);
    }, card(s));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(out, `state-${s.slug}.png`), clip: { x: 0, y: 0, width: 1200, height: 630 } });
    console.log("wrote", `public/og/state-${s.slug}.png`);
  }
  await browser.close();
})();
