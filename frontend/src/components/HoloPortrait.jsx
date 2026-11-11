import { useEffect, useRef, useState } from "react";
import portrait1 from "./holo-1.png";
import portrait2 from "./holo-2.png";
import portrait3 from "./holo-3.png";
import portrait1Light from "./holo-1-light.png";
import fallbackPhoto from "./navbar-logo.webp";
import "./HoloPortrait.css";

/*
 * Holographic portrait: three photos rebuilt as one WebGL point cloud that
 * morphs from one to the next every 30 seconds, in order.
 *
 * holo-1/2/3.png are baked data textures (not pictures): R = tone, G = depth,
 * B = subject mask. All are framed identically around the face (same size,
 * same face position), so every particle has a home in each portrait and only
 * travels a short way when the cloud morphs. A sparse grid
 * of particles is wired into contour lines. Each frame draws the cloud three
 * times — cyan and violet copies offset in opposite directions plus a white
 * core — with additive blending, which gives the chromatic-aberration fringe.
 *
 * The cursor tilts the cloud (orthographic, so depth reads as parallax) and
 * pushes particles outward and forward around it; a click or tap skips to the
 * next portrait. It pauses off-screen and in background tabs, and renders still
 * frames for reduced motion.
 */

const VERT = `
attribute vec4 a_p01;      // home in portrait 1 (xy) and 2 (zw), model space
attribute vec2 a_p2;       // home in portrait 3
attribute vec4 a_d0;       // tone, depth, mask in portrait 1; random seed (tone < 0 marks ambient dust)
attribute vec3 a_d1;       // tone, depth, mask in portrait 2
attribute vec3 a_d2;       // tone, depth, mask in portrait 3
uniform vec3  u_from;      // one-hot: the portrait being left
uniform vec3  u_to;        // one-hot: the portrait being formed
uniform float u_time;
uniform float u_mix;       // 0 = u_from, 1 = u_to
uniform vec2  u_tilt;      // radians: (yaw, pitch)
uniform vec2  u_mouse;     // model space
uniform float u_hover;     // 0..1
uniform float u_aspect;
uniform float u_scale;
uniform vec2  u_offset;    // chromatic offset for this pass (clip space)
uniform float u_size;      // point size in px
uniform float u_lines;     // 1 when drawing the wireframe
uniform float u_lineFade;  // wireframe opacity for the portrait being drawn
uniform float u_glitch;    // 0..1 burst
uniform float u_light;     // 1 on the light theme: particles act as ink, not light
varying float v_int;
varying float v_alpha;
varying float v_depth;

void main() {
  float rnd = a_d0.w;
  bool dust = a_d0.x < 0.0;
  vec2 posFrom = a_p01.xy * u_from.x + a_p01.zw * u_from.y + a_p2 * u_from.z;
  vec2 posTo   = a_p01.xy * u_to.x   + a_p01.zw * u_to.y   + a_p2 * u_to.z;
  vec3 dFrom = a_d0.xyz * u_from.x + a_d1 * u_from.y + a_d2 * u_from.z;
  vec3 dTo   = a_d0.xyz * u_to.x   + a_d1 * u_to.y   + a_d2 * u_to.z;

  // Staggered morph: a wave runs top to bottom, each particle arcing out of the plane.
  float start = 0.4 * (1.0 - (posFrom.y + 1.0) * 0.5) + rnd * 0.08;
  float m = smoothstep(start, start + 0.52, u_mix);
  float transit = sin(m * 3.14159);
  vec2 home = mix(posFrom, posTo, m);
  float lum = mix(dFrom.x, dTo.x, m);
  float depth = mix(dFrom.y, dTo.y, m);
  float mask = mix(dFrom.z, dTo.z, m);

  vec3 p = vec3(home, (depth - 0.5) * 0.42);
  p.z += transit * (rnd - 0.5) * 0.7;
  p.x += transit * (fract(rnd * 7.31) - 0.5) * 0.12;

  // Ambient dust drifts slowly upward and wraps.
  if (dust) {
    lum = 0.0; mask = 0.0;
    p.y = mod(p.y + u_time * (0.02 + rnd * 0.03) + 1.2, 2.4) - 1.2;
    p.x += sin(u_time * 0.4 + rnd * 40.0) * 0.02;
    p.z = (rnd - 0.5) * 0.9;
  }

  // Idle breathing.
  p.z += sin(u_time * 1.4 + rnd * 6.2831) * 0.006 * mask;

  // Cursor displacement: particles near the pointer are pushed out and toward the viewer.
  vec2 dv = p.xy - u_mouse;
  float near = exp(-dot(dv, dv) / 0.035) * u_hover;
  p.xy += normalize(dv + 1e-5) * near * (0.06 + rnd * 0.05) * mask;
  p.z += near * 0.25 * mask;

  // Glitch: shear a thin horizontal slice sideways.
  float slice = step(0.92, fract(sin(floor(p.y * 18.0) * 91.7 + floor(u_time * 9.0)) * 4375.5));
  p.x += slice * u_glitch * 0.05 * (rnd - 0.3);

  // Rotate (yaw then pitch); orthographic projection.
  float cy = cos(u_tilt.x), sy = sin(u_tilt.x);
  p = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);
  float cp = cos(u_tilt.y), sp = sin(u_tilt.y);
  p = vec3(p.x, cp * p.y - sp * p.z, sp * p.y + cp * p.z);

  gl_Position = vec4(p.x / u_aspect * u_scale + u_offset.x, p.y * u_scale + u_offset.y, -p.z * 0.5, 1.0);

  // Scan band sweeping down the figure.
  float scanY = 1.25 - mod(u_time * 0.32, 2.9);
  float scan = exp(-pow((home.y - scanY) * 11.0, 2.0));
  // Rim light where the depth falls off at the silhouette.
  float rim = smoothstep(0.32, 0.05, depth) * mask;

  if (dust) {
    v_int = 0.35 + 0.35 * rnd;
    v_alpha = 0.35;
  } else {
    float shimmer = 0.9 + 0.1 * sin(rnd * 50.0 + u_time * 2.0);
    if (u_light > 0.5) {
      // Ink: dark areas (hair, beard, glasses) print densest, bright skin stays pale.
      float ink = 0.08 + pow(1.0 - smoothstep(0.04, 0.96, lum), 1.1) * 0.95;
      v_int = ink * shimmer + scan * 0.35 + rim * 0.3 + near * 0.3 + transit * 0.3;
    } else {
      float tone = 0.06 + pow(lum, 1.15) * 1.05;   // headroom so bright skin keeps its detail
      v_int = tone * shimmer + scan * 0.9 + rim * 0.7 + near * 0.8 + transit * 0.6;
    }
    v_alpha = mask;
  }
  if (u_lines > 0.5) {
    v_int = 0.55 + scan * 1.2 + near;
    v_alpha = mask * 0.22 * u_lineFade;
  }
  v_depth = depth;
  gl_PointSize = dust ? u_size * (0.6 + rnd) : u_size * (0.8 + lum * 0.4 + scan * 0.5 + transit * 0.4);
}`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;     // must match the vertex shader for shared uniforms
#else
precision mediump float;
#endif
uniform vec3  u_color;
uniform vec3  u_color2;    // depth tint for the wireframe
uniform float u_lines;
uniform float u_light;
varying float v_int;
varying float v_alpha;
varying float v_depth;
void main() {
  float a = v_alpha;
  if (u_lines < 0.5) {
    float r = length(gl_PointCoord - 0.5);
    a *= smoothstep(0.5, 0.0, r);
  }
  vec3 c = u_lines > 0.5 ? mix(u_color2, u_color, v_depth) : u_color;
  float i = u_light > 0.5 ? min(v_int, 1.0) : v_int;
  if (u_light > 0.5) {
    float ink = a * i;               // premultiplied ink over the page
    gl_FragColor = vec4(c * ink, ink);
  } else {
    gl_FragColor = vec4(c * i * a, a * min(i, 1.0));
  }
}`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader compile failed");
  return s;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Every subject pixel (on a `step` grid) of one baked portrait, in scan order.
function samplePortrait(img, step) {
  const c = document.createElement("canvas");
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  const { data, width: w, height: h } = ctx.getImageData(0, 0, c.width, c.height);
  const aspect = w / h;
  const pts = [];
  const index = new Map(); // pixel → point number
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const i = (y * w + x) * 4;
      const mask = data[i + 2] / 255;
      if (mask < 0.3) continue;
      index.set(y * w + x, pts.length);
      pts.push([((x / (w - 1)) * 2 - 1) * aspect, 1 - (y / (h - 1)) * 2, data[i] / 255, data[i + 1] / 255, mask]);
    }
  }
  return { pts, index, w, h, aspect };
}

// Wireframe for one portrait: horizontal contours plus sparser verticals.
function contourLines(s, step, toParticle) {
  const lines = [];
  const gap = 7 * step;
  const link = (a, b) => {
    const ia = s.index.get(a), ib = s.index.get(b);
    if (ia !== undefined && ib !== undefined) lines.push(toParticle(ia), toParticle(ib));
  };
  for (let y = 0; y < s.h; y += gap)
    for (let x = 0; x + step < s.w; x += step) link(y * s.w + x, y * s.w + x + step);
  for (let x = 0; x < s.w; x += gap * 2)
    for (let y = 0; y + step < s.h; y += step) link(y * s.w + x, (y + step) * s.w + x);
  return new Uint16Array(lines);
}

// Pair the portraits particle-for-particle. Every list is in scan order, so
// matching by rank keeps each particle's trip short; where a portrait has fewer
// points, its spare particles are hidden there (mask 0) instead of doubling up.
function buildCloud(imgs, step) {
  const P = imgs.map((img) => samplePortrait(img, step));
  const n = P.map((p) => p.pts.length);
  const N = Math.max(...n);
  const dust = step === 1 ? 420 : 180;
  const total = N + dust;
  const p01 = new Float32Array(total * 4);
  const p2 = new Float32Array(total * 2);
  const d = [new Float32Array(total * 4), new Float32Array(total * 3), new Float32Array(total * 3)];
  const prev = [-1, -1, -1];
  for (let i = 0; i < N; i++) {
    for (let k = 0; k < 3; k++) {
      const idx = Math.floor((i * n[k]) / N);
      const pt = P[k].pts[idx];
      const mask = idx === prev[k] ? 0 : pt[4];
      prev[k] = idx;
      if (k === 0) p01.set([pt[0], pt[1]], i * 4);
      if (k === 1) p01.set([pt[0], pt[1]], i * 4 + 2);
      if (k === 2) p2.set([pt[0], pt[1]], i * 2);
      if (k === 0) d[0].set([pt[2], pt[3], mask, Math.random()], i * 4);
      else d[k].set([pt[2], pt[3], mask], i * 3);
    }
  }
  for (let j = 0; j < dust; j++) {
    const i = N + j;
    const x = (Math.random() * 2 - 1) * P[0].aspect * 1.05, y = Math.random() * 2.4 - 1.2;
    p01.set([x, y, x, y], i * 4);
    p2.set([x, y], i * 2);
    d[0].set([-1, 0, 0, Math.random()], i * 4);
  }
  // First particle that represents point k of a portrait with m points.
  const first = (m) => (k) => Math.ceil((k * N) / m);
  return {
    p01,
    p2,
    d,
    lines: P.map((p, k) => contourLines(p, step, first(n[k]))),
    count: total,
    aspect: P[0].aspect,
  };
}

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const PALETTE = {
  dark: { a: hex("#00eaff"), b: hex("#8b5cf6"), core: [0.86, 0.96, 1.0] },
  light: { a: hex("#0e7490"), b: hex("#6d28d9"), core: hex("#0f172a") },
};
// Same order in both themes; light mode opens on the headphones photo instead
// of the office one.
const PORTRAITS = {
  dark: [portrait1, portrait2, portrait3],
  light: [portrait1Light, portrait2, portrait3],
};
const COUNT = 3;
const HOLD = 30;      // seconds on each portrait
const MORPH = 1.8;    // seconds for a morph
const ONE_HOT = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
const pad = (k) => String(k + 1).padStart(2, "0");

export default function HoloPortrait() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const timerRef = useRef(null);
  const barRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: true, alpha: true });
    if (!gl) {
      setFailed(true);
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 768px)").matches;
    let raf = 0;
    let tick = 0;
    let visible = true;
    let disposed = false;
    let program = null;
    const buffers = [];
    let cleanup = () => {};
    const state = {
      clock: 0,          // seconds of animation actually shown (pauses off-screen)
      from: 0,
      to: 0,
      mix: 1,
      shownAt: 0,        // clock time the current portrait was asked for
      tilt: [0, 0],
      tiltTarget: [0, 0],
      mouse: [0, 0],
      hover: 0,
      hoverTarget: 0,
      glitch: 0,
      nextGlitch: 2.5,
      lastSecond: -1,
    };

    const isLight = () => document.documentElement.dataset.theme === "light";
    Promise.all([...PORTRAITS.dark, portrait1Light].map(loadImage)).then(([img1, img2, img3, img1Light]) => {
      if (disposed) return;
      let prog;
      try {
        prog = program = gl.createProgram();
        gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
        gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
      } catch (err) {
        console.error("HoloPortrait:", err);
        setFailed(true);
        return;
      }
      gl.useProgram(prog);

      // One point cloud per theme (full detail everywhere, ~40k points); only
      // the active theme's cloud is on the GPU, swapped when the theme changes.
      const clouds = {
        dark: buildCloud([img1, img2, img3], 1),
        light: buildCloud([img1Light, img2, img3], 1),
      };
      const attribs = [["a_p01", 4], ["a_p2", 2], ["a_d0", 4], ["a_d1", 3], ["a_d2", 3]].map(([name, size]) => {
        const buf = gl.createBuffer();
        buffers.push(buf);
        const loc = gl.getAttribLocation(prog, name);
        gl.enableVertexAttribArray(loc);
        return { buf, loc, size };
      });
      const lines = [0, 1, 2].map(() => {
        const buf = gl.createBuffer();
        buffers.push(buf);
        return { buf, count: 0 };
      });
      let cloud = null;
      const upload = (next) => {
        if (next === cloud) return;
        cloud = next;
        [cloud.p01, cloud.p2, cloud.d[0], cloud.d[1], cloud.d[2]].forEach((data, k) => {
          const { buf, loc, size } = attribs[k];
          gl.bindBuffer(gl.ARRAY_BUFFER, buf);
          gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
          gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
        });
        cloud.lines.forEach((data, k) => {
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lines[k].buf);
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
          lines[k].count = data.length;
        });
      };
      upload(isLight() ? clouds.light : clouds.dark);

      const U = {};
      for (const name of ["from", "to", "time", "mix", "tilt", "mouse", "hover", "aspect", "scale", "offset", "size", "lines", "lineFade", "glitch", "color", "color2", "light"])
        U[name] = gl.getUniformLocation(prog, "u_" + name);
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = Math.max(1, Math.round(width * dpr));
        canvas.height = Math.max(1, Math.round(height * dpr));
        gl.viewport(0, 0, canvas.width, canvas.height);
        return dpr;
      };
      let dpr = resize();
      let draw = () => {};
      const ro = new ResizeObserver(() => {
        dpr = resize();
        draw(0);
      });
      ro.observe(canvas);

      const fitScale = (canvasAspect) => Math.min(0.92, (0.92 * canvasAspect) / cloud.aspect);
      const advance = () => {
        state.from = state.mix < 0.5 ? state.from : state.to;
        state.to = (state.from + 1) % COUNT;
        state.mix = 0;
        state.shownAt = state.clock;
        state.glitch = 1;
        state.lastSecond = -1;
        if (frameRef.current) frameRef.current.textContent = `${pad(state.to)} / ${pad(COUNT - 1)}`;
      };

      // dt: seconds since the last frame (0 for a redraw without time passing).
      draw = (dt) => {
        state.clock += dt;
        const t = state.clock;
        const light = document.documentElement.dataset.theme === "light";
        const pal = light ? PALETTE.light : PALETTE.dark;

        // 30-second timer per portrait, then morph to the next one in order.
        const left = HOLD - (t - state.shownAt);
        if (left <= 0) advance();
        state.mix = reduced ? 1 : Math.min(1, state.mix + dt / MORPH);
        const secs = Math.max(0, Math.ceil(HOLD - (state.clock - state.shownAt)));
        if (secs !== state.lastSecond && timerRef.current) {
          state.lastSecond = secs;
          timerRef.current.textContent = `0:${String(secs).padStart(2, "0")}`;
        }
        if (barRef.current) barRef.current.style.transform = `scaleX(${Math.max(0, 1 - (state.clock - state.shownAt) / HOLD)})`;

        // Ease toward targets; idle sway when nobody is pointing at it.
        if (state.hoverTarget === 0) {
          state.tiltTarget[0] = Math.sin(t * 0.45) * 0.22;
          state.tiltTarget[1] = Math.sin(t * 0.31) * 0.06;
        }
        const ease = reduced ? 1 : 0.08;
        state.tilt[0] += (state.tiltTarget[0] - state.tilt[0]) * ease;
        state.tilt[1] += (state.tiltTarget[1] - state.tilt[1]) * ease;
        state.hover += (state.hoverTarget - state.hover) * (reduced ? 1 : 0.1);
        if (!reduced && t > state.nextGlitch) {
          state.glitch = 1;
          state.nextGlitch = t + 3 + Math.random() * 4;
        }
        state.glitch = reduced ? 0 : state.glitch * 0.86;

        const W = canvas.width / dpr;
        const canvasAspect = canvas.width / canvas.height;
        const ca = (1.6 + state.hover * 2.2 + state.glitch * 5) / W; // chromatic split, ~px → clip

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform3fv(U.from, ONE_HOT[state.from]);
        gl.uniform3fv(U.to, ONE_HOT[state.to]);
        gl.uniform1f(U.time, reduced ? 4.2 : t);
        gl.uniform1f(U.mix, state.mix);
        gl.uniform2f(U.tilt, state.tilt[0], state.tilt[1]);
        gl.uniform2f(U.mouse, state.mouse[0], state.mouse[1]);
        gl.uniform1f(U.hover, state.hover);
        gl.uniform1f(U.aspect, canvasAspect);
        gl.uniform1f(U.scale, fitScale(canvasAspect));
        gl.uniform1f(U.glitch, state.glitch);
        gl.uniform1f(U.light, light ? 1 : 0);
        gl.uniform3fv(U.color2, pal.b);
        // Additive light on dark; normal premultiplied "over" on light backgrounds.
        if (light) gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        else gl.blendFunc(gl.ONE, gl.ONE);

        // Wireframes of the outgoing and incoming portraits, cross-faded through the morph.
        gl.uniform1f(U.lines, 1);
        gl.uniform2f(U.offset, 0, 0);
        gl.uniform3fv(U.color, pal.a);
        const fades = [0, 0, 0];
        fades[state.from] += 1 - state.mix;
        fades[state.to] += state.mix;
        lines.forEach((l, k) => {
          if (fades[k] < 0.02) return;
          gl.uniform1f(U.lineFade, fades[k] * fades[k]);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, l.buf);
          gl.drawElements(gl.LINES, l.count, gl.UNSIGNED_SHORT, 0);
        });

        // Particles: cyan, violet, then the core.
        gl.uniform1f(U.lines, 0);
        const size = (narrow ? 1.75 : 1.9) * dpr;
        const passes = light
          ? [
              [pal.a, -ca, size * 0.7],
              [pal.b, ca, size * 0.7],
              [pal.core, 0, size * 0.85],
            ]
          : [
              [pal.a, -ca, size * 0.95],
              [pal.b, ca, size * 0.95],
              [pal.core, 0, size * 0.55],
            ];
        for (const [color, off, s] of passes) {
          gl.uniform3fv(U.color, light ? color : color.map((v) => v * 0.95));
          gl.uniform2f(U.offset, off, off * 0.25);
          gl.uniform1f(U.size, s);
          gl.drawArrays(gl.POINTS, 0, cloud.count);
        }
      };

      let last = performance.now();
      const step = () => {
        const now = performance.now();
        const dt = Math.min((now - last) / 1000, reduced ? 1.5 : 0.1);
        last = now;
        draw(dt);
      };
      const loop = () => {
        raf = 0;
        if (!visible || document.hidden) return;
        step();
        raf = requestAnimationFrame(loop);
      };
      const kick = () => {
        last = performance.now();
        if (reduced) draw(0);
        else if (!raf) raf = requestAnimationFrame(loop);
      };
      // Reduced motion: no animation loop, just a once-a-second tick for the timer.
      if (reduced) tick = setInterval(() => visible && !document.hidden && step(), 1000);

      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible) kick();
      });
      io.observe(wrap);
      const onVis = () => !document.hidden && kick();
      document.addEventListener("visibilitychange", onVis);
      const mo = new MutationObserver(() => {
        upload(isLight() ? clouds.light : clouds.dark);
        draw(0);
      });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

      // Pointer → model space (same mapping as the vertex shader).
      const onMove = (e) => {
        const r = canvas.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
        const ny = 1 - ((e.clientY - r.top) / r.height) * 2;
        const scale = fitScale(r.width / r.height);
        state.mouse = [(nx * (r.width / r.height)) / scale, ny / scale];
        state.hoverTarget = e.pointerType === "touch" ? 0 : 1;
        state.tiltTarget = [nx * 0.5, -ny * 0.3];
        if (reduced) draw(0);
      };
      const onLeave = () => {
        state.hoverTarget = 0;
      };
      const onClick = () => {
        advance();
        if (reduced) draw(0);
      };
      wrap.addEventListener("pointermove", onMove);
      wrap.addEventListener("pointerleave", onLeave);
      wrap.addEventListener("pointercancel", onLeave);
      wrap.addEventListener("click", onClick);

      kick();
      wrap.classList.add("is-ready");

      cleanup = () => {
        ro.disconnect();
        io.disconnect();
        mo.disconnect();
        clearInterval(tick);
        document.removeEventListener("visibilitychange", onVis);
        wrap.removeEventListener("pointermove", onMove);
        wrap.removeEventListener("pointerleave", onLeave);
        wrap.removeEventListener("pointercancel", onLeave);
        wrap.removeEventListener("click", onClick);
      };
    }, () => setFailed(true));

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanup();
      // Free GPU objects but keep the context: React's dev StrictMode remounts
      // on the same canvas, and a lost context can't compile shaders.
      for (const b of buffers) gl.deleteBuffer(b);
      if (program) gl.deleteProgram(program);
    };
  }, []);

  return (
    <figure
      className="holo"
      ref={wrapRef}
      aria-label="Holographic portrait of Rayyan Moosani; changes every 30 seconds, click for the next one"
      title="Click for the next photo"
    >
      <div className="holo-glass holo-glass-back" aria-hidden="true" />
      <div className="holo-glass holo-glass-front" aria-hidden="true" />
      {failed ? (
        <img className="holo-fallback" src={fallbackPhoto} alt="Rayyan Moosani" />
      ) : (
        <canvas className="holo-canvas" ref={canvasRef} aria-hidden="true" />
      )}
      <span className="holo-corner tl" aria-hidden="true" />
      <span className="holo-corner tr" aria-hidden="true" />
      <span className="holo-corner bl" aria-hidden="true" />
      <span className="holo-corner br" aria-hidden="true" />
      <figcaption className="holo-hud" aria-hidden="true">
        <span className="holo-hud-top">
          <span className="holo-live" /> R.MOOSANI
          <span className="holo-frame" ref={frameRef}>01 / 03</span>
        </span>
        <span className="holo-hud-bottom">
          <span>SYS / LLM INFRA</span>
          <span className="holo-timer" ref={timerRef}>0:30</span>
        </span>
        <span className="holo-progress"><span ref={barRef} /></span>
      </figcaption>
    </figure>
  );
}
