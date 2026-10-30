/**
 * The hero photograph, drawn on a canvas so it can be displaced.
 *
 * It exists for the opening alone. The photograph begins dark, desaturated and
 * warped by flowing noise, then resolves — a print coming up in the tray rather
 * than an opacity fade. At rest it tracks the pointer with a soft lens and a
 * slow drift of light, and it draws the same framing as the CSS slats beneath
 * (`object-fit: cover`, `object-position: 56% 40%`, scaled about 56%/42%), so
 * handing back to them is invisible.
 *
 * The texture is the decoded `<img>` the page has already downloaded, so the
 * layer costs no extra bytes. Any failure returns null and the slats keep the
 * hero exactly as it is without it.
 */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  // aPos covers the clip cube; vUv runs 0..1 with y = 0 at the top, as CSS does.
  vUv = vec2((aPos.x + 1.0) * 0.5, 1.0 - (aPos.y + 1.0) * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;

uniform sampler2D uTex;
uniform vec2 uRes;
uniform float uImgAspect;
uniform float uTime;
uniform float uReveal;
uniform float uScale;
uniform vec2 uPointer;
uniform float uPointerAmt;
uniform float uLight;

const vec2 ORIGIN = vec2(0.56, 0.42);
const vec2 OBJECT_POS = vec2(0.56, 0.40);

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / max(uRes.y, 1.0);

  // How far this pixel has resolved. Noise breaks the edge so the image comes
  // up in patches, with a slight bias upward so it still reads as a direction.
  float grain = fbm(uv * 2.2 + vec2(uTime * 0.015, uTime * 0.01));
  float edge = uReveal * 1.6 - 0.3;
  float amount = smoothstep(0.0, 0.35, edge - grain * 0.55 + (uv.y - 0.5) * 0.25);
  float warp = 1.0 - amount;

  // Unresolved parts flow; resolved parts are still.
  vec2 flow = vec2(fbm(uv * 3.1 + 11.0), fbm(uv * 3.1 - 7.0)) - 0.5;
  uv += flow * warp * 0.13;

  // A soft lens under the pointer, its edge broken by noise so it refracts
  // rather than magnifies, plus a whole-frame drift away from it.
  vec2 d = (uv - uPointer) * vec2(aspect, 1.0);
  float fall = exp(-dot(d, d) * 7.0);
  float lens = fbm(uv * 4.0 + vec2(uTime * 0.05, uTime * -0.04));
  uv -= (uv - uPointer) * fall * (0.035 + lens * 0.03) * uPointerAmt;
  uv -= (uPointer - 0.5) * 0.014 * uPointerAmt;

  uv = ORIGIN + (uv - ORIGIN) / uScale;

  // object-fit: cover
  vec2 t;
  if (uImgAspect > aspect) {
    float f = aspect / uImgAspect;
    t = vec2(uv.x * f + OBJECT_POS.x * (1.0 - f), uv.y);
  } else {
    float f = uImgAspect / aspect;
    t = vec2(uv.x, uv.y * f + OBJECT_POS.y * (1.0 - f));
  }

  vec3 col = texture2D(uTex, clamp(t, 0.0, 1.0)).rgb;

  // Tone arrives with the image: dark and grey until it has resolved.
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(lum), col, mix(0.3, 1.0, amount));
  col *= mix(0.2, 1.0, amount);

  // A very slow wander of warm light, so the still photograph is never inert.
  float drift = fbm(uv * 1.1 + vec2(uTime * 0.013, uTime * 0.009)) - 0.5;
  col += vec3(1.0, 0.95, 0.86) * drift * 0.05 * uLight;

  gl_FragColor = vec4(col, 1.0);
}`;

export type HeroGL = {
  /** Tweened by GSAP; read on every frame. */
  readonly u: { reveal: number; scale: number; light: number };
  start: () => void;
  stop: () => void;
  destroy: () => void;
};

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export function createHeroGL(canvas: HTMLCanvasElement, image: HTMLImageElement, surface: HTMLElement, onLost: () => void): HeroGL | null {
  const context = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  if (!context || context.isContextLost() || !image.naturalWidth) return null;
  const gl = context;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // No UNPACK_FLIP_Y: vUv already runs top-down, as the CSS framing does.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  try {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  } catch {
    return null;
  }

  const loc = (name: string) => gl.getUniformLocation(program, name);
  const uRes = loc("uRes");
  const uTime = loc("uTime");
  const uReveal = loc("uReveal");
  const uScale = loc("uScale");
  const uPointer = loc("uPointer");
  const uPointerAmt = loc("uPointerAmt");
  const uLight = loc("uLight");
  gl.uniform1f(loc("uImgAspect"), image.naturalWidth / image.naturalHeight);
  gl.uniform1i(loc("uTex"), 0);

  const u = { reveal: 0, scale: 1.14, light: 1 };
  const pointer = { x: 0.5, y: 0.5, amt: 0 };
  const target = { x: 0.5, y: 0.5, amt: 0 };
  let width = 0;
  let height = 0;
  let frame = 0;
  let running = false;
  const started = performance.now();

  function resize() {
    const rect = surface.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);
    if (!w || !h || (w === width && h === height)) return;
    width = w;
    height = h;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uRes, w, h);
  }

  function draw() {
    resize();
    pointer.x += (target.x - pointer.x) * 0.06;
    pointer.y += (target.y - pointer.y) * 0.06;
    pointer.amt += (target.amt - pointer.amt) * 0.05;
    gl.uniform1f(uTime, (performance.now() - started) / 1000);
    gl.uniform1f(uReveal, u.reveal);
    gl.uniform1f(uScale, u.scale);
    gl.uniform1f(uLight, u.light);
    gl.uniform2f(uPointer, pointer.x, pointer.y);
    gl.uniform1f(uPointerAmt, pointer.amt);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function tick() {
    draw();
    frame = requestAnimationFrame(tick);
  }

  function onMove(e: PointerEvent) {
    const rect = surface.getBoundingClientRect();
    target.x = (e.clientX - rect.left) / rect.width;
    target.y = (e.clientY - rect.top) / rect.height;
    target.amt = 1;
  }
  function onLeave() {
    target.amt = 0;
    target.x = 0.5;
    target.y = 0.5;
  }

  function onContextLost(e: Event) {
    e.preventDefault();
    running = false;
    cancelAnimationFrame(frame);
    onLost();
  }

  surface.addEventListener("pointermove", onMove, { passive: true });
  surface.addEventListener("pointerleave", onLeave, { passive: true });
  canvas.addEventListener("webglcontextlost", onContextLost);

  return {
    u,
    start() {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    },
    stop() {
      running = false;
      cancelAnimationFrame(frame);
    },
    destroy() {
      running = false;
      cancelAnimationFrame(frame);
      surface.removeEventListener("pointermove", onMove);
      surface.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      // The context itself is left alive: a canvas never gets a second one,
      // and this component may mount again on the same element.
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    },
  };
}
