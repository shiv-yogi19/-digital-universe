/* Shiv Yogi Digital Universe: engines (random, wallpaper, text, button, transition, ui) */
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || innerWidth < 700;
const INTENSITY = { low: .4, medium: .7, high: 1, ultra: 1.3 };

/* ---------- Random engine (weighted, no immediate repeats) ---------- */
const Rand = {
  int: (a, b) => a + Math.floor(Math.random() * (b - a + 1)),
  f: (a, b) => a + Math.random() * (b - a),
  pick: a => a[Math.floor(Math.random() * a.length)],
  weighted(items) { // [[value, weight], ...]
    let t = items.reduce((s, i) => s + i[1], 0), r = Math.random() * t;
    for (const [v, w] of items) { if ((r -= w) <= 0) return v; } return items[0][0];
  },
  fresh(key, list) { // avoids the value used last visit
    let last; try { last = sessionStorage.getItem(key); } catch (e) {}
    const pool = list.length > 1 ? list.filter(x => String(x) !== last) : list;
    const v = this.pick(pool);
    try { sessionStorage.setItem(key, String(v)); } catch (e) {}
    return v;
  },
  shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Rand.int(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; }
};

/* ---------- Wallpaper engine ---------- */
const PALETTES = [[265, 190, 330], [200, 260, 170], [320, 270, 200], [160, 200, 280], [20, 330, 270], [240, 180, 300]];
const WallLayers = {
  stars(c, d, hs) { const n = Math.round(110 * d), s = Array.from({ length: n }, () => ({ x: Math.random(), y: Math.random(), r: Rand.f(.4, 1.5), p: Rand.f(0, 6) }));
    return (g, t, dt, w, h) => { g.fillStyle = "#fff"; s.forEach(o => { g.globalAlpha = .35 + .3 * Math.sin(t / 900 + o.p); g.beginPath(); g.arc(o.x * w, o.y * h, o.r, 0, 7); g.fill(); }); g.globalAlpha = 1; }; },
  parallaxStars(c, d, hs, P) { const L = [0, 1, 2].map(i => Array.from({ length: Math.round(45 * d) }, () => ({ x: Math.random(), y: Math.random(), r: .5 + i * .5 })));
    return (g, t, dt, w, h) => { L.forEach((l, i) => { const ox = (P.x - .5) * 18 * (i + 1), oy = (P.y - .5) * 18 * (i + 1); g.fillStyle = `rgba(255,255,255,${.3 + i * .2})`; l.forEach(o => { o.y += dt * .000008 * (i + 1); if (o.y > 1) o.y = 0; g.beginPath(); g.arc(o.x * w + ox, o.y * h + oy, o.r, 0, 7); g.fill(); }); }); }; },
  shooting(c, d, hs) { const arr = [];
    return (g, t, dt, w, h) => { if (Math.random() < .006 * d) arr.push({ x: Rand.f(.2, 1) * w, y: Rand.f(0, .5) * h, l: 0, v: Rand.f(8, 14) });
      for (let i = arr.length - 1; i >= 0; i--) { const s = arr[i]; s.x -= s.v; s.y += s.v * .5; s.l++; const a = 1 - s.l / 45; if (a <= 0) { arr.splice(i, 1); continue; }
        const gr = g.createLinearGradient(s.x, s.y, s.x + 70, s.y - 35); gr.addColorStop(0, `rgba(255,255,255,${a})`); gr.addColorStop(1, "transparent"); g.strokeStyle = gr; g.lineWidth = 1.6; g.beginPath(); g.moveTo(s.x, s.y); g.lineTo(s.x + 70, s.y - 35); g.stroke(); } }; },
  particles(c, d, hs) { const p = Array.from({ length: Math.round(55 * d) }, () => ({ x: Math.random(), y: Math.random(), v: Rand.f(.00001, .00005), r: Rand.f(1, 3), h: Rand.pick(hs) }));
    return (g, t, dt, w, h) => { p.forEach(o => { o.y -= o.v * dt; if (o.y < -.02) { o.y = 1.02; o.x = Math.random(); } g.fillStyle = `hsla(${o.h},90%,70%,.5)`; g.beginPath(); g.arc(o.x * w + Math.sin(t / 2000 + o.x * 9) * 12, o.y * h, o.r, 0, 7); g.fill(); }); }; },
  dust(c, d, hs) { const p = Array.from({ length: Math.round(90 * d) }, () => ({ x: Math.random(), y: Math.random(), a: Rand.f(0, 6), r: Rand.f(.5, 1.2) }));
    return (g, t, dt, w, h) => { g.fillStyle = "rgba(200,190,255,.35)"; p.forEach(o => { o.a += .0004 * dt; g.beginPath(); g.arc((o.x + Math.cos(o.a) * .02) * w, (o.y + Math.sin(o.a) * .02) * h, o.r, 0, 7); g.fill(); }); }; },
  bokeh(c, d, hs) { const p = Array.from({ length: Math.round(14 * d) }, () => ({ x: Math.random(), y: Math.random(), r: Rand.f(18, 60), h: Rand.pick(hs), v: Rand.f(.00001, .00003) }));
    return (g, t, dt, w, h) => { p.forEach(o => { o.y -= o.v * dt; if (o.y < -.1) o.y = 1.1; g.fillStyle = `hsla(${o.h},90%,65%,.07)`; g.beginPath(); g.arc(o.x * w, o.y * h, o.r, 0, 7); g.fill(); g.strokeStyle = `hsla(${o.h},90%,75%,.12)`; g.stroke(); }); }; },
  constellation(c, d, hs, P) { const n = Math.round(42 * d), p = Array.from({ length: n }, () => ({ x: Math.random(), y: Math.random(), vx: Rand.f(-1, 1) * .00002, vy: Rand.f(-1, 1) * .00002 })), md = IS_MOBILE ? 110 : 150;
    return (g, t, dt, w, h) => { p.forEach(o => { o.x = (o.x + o.vx * dt + 1) % 1; o.y = (o.y + o.vy * dt + 1) % 1; });
      for (let i = 0; i < n; i++) { const a = p[i]; g.fillStyle = "rgba(255,255,255,.6)"; g.beginPath(); g.arc(a.x * w, a.y * h, 1.4, 0, 7); g.fill();
        for (let j = i + 1; j < n; j++) { const b = p[j], dx = (a.x - b.x) * w, dy = (a.y - b.y) * h, q = Math.hypot(dx, dy); if (q < md) { g.strokeStyle = `rgba(160,150,255,${.25 * (1 - q / md)})`; g.beginPath(); g.moveTo(a.x * w, a.y * h); g.lineTo(b.x * w, b.y * h); g.stroke(); } } }
      const mx = P.x * w, my = P.y * h; p.forEach(o => { const q = Math.hypot(o.x * w - mx, o.y * h - my); if (q < 140) { g.strokeStyle = `rgba(34,211,238,${.4 * (1 - q / 140)})`; g.beginPath(); g.moveTo(o.x * w, o.y * h); g.lineTo(mx, my); g.stroke(); } }); }; },
  orbs(c, d, hs) { const o = Array.from({ length: Math.round(5 * d) + 2 }, (_, i) => ({ a: Rand.f(0, 6), s: Rand.f(.00015, .0004), R: Rand.f(.12, .38), r: Rand.f(60, 140), h: hs[i % hs.length] }));
    return (g, t, dt, w, h) => { g.globalCompositeOperation = "lighter"; o.forEach(b => { b.a += b.s * dt; const x = w / 2 + Math.cos(b.a) * b.R * w, y = h / 2 + Math.sin(b.a * 1.3) * b.R * h, gr = g.createRadialGradient(x, y, 0, x, y, b.r); gr.addColorStop(0, `hsla(${b.h},90%,60%,.28)`); gr.addColorStop(1, "transparent"); g.fillStyle = gr; g.fillRect(x - b.r, y - b.r, b.r * 2, b.r * 2); }); g.globalCompositeOperation = "source-over"; }; },
  rain(c, d, hs) { const cols = Array.from({ length: Math.round(28 * d) }, () => ({ x: Math.random(), y: Math.random(), v: Rand.f(.0002, .0006), l: Rand.int(6, 16) }));
    return (g, t, dt, w, h) => { g.font = "13px monospace"; cols.forEach(o => { o.y += o.v * dt; if (o.y > 1.1) { o.y = -.1; o.x = Math.random(); } for (let i = 0; i < o.l; i++) { g.fillStyle = `hsla(${hs[0]},90%,70%,${(1 - i / o.l) * .35})`; g.fillText(String.fromCharCode(0x30A0 + ((o.x * 999 + i * 7 + (t / 120 | 0)) % 90 | 0)), o.x * w, o.y * h - i * 14); } }); }; },
  grid(c, d, hs) { return (g, t, dt, w, h) => { const hz = h * .55, sp = (t / 40) % 40; g.strokeStyle = `hsla(${hs[0]},90%,65%,.22)`; g.lineWidth = 1; g.beginPath();
      for (let i = -10; i <= 10; i++) { g.moveTo(w / 2, hz); g.lineTo(w / 2 + i * w * .18, h); }
      for (let k = 1; k < 14; k++) { const y = hz + Math.pow((k + sp / 40) / 14, 2) * (h - hz); g.moveTo(0, y); g.lineTo(w, y); } g.stroke(); }; },
  flatGrid(c, d, hs) { return (g, t, dt, w, h) => { const s = 56, ox = (t / 60) % s, oy = (t / 90) % s; g.strokeStyle = "rgba(139,92,246,.1)"; g.beginPath(); for (let x = -s + ox; x < w; x += s) { g.moveTo(x, 0); g.lineTo(x, h); } for (let y = -s + oy; y < h; y += s) { g.moveTo(0, y); g.lineTo(w, y); } g.stroke(); }; },
  rings(c, d, hs) { return (g, t, dt, w, h) => { for (let i = 0; i < 4; i++) { const p = ((t / 6000) + i / 4) % 1; g.strokeStyle = `hsla(${hs[i % hs.length]},90%,65%,${.28 * (1 - p)})`; g.lineWidth = 1.5; g.beginPath(); g.arc(w / 2, h * .32, p * Math.max(w, h) * .6, 0, 7); g.stroke(); } }; },
  pulse(c, d, hs, P) { return (g, t, dt, w, h) => { const r = 120 + 40 * Math.sin(t / 700), gr = g.createRadialGradient(P.x * w, P.y * h, 0, P.x * w, P.y * h, r * 2); gr.addColorStop(0, `hsla(${hs[1]},90%,60%,.18)`); gr.addColorStop(1, "transparent"); g.fillStyle = gr; g.fillRect(0, 0, w, h); }; },
  waves(c, d, hs) { return (g, t, dt, w, h) => { for (let k = 0; k < 3; k++) { g.strokeStyle = `hsla(${hs[k % hs.length]},90%,65%,.22)`; g.lineWidth = 1.5; g.beginPath(); for (let x = 0; x <= w; x += 12) { const y = h * (.7 + k * .07) + Math.sin(x / 90 + t / (1200 + k * 300)) * 22 + Math.sin(x / 40 - t / 900) * 6; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); } }; },
  fireflies(c, d, hs) { const f = Array.from({ length: Math.round(22 * d) }, () => ({ x: Math.random(), y: Math.random(), a: Rand.f(0, 6), p: Rand.f(0, 6) }));
    return (g, t, dt, w, h) => { f.forEach(o => { o.a += .0006 * dt; const x = (o.x + Math.cos(o.a) * .04) * w, y = (o.y + Math.sin(o.a * 1.3) * .04) * h, al = .3 + .5 * Math.abs(Math.sin(t / 1000 + o.p)), gr = g.createRadialGradient(x, y, 0, x, y, 12); gr.addColorStop(0, `rgba(253,230,138,${al})`); gr.addColorStop(1, "transparent"); g.fillStyle = gr; g.fillRect(x - 12, y - 12, 24, 24); }); }; },
  spiral(c, d, hs) { return (g, t, dt, w, h) => { const n = Math.round(120 * d); for (let i = 0; i < n; i++) { const a = i * .35 + t / 5000, r = i * (Math.min(w, h) * .0042); g.fillStyle = `hsla(${hs[i % 3]},90%,70%,${.5 - i / n * .45})`; g.beginPath(); g.arc(w / 2 + Math.cos(a) * r * 1.4, h * .45 + Math.sin(a) * r * .55, 1.4, 0, 7); g.fill(); } }; },
  beams(c, d, hs) { return (g, t, dt, w, h) => { g.globalCompositeOperation = "lighter"; for (let i = 0; i < 3; i++) { const x = w * (.2 + i * .3) + Math.sin(t / 3000 + i) * 60, gr = g.createLinearGradient(x, 0, x + 80, h); gr.addColorStop(0, `hsla(${hs[i]},90%,65%,.12)`); gr.addColorStop(1, "transparent"); g.fillStyle = gr; g.beginPath(); g.moveTo(x - 10, 0); g.lineTo(x + 30, 0); g.lineTo(x + 180, h); g.lineTo(x - 120, h); g.fill(); } g.globalCompositeOperation = "source-over"; }; },
  geometry(c, d, hs) { const s = Array.from({ length: Math.round(7 * d) + 1 }, () => ({ x: Math.random(), y: Math.random(), r: Rand.f(14, 34), n: Rand.int(3, 6), a: Rand.f(0, 6), v: Rand.f(-.0005, .0005) }));
    return (g, t, dt, w, h) => { g.strokeStyle = "rgba(180,170,255,.25)"; s.forEach(o => { o.a += o.v * dt; g.beginPath(); for (let i = 0; i <= o.n; i++) { const a = o.a + i * 6.283 / o.n; g.lineTo(o.x * w + Math.cos(a) * o.r, o.y * h + Math.sin(a) * o.r + Math.sin(t / 2000 + o.x * 9) * 8); } g.stroke(); }); }; },
  plasma(c, d, hs) { return (g, t, dt, w, h) => { g.globalCompositeOperation = "lighter"; for (let i = 0; i < 3; i++) { const x = w * (.5 + Math.sin(t / 4000 + i * 2) * .35), y = h * (.5 + Math.cos(t / 5000 + i * 3) * .3), r = Math.max(w, h) * .3, gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `hsla(${hs[i]},85%,55%,.2)`); gr.addColorStop(1, "transparent"); g.fillStyle = gr; g.fillRect(0, 0, w, h); } g.globalCompositeOperation = "source-over"; }; },
  sparkles(c, d, hs) { const a = []; return (g, t, dt, w, h) => { if (Math.random() < .05 * d) a.push({ x: Math.random() * w, y: Math.random() * h, l: 0 }); for (let i = a.length - 1; i >= 0; i--) { const s = a[i]; s.l++; const k = Math.sin(s.l / 40 * Math.PI); if (s.l > 40) { a.splice(i, 1); continue; } g.strokeStyle = `rgba(255,255,255,${k})`; g.beginPath(); g.moveTo(s.x - 6 * k, s.y); g.lineTo(s.x + 6 * k, s.y); g.moveTo(s.x, s.y - 6 * k); g.lineTo(s.x, s.y + 6 * k); g.stroke(); } }; }
};
const WALL_SESSIONS = [
  ["stars", "plasma", "particles", "pulse"], ["waves", "shooting", "orbs", "bokeh"], ["grid", "constellation", "pulse", "dust"],
  ["parallaxStars", "constellation", "shooting", "rings"], ["flatGrid", "fireflies", "beams", "sparkles"], ["spiral", "stars", "orbs", "dust"],
  ["rain", "grid", "pulse"], ["geometry", "bokeh", "plasma", "sparkles"], ["stars", "shooting", "dust"], ["orbs", "waves", "fireflies", "parallaxStars"]
];
class WallpaperEngine {
  constructor(canvas) { this.cv = canvas; this.g = canvas.getContext("2d"); this.P = { x: .5, y: .3 }; this.layers = []; this.run = false; this.last = 0;
    addEventListener("resize", () => this.size()); this.size();
    addEventListener("pointermove", e => { this.P.x = e.clientX / innerWidth; this.P.y = e.clientY / innerHeight; }, { passive: true });
    document.addEventListener("visibilitychange", () => document.hidden ? this.stop() : this.start()); }
  size() { const r = Math.min(devicePixelRatio || 1, IS_MOBILE ? 1.5 : 2); this.w = innerWidth; this.h = innerHeight; this.cv.width = this.w * r; this.cv.height = this.h * r; this.g.setTransform(r, 0, 0, r, 0, 0); }
  load(names, pal, density) { const d = density * (IS_MOBILE ? .55 : 1); this.layers = names.map(n => WallLayers[n](this.cv, d, pal, this.P)); this.names = names; }
  start() { if (this.run || !this.layers.length) return; this.run = true; this.last = performance.now(); const loop = t => { if (!this.run) return; const dt = Math.min(t - this.last, 50); this.last = t;
      if (!REDUCED || !this.drawn) { this.g.clearRect(0, 0, this.w, this.h); this.layers.forEach(l => l(this.g, t, dt, this.w, this.h)); this.drawn = true; }
      this.raf = requestAnimationFrame(loop); }; this.raf = requestAnimationFrame(loop); }
  stop() { this.run = false; cancelAnimationFrame(this.raf); }
  randomize(intensity) { const names = Rand.fresh("wall", WALL_SESSIONS.map(s => s.join("+"))).split("+"); const pal = Rand.pick(PALETTES); this.load(names, pal, intensity); return names; }
}

