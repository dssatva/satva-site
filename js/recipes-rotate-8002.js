/* =============================================================
   "COOK SOMETHING FOR SOMEONE" - ROTATING SETS, :8002 ONLY  8 Oct 2026
   -------------------------------------------------------------
   Owner: "after 5 secs let all these dishes disappear and next set
   of dishes appear ... lets have 5 sets like this with different
   dishes". Loaded by ports/8002/index.html only, after js/satva.js
   (which draws the first four); from then on this script owns
   #recipes-grid.

   Every dish is made with something on our own shelves, named on
   the card. Photographs are Unsplash (free licence), saved as
   assets/rec-<id>.jpg; the photo ids are listed in index.html.

   Manners, the same as the site's other sliders: it only turns
   while the block is on screen, pauses under the pointer or while
   a card has focus, pauses while the tab is hidden, and never
   starts under prefers-reduced-motion.
   ============================================================= */
(function () {
  "use strict";

  /* FOUR sets, not five (owner, 8 Oct: "load pictures like this only which
     are unique and stunning" - the dark, editorial paneer tikka was the
     bar). Only sixteen dishes had a free photograph at that level, so
     Poha, Bhel, Masala Dosa, Vada Pav, Jeera Bhaat and Overnight Chia
     came out rather than fill a fifth set with weaker pictures. */
  var SETS = [
    [ ["methi-dal",     "Methi Dal Tadka",   "Methi Seeds"],
      ["chole",         "Chole Bhature",     "Garam Masala"],
      ["biryani",       "Sunday Biryani",    "Biryani Masala"],
      ["nimbu-pani",    "Nimbu Pani",        "Himalayan Pink Salt"] ],
    [ ["idli-sambar",   "Idli Sambar",       "Sambar Masala"],
      ["varan-bhaat",   "Varan Bhaat",       "Turmeric"],
      ["rassa",         "Aitwarcha Rassa",   "Garam Masala"],
      ["haldi-doodh",   "Haldi Doodh",       "Turmeric"] ],
    [ ["paneer-tikka",  "Paneer Tikka",      "Chilli Powder"],
      ["chana-dal",     "Chana Dal Fry",     "Chilli Powder"],
      ["butter-chicken","Butter Chicken",    "Garam Masala"],
      ["kheer",         "Kheer",             "Coconut Sugar"] ],
    [ ["pav-bhaji",     "Pav Bhaji",         "Chilli Powder"],
      ["pepper-mutton", "Pepper Mutton Fry", "Black Pepper"],
      ["jeera-bhaat",   "Jeera Bhaat",       "Cumin Seeds"], /* 20 Oct 2026: replaces Quinoa Bowl */
      ["chicken-curry", "Chicken Curry",     "Coriander Powder"] ]
  ];
  /* the card's id where it differs from the recipe written for it */
  var RECIPE_ID = { "idli-sambar": "sambar" };
  var HOLD = 5000;   // how long each set stays, as asked
  var OUT_MS = 750;  // exit: last card's 3 x 90ms delay + its .45s fade (css/center-8002.css)

  var grid = document.getElementById("recipes-grid");
  if (!grid) return;

  function src(id) { return "assets/rec-" + id + ".webp"; }

  // animate: false for the first draw, which sits still until there is a
  // second set to bring in; every later set gets the staggered entrance
  function render(n, animate) {
    grid.innerHTML = SETS[n].map(function (d, i) {
      return '<article class="reccard' + (animate ? ' rc-in' : '') + '" style="--i:' + i + '"' +
        ' data-rec="' + d[0] + '" role="button" tabindex="0">' +
        '<div class="rshot has-photo"><img src="' + src(d[0]) + '" alt="" loading="lazy"></div>' +
        '<h3>' + d[1] + '</h3>' +
        '<p class="ruses">Made with ' + d[2] + '</p>' +
        '<span class="rsee">See the recipe</span>' +
      '</article>';
    }).join("");
  }

  // warm the cache for a set before it is shown, so it never fades in half-loaded
  function preload(n) { SETS[n].forEach(function (d) { new Image().src = src(d[0]); }); }

  var cur = 0;
  render(cur);
  /* the next set is fetched once the row is near the screen, not while the
     page is still opening (26 Oct 2026, phone speed) */
  if ("IntersectionObserver" in window) {
    var near = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { near.disconnect(); preload(1); }
    }, { rootMargin: "700px 0px" });
    near.observe(grid);
  } else preload(1);

  /* Clicking a dish opens its recipe - the sheet js/satva.js already has,
     with this card's own photograph (owner, 8 Oct 2026). */
  var sheetOpen = false;
  function openCard(card) {
    if (!card || !window.SATVA_openRecipe) return;
    var id = card.getAttribute("data-rec");
    var made = (card.querySelector(".ruses") || {}).textContent || "";
    var ok = window.SATVA_openRecipe(RECIPE_ID[id] || id, src(id), function () {
      sheetOpen = false; if (typeof sync === "function") sync();
    }, made.replace(/^Made with /, ""));   // the sheet names the same product the card does
    if (ok) { sheetOpen = true; if (typeof sync === "function") sync(); }
  }
  grid.addEventListener("click", function (e) { openCard(e.target.closest(".reccard")); });
  grid.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var c = e.target.closest(".reccard");
    if (c) { e.preventDefault(); openCard(c); }
  });

  /* "SEE ALL RECIPES" (owner, 8 Oct 2026): the button under the row opens
     every dish from all four sets at once - photo, name, what it is made
     with and its description. A dish opens its recipe on top; closing the
     recipe comes back here. Both are modal <dialog>s, so the recipe sheet,
     opened last, always sits above this one. */
  var allBtn = document.getElementById("see-all-recipes");
  var gal = null;
  function buildGallery() {
    gal = document.createElement("dialog");
    gal.className = "rgal";
    gal.setAttribute("aria-labelledby", "rgal-title");
    var dishes = [].concat.apply([], SETS);
    gal.innerHTML =
      '<div class="rgal-box">' +
        '<div class="rgal-head">' +
          '<h2 id="rgal-title" class="dsp">All our recipes</h2>' +
          '<p>Every dish is built on one thing we pack. Choose one to see the recipe.</p>' +
          '<button type="button" class="rs-close rgal-close" aria-label="Close recipes">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="rgal-grid">' +
          dishes.map(function (d) {
            var info = window.SATVA_recipeInfo ? window.SATVA_recipeInfo(RECIPE_ID[d[0]] || d[0]) : null;
            return '<article class="reccard rgal-card" data-rec="' + d[0] + '" role="button" tabindex="0">' +
              '<div class="rshot has-photo"><img src="' + src(d[0]) + '" alt="" loading="lazy"></div>' +
              '<h3>' + d[1] + '</h3>' +
              '<p class="ruses">Made with ' + d[2] + (info ? ' &middot; ' + info.time : '') + '</p>' +
              (info ? '<p class="rgal-desc">' + info.desc + '</p>' : '') +
              '<span class="rsee">See the recipe</span>' +
            '</article>';
          }).join("") +
        '</div>' +
      '</div>';
    document.body.appendChild(gal);
    gal.querySelector(".rgal-close").addEventListener("click", function () { gal.close(); });
    // a click on the backdrop (outside the box) closes it, as the recipe sheet does
    gal.addEventListener("click", function (e) {
      if (e.target === gal) { gal.close(); return; }
      var c = e.target.closest(".reccard");
      if (c) openCard(c);
    });
    gal.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var c = e.target.closest(".reccard");
      if (c) { e.preventDefault(); openCard(c); }
    });
    gal.addEventListener("close", function () {
      document.documentElement.classList.remove("rgal-open");
      sheetOpen = false; if (typeof sync === "function") sync();
    });
  }
  if (allBtn) allBtn.addEventListener("click", function () {
    if (!gal) buildGallery();
    document.documentElement.classList.add("rgal-open");
    gal.showModal();
    gal.querySelector(".rgal-grid").scrollTop = 0;
    sheetOpen = true; if (typeof sync === "function") sync();   // the row holds still behind it
  });

  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var timer = null, onScreen = false, hovered = false, busy = false;
  // declared as a function statement below, so openCard() above can call it

  function next() {
    if (busy) return;
    busy = true;
    grid.classList.add("is-swapping");               // cards lift and fade, left to right
    setTimeout(function () {
      cur = (cur + 1) % SETS.length;
      grid.classList.remove("is-swapping");
      render(cur, true);                             // new cards play their entrance on insert
      preload((cur + 1) % SETS.length);
      busy = false;
    }, OUT_MS);
  }

  function sync() {
    var run = onScreen && !hovered && !sheetOpen && !(gal && gal.open) && !document.hidden;
    if (run && !timer) timer = setInterval(next, HOLD);
    if (!run && timer) { clearInterval(timer); timer = null; }
  }

  grid.addEventListener("mouseenter", function () { hovered = true;  sync(); });
  grid.addEventListener("mouseleave", function () { hovered = false; sync(); });
  grid.addEventListener("focusin",    function () { hovered = true;  sync(); });
  grid.addEventListener("focusout",   function () { hovered = false; sync(); });
  document.addEventListener("visibilitychange", sync);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      onScreen = es[0].isIntersecting; sync();
    }, { threshold: 0.35 }).observe(grid);
  } else { onScreen = true; sync(); }
})();
