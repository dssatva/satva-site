/* ==========================================================
   DS SATVA — "the grind"
   Ground spice, suspended in the air over the hero.

   A small hand-written particle system on a 2D canvas. No
   library, no build step — the same rules as the rest of the
   site. A few hundred to ~2600 grains depending on the screen,
   drawn from a cached sprite per colour and composited with
   `multiply`, so a grain reads as pigment sitting on paper
   rather than as a glowing dot.

   Per-slide colours come from `data-powder` on each .slide,
   so the palette is data-driven like PRODUCTS in satva.js —
   add a slide, give it three hexes, nothing here changes.

   Legibility is not left to luck. The headline's real bounding
   box is measured and grains fade out as they cross it, so the
   copy stays readable at any width and with any length of
   headline. That is why there is no hard-coded "keep right of
   40%" — an earlier version had one and it put powder straight
   through the headline on a phone.

   It layers itself in and does nothing if it cannot: no canvas,
   no 2D context, or prefers-reduced-motion all return early and
   leave the hero exactly as it was.
   ========================================================== */
(function () {
  "use strict";

  var hero = document.querySelector(".hero");
  var cv   = document.getElementById("grind");
  if (!hero || !cv) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var ctx = cv.getContext("2d");
  if (!ctx) return;

  /* --- tuning ------------------------------------------------
     Everything worth adjusting is here.

     GRAIN_AREA is the performance dial: one grain per this many
     CSS pixels of hero, clamped to GRAIN_MIN..GRAIN_MAX. Raise
     it for fewer grains. The floor is deliberately low so a
     small phone does less work than a desktop, not more.

     To make the effect more obvious, raise GRAIN_ALPHA — that is
     the honest dial for "show me more powder". Lower GRAIN_AREA
     only if the machine can take it.
     ----------------------------------------------------------- */
  var GRAIN_AREA  = 1050,  // px² of hero per grain
      GRAIN_MIN   = 200,
      GRAIN_MAX   = 2600,
      GRAIN_ALPHA = 1.0,   // global multiplier on grain opacity
      DPR_CAP     = 1.5,   // retina past this buys nothing for soft dots
      GRAVITY     = 0.0045,// powder falls, but slowly — it is fine dust
      DAMP        = 0.986,
      DRIFT       = 0.0075,// strength of the turbulence field
      PUSH_R      = 130,   // cursor influence radius, px
      PUSH_F      = 0.85,
      FADE_TOP    = 0.10,  // fade in over the top tenth
      FADE_LINE   = 0.60,  // fully faded by here, above the photo band
      KEEP_PAD    = 14,    // grow the text box by this before masking
      KEEP_FEATHER= 70,    // px over which a grain fades as it enters the box
      KEEP_MIN    = 0.08;  // how much of a grain survives over type
  var DEFAULT_POWDER = ["#e8a713", "#c3341a", "#93a04b"];

  var w = 0, h = 0, dpr = 1, count = 0;
  var grains = [];
  var sprites = [];        // one cached radial sprite per palette colour
  var palette = DEFAULT_POWDER.slice();
  var keep = null;         // the headline box grains must not obscure
  var px = -9999, py = -9999, hasPointer = false;
  var running = false, visible = true, raf = 0, t = 0;

  /* --- a soft round grain, drawn once per colour and reused --- */
  function makeSprite(hex) {
    var S = 32, c = document.createElement("canvas");
    c.width = c.height = S;
    var g = c.getContext("2d");
    var rg = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    rg.addColorStop(0,    hex);
    rg.addColorStop(0.45, hex);
    rg.addColorStop(1,    rgba(hex, 0));
    g.fillStyle = rg;
    g.beginPath();
    g.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2);
    g.fill();
    return c;
  }

  function rgba(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")";
  }

  function buildSprites() {
    sprites = palette.map(makeSprite);
  }

  /* --- one grain ---------------------------------------------
     `high` seeds it at the very top instead of anywhere in the
     field — used for the fall that follows a slide change.
     ----------------------------------------------------------- */
  function seed(p, high) {
    p.x  = Math.random() * w;
    p.y  = high ? -Math.random() * h * 0.15 : Math.random() * h * FADE_LINE;
    p.vx = (Math.random() - 0.5) * 0.22;
    p.vy = high ? 0.35 + Math.random() * 0.5 : Math.random() * 0.2;
    p.r  = 0.45 + Math.pow(Math.random(), 2.7) * 3.1;  // mostly dust, few coarse
    p.a  = 0.16 + Math.random() * 0.40;        // its own opacity ceiling
    p.ci = (Math.random() * palette.length) | 0;
    p.ph = Math.random() * 6.283;              // turbulence phase
    return p;
  }

  /* --- the keep-clear box ------------------------------------
     Measured off the live layout rather than guessed, so it is
     correct on a phone, on a desktop, and if the copy changes.
     ----------------------------------------------------------- */
  function measureKeep() {
    var copy = hero.querySelector(".slide.is-active .copy") ||
               hero.querySelector(".copy");
    if (!copy) { keep = null; return; }
    var hr = hero.getBoundingClientRect();
    var cr = copy.getBoundingClientRect();
    if (!cr.width || !cr.height) { keep = null; return; }
    keep = {
      x1: cr.left  - hr.left - KEEP_PAD,
      y1: cr.top   - hr.top  - KEEP_PAD,
      x2: cr.right - hr.left + KEEP_PAD,
      y2: cr.bottom- hr.top  + KEEP_PAD
    };
  }

  // 1 outside the box, falling to KEEP_MIN once well inside it
  function legibility(x, y) {
    if (!keep) return 1;
    if (x < keep.x1 || x > keep.x2 || y < keep.y1 || y > keep.y2) return 1;
    var depth = Math.min(x - keep.x1, keep.x2 - x, y - keep.y1, keep.y2 - y);
    var f = 1 - depth / KEEP_FEATHER;
    return f < KEEP_MIN ? KEEP_MIN : f;
  }

  function resize() {
    var r = hero.getBoundingClientRect();
    w = Math.max(1, Math.round(r.width));
    h = Math.max(1, Math.round(r.height));
    dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);

    cv.width  = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    cv.style.width  = w + "px";
    cv.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var want = Math.round((w * h) / GRAIN_AREA);
    count = Math.max(GRAIN_MIN, Math.min(GRAIN_MAX, want));

    while (grains.length < count) grains.push(seed({}, false));
    if (grains.length > count) grains.length = count;

    measureKeep();
  }

  /* --- the field ---------------------------------------------
     Two crossed sine waves instead of real curl noise. Cheap,
     dependency-free, and at this scale indistinguishable from
     the genuine article — powder does not need to be correct,
     it needs to look unhurried.
     ----------------------------------------------------------- */
  function step() {
    t += 0.006;

    for (var i = 0; i < grains.length; i++) {
      var p = grains[i];

      p.vx += Math.sin(p.y * 0.011 + t + p.ph) * DRIFT;
      p.vy += Math.cos(p.x * 0.009 - t * 0.8 + p.ph) * DRIFT * 0.5 + GRAVITY;

      if (hasPointer) {
        var dx = p.x - px, dy = p.y - py;
        var d2 = dx * dx + dy * dy;
        if (d2 < PUSH_R * PUSH_R && d2 > 0.01) {
          var d = Math.sqrt(d2);
          var f = (1 - d / PUSH_R) * PUSH_F / d;
          p.vx += dx * f;
          p.vy += dy * f;
        }
      }

      p.vx *= DAMP;
      p.vy *= DAMP;
      p.x  += p.vx;
      p.y  += p.vy;

      // recycle anything that leaves the field
      if (p.y > h * FADE_LINE + 40 || p.x < -30 || p.x > w + 30) seed(p, false);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "multiply";

    var top   = h * FADE_TOP;
    var line  = h * FADE_LINE;
    var soften = line * 0.62;
    var runout = line * 0.38;

    for (var i = 0; i < grains.length; i++) {
      var p = grains[i];
      var sp = sprites[p.ci] || sprites[0];
      if (!sp) continue;

      // fade in at the top, out well before the photo band
      var f = 1;
      if (p.y < top)    f = Math.max(0, p.y / top);
      if (p.y > soften) f *= Math.max(0, 1 - (p.y - soften) / runout);
      if (f <= 0.01) continue;

      f *= legibility(p.x, p.y);
      if (f <= 0.01) continue;

      ctx.globalAlpha = p.a * f * GRAIN_ALPHA;
      var s = p.r * 3.4;                     // sprite is mostly falloff
      ctx.drawImage(sp, p.x - s / 2, p.y - s / 2, s, s);
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  function frame() {
    if (!running) return;
    step();
    draw();
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || !visible) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  /* --- palette follows the slide ------------------------------
     satva.js owns the slider and does not expose a hook, so we
     watch for the class it sets rather than reach into it. A
     slide becoming active recolours the powder and drops a fresh
     fall from above — the grinder, in effect.
     ----------------------------------------------------------- */
  function readPowder(slide) {
    var raw = slide && slide.getAttribute("data-powder");
    if (!raw) return DEFAULT_POWDER.slice();
    var list = raw.split(",").map(function (s) { return s.trim(); })
                  .filter(function (s) { return /^#[0-9a-f]{6}$/i.test(s); });
    return list.length ? list : DEFAULT_POWDER.slice();
  }

  function adopt(slide, fall) {
    palette = readPowder(slide);
    buildSprites();

    // recolour what is already in the air, and drop a new fall
    var n = grains.length;
    var fresh = fall ? Math.round(n * 0.42) : 0;
    for (var i = 0; i < n; i++) {
      if (i < fresh) seed(grains[i], true);
      else grains[i].ci = (Math.random() * palette.length) | 0;
    }
  }

  function watchSlides() {
    var slides = hero.querySelector(".slides");
    if (!slides || !("MutationObserver" in window)) return;
    var last = hero.querySelector(".slide.is-active");

    new MutationObserver(function () {
      var now = hero.querySelector(".slide.is-active:not(.is-leaving)");
      if (now && now !== last) {
        last = now;
        adopt(now, true);
        // each slide's headline is a different length, so remeasure.
        // 1s matches the slider's transition in satva.css.
        setTimeout(measureKeep, 1050);
      }
    }).observe(slides, { subtree: true, attributes: true, attributeFilter: ["class"] });
  }

  /* --- pointer ----------------------------------------------- */
  hero.addEventListener("pointermove", function (e) {
    var r = hero.getBoundingClientRect();
    px = e.clientX - r.left;
    py = e.clientY - r.top;
    hasPointer = true;
  }, { passive: true });

  hero.addEventListener("pointerleave", function () { hasPointer = false; });

  /* --- only run while it is actually on screen ---------------- */
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: 0.05 }).observe(hero);
  } else {
    visible = true;
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });

  var rt = 0;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(resize, 150);
  });

  /* --- go ---------------------------------------------------- */
  adopt(hero.querySelector(".slide.is-active"), false);
  resize();
  watchSlides();
  cv.classList.add("on");
  start();

  // the headline animates in over ~1.4s; its box is only final after that
  setTimeout(measureKeep, 1500);
})();