/* ---------- Text engine ---------- */
const TextEngine = {
  styles: ["fade", "typewriter", "chars", "words", "slideUp", "slideDown", "blur", "glow", "scramble", "spacing", "scale", "wave", "glitch", "shimmer", "split"],
  _chars(el, text) { el.textContent = ""; return [...text].map(c => { const s = document.createElement("span"); s.className = "ch"; s.textContent = c; el.appendChild(s); return s; }); },
  _words(el, text) { el.textContent = ""; return text.split(" ").map((w, i, a) => { const s = document.createElement("span"); s.className = "ch"; s.textContent = w + (i < a.length - 1 ? " " : ""); el.appendChild(s); return s; }); },
  _a(els, kf, o = {}) { return Promise.all([].concat(els).map((e, i) => e.animate(kf, { duration: o.d || 600, delay: (o.s || 0) * i, easing: o.e || "cubic-bezier(.2,.8,.2,1)", fill: "both" }).finished)); },
  async play(el, text, style) {
    const ST = style || Rand.pick(this.styles); el.setAttribute("aria-label", text);
    if (REDUCED) { el.textContent = text; return; }
    const A = this._a, ch = () => this._chars(el, text), wd = () => this._words(el, text);
    switch (ST) {
      case "typewriter": { el.textContent = ""; for (const c of text) { el.textContent += c; await new Promise(r => setTimeout(r, 38)); } break; }
      case "chars": await A(ch(), [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { s: 30 }); break;
      case "words": await A(wd(), [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { s: 110 }); break;
      case "slideUp": el.textContent = text; await A(el, [{ opacity: 0, transform: "translateY(26px)" }, { opacity: 1, transform: "none" }]); break;
      case "slideDown": el.textContent = text; await A(el, [{ opacity: 0, transform: "translateY(-26px)" }, { opacity: 1, transform: "none" }]); break;
      case "blur": el.textContent = text; await A(el, [{ opacity: 0, filter: "blur(14px)" }, { opacity: 1, filter: "blur(0)" }], { d: 900 }); break;
      case "glow": el.textContent = text; await A(el, [{ opacity: 0, textShadow: "0 0 40px #fff" }, { opacity: 1, textShadow: "0 0 18px #8b5cf6" }, { opacity: 1, textShadow: "0 0 0 transparent" }], { d: 1100 }); break;
      case "scramble": { const pool = "!<>-_\\/[]{}=+*^?#"; for (let i = 0; i <= text.length; i++) { el.textContent = text.slice(0, i) + [...text.slice(i)].map(c => c === " " ? " " : pool[Rand.int(0, pool.length - 1)]).join(""); await new Promise(r => setTimeout(r, 30)); } el.textContent = text; break; }
      case "spacing": el.textContent = text; await A(el, [{ opacity: 0, letterSpacing: ".6em" }, { opacity: 1, letterSpacing: "normal" }], { d: 1000 }); break;
      case "scale": el.textContent = text; await A(el, [{ opacity: 0, transform: "scale(.6)" }, { opacity: 1, transform: "scale(1)" }], { e: "cubic-bezier(.3,1.5,.5,1)" }); break;
      case "wave": await A(ch(), [{ transform: "translateY(0)", opacity: 0 }, { transform: "translateY(-10px)", opacity: 1 }, { transform: "translateY(0)", opacity: 1 }], { s: 35, d: 700 }); break;
      case "glitch": el.textContent = text; await A(el, [{ opacity: 0 }, { opacity: 1, transform: "translateX(-6px)", textShadow: "3px 0 #22d3ee,-3px 0 #fb7185" }, { opacity: .6, transform: "translateX(5px)" }, { opacity: 1, transform: "none", textShadow: "none" }], { d: 600, e: "steps(6)" }); break;
      case "shimmer": el.textContent = text; await A(el, [{ opacity: 0, filter: "brightness(3)" }, { opacity: 1, filter: "brightness(1)" }], { d: 900 }); break;
      case "split": { const c = ch(); c.forEach((s, i) => s.animate([{ opacity: 0, transform: `translateX(${i % 2 ? 20 : -20}px)` }, { opacity: 1, transform: "none" }], { duration: 600, delay: i * 25, fill: "both", easing: "ease-out" })); await new Promise(r => setTimeout(r, 600 + c.length * 25)); break; }
      default: el.textContent = text; await A(el, [{ opacity: 0 }, { opacity: 1 }], { d: 800 });
    }
    el.textContent = text;
  }
};

/* ---------- Transition engine (clip-path wipes over the curtain) ---------- */
const TransitionEngine = {
  shapes: {
    circleOpen: ["circle(0 at 50% 50%)", "circle(150% at 50% 50%)"], circleTop: ["circle(0 at 50% 0)", "circle(150% at 50% 0)"], circleBottom: ["circle(0 at 50% 100%)", "circle(150% at 50% 100%)"],
    wipeLeft: ["inset(0 100% 0 0)", "inset(0)"], wipeRight: ["inset(0 0 0 100%)", "inset(0)"], wipeUp: ["inset(100% 0 0 0)", "inset(0)"], wipeDown: ["inset(0 0 100% 0)", "inset(0)"],
    diagonal: ["polygon(0 0,0 0,0 0)", "polygon(0 0,250% 0,0 250%)"], curtain: ["inset(0 50% 0 50%)", "inset(0)"], blinds: ["inset(50% 0 50% 0)", "inset(0)"], diamond: ["polygon(50% 50%,50% 50%,50% 50%,50% 50%)", "polygon(50% -50%,150% 50%,50% 150%,-50% 50%)"]
  },
  names() { return Object.keys(this.shapes); },
  async play(name, mid) {
    const c = document.getElementById("curtain"), n = name || Rand.pick(this.names());
    if (REDUCED) { mid && await mid(); return; }
    const [a, b] = this.shapes[n]; c.style.display = "block";
    await c.animate([{ clipPath: a }, { clipPath: b }], { duration: 550, easing: "cubic-bezier(.7,0,.3,1)", fill: "forwards" }).finished;
    mid && await mid();
    await c.animate([{ clipPath: b, opacity: 1 }, { clipPath: b, opacity: 0 }], { duration: 650, fill: "forwards" }).finished;
    c.style.display = "none"; c.getAnimations().forEach(x => x.cancel());
  }
};

/* ---------- Button engine ---------- */
const ButtonEngine = {
  fx: ["fx-shine", "fx-breathe", "fx-floatbtn", "fx-pulse", "fx-border", "fx-iconspin", "fx-iconbounce", "fx-textslide", "fx-arrowbounce", "fx-corner", "fx-neon", "fx-lift", "fx-shake"],
  decorate(a, big) {
    const glow = document.createElement("span"); glow.className = "glow"; a.prepend(glow);
    const n = big ? 2 : 3; if (!REDUCED) Rand.shuffle(this.fx).slice(0, n).forEach(c => a.classList.add(c));
    a.addEventListener("pointermove", e => { const r = a.getBoundingClientRect(); a.style.setProperty("--bx", e.clientX - r.left + "px"); a.style.setProperty("--by", e.clientY - r.top + "px");
      if (REDUCED || e.pointerType !== "mouse") return; const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5; a.style.transform = `perspective(700px) rotateX(${-py * 8}deg) rotateY(${px * 8}deg) translate(${px * 6}px,${py * 4}px)`; });
    a.addEventListener("pointerleave", () => { a.style.transform = ""; });
    a.addEventListener("pointerdown", e => { const r = a.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2, d = document.createElement("span"); d.className = "rip"; d.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`; a.appendChild(d); setTimeout(() => d.remove(), 750); if (!REDUCED) this.burst(e.clientX, e.clientY, a.style.getPropertyValue("--c")); });
  },
  burst(x, y, color) { for (let i = 0; i < 10; i++) { const s = document.createElement("i"); s.className = "spark"; s.style.cssText = `left:${x}px;top:${y}px;background:${color || "#fff"}`; document.body.appendChild(s); const a = Rand.f(0, 6.28), d = Rand.f(24, 70);
      s.animate([{ transform: "translate(0,0) scale(1)", opacity: 1 }, { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px) scale(0)`, opacity: 0 }], { duration: 600, easing: "ease-out" }).finished.then(() => s.remove()); } }
};

/* ---------- UI engine ---------- */
const UIEngine = {
  entrances: [
    [{ opacity: 0, transform: "translateY(30px)" }, { opacity: 1, transform: "none" }], [{ opacity: 0, transform: "scale(.9)", filter: "blur(8px)" }, { opacity: 1, transform: "none", filter: "blur(0)" }],
    [{ opacity: 0, transform: "translateX(-30px)" }, { opacity: 1, transform: "none" }], [{ opacity: 0, transform: "perspective(600px) rotateX(25deg) translateY(20px)" }, { opacity: 1, transform: "none" }],
    [{ opacity: 0, transform: "scale(.7)" }, { opacity: 1, transform: "none" }]
  ],
  stagger(els) { const kf = Rand.pick(this.entrances); els.forEach((e, i) => e.animate(kf, { duration: REDUCED ? 1 : 700, delay: REDUCED ? 0 : 90 * i, easing: "cubic-bezier(.2,.9,.3,1.2)", fill: "backwards" })); },
  pointer(profileEl, spotEl, avatarEl) {
    if (REDUCED) return; let tx = 0, ty = 0;
    addEventListener("pointermove", e => { document.documentElement.style.setProperty("--mx", e.clientX + "px"); document.documentElement.style.setProperty("--my", e.clientY + "px"); tx = (e.clientX / innerWidth - .5); ty = (e.clientY / innerHeight - .5); if (e.pointerType !== "mouse") { spotEl.style.opacity = 1; } }, { passive: true });
    const loop = () => { profileEl.style.transform = `translate3d(${tx * -10}px,${ty * -8}px,0)`; avatarEl.style.transform = `perspective(600px) rotateY(${tx * 18}deg) rotateX(${-ty * 18}deg)`; requestAnimationFrame(loop); };
    if (!IS_MOBILE) loop();
    avatarEl.addEventListener("click", () => { ButtonEngine.burst(avatarEl.getBoundingClientRect().left + 64, avatarEl.getBoundingClientRect().top + 64, "#c4b5fd"); avatarEl.animate([{ scale: 1 }, { scale: 1.15 }, { scale: 1 }], { duration: 500, easing: "ease-out" }); });
  },
  scrollReveal(els) { const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add("in")), { threshold: .15 }); els.forEach(e => { e.classList.add("reveal-on-scroll"); io.observe(e); }); },
  toast(msg) { const t = document.getElementById("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(this._t); this._t = setTimeout(() => t.classList.remove("show"), 2200); }
};

/* ---------- Optional sound (generated in-browser, starts only after a tap) ---------- */
const SoundEngine = {
  ctx: null, on: false,
  toggle() { if (!this.ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false; this.ctx = new AC(); this.g = this.ctx.createGain(); this.g.gain.value = 0; this.g.connect(this.ctx.destination);
      [110, 164.8, 220, 277.2].forEach((f, i) => { const o = this.ctx.createOscillator(), l = this.ctx.createOscillator(), lg = this.ctx.createGain(); o.type = "sine"; o.frequency.value = f; l.frequency.value = .05 + i * .03; lg.gain.value = 1.5; l.connect(lg); lg.connect(o.frequency); o.connect(this.g); o.start(); l.start(); }); }
    this.on = !this.on; this.ctx.resume(); this.g.gain.linearRampToValueAtTime(this.on ? .05 : 0, this.ctx.currentTime + 1); return this.on; }
};
