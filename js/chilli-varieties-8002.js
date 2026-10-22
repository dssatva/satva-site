/* =============================================================
   CHILLI POWDER VARIETIES, :8002 only (20 Oct 2026).
   Owner: "can you give some categories in these chilli powder that
   when they click the chilli powder, they should see these varities
   with stunning pictures and a small description for what each of
   these can be used".
   A click anywhere on the Chilli Powder card in the range opens this
   panel; the card also gets a "See the chilli varieties" line so the
   click is discoverable. Escape, the close button or the backdrop
   closes it. Styles: "CHILLI VARIETIES" in css/center-8002.css.
   Photos: Teja and 341 are the owner's own; Byadgi (Rajaramraok, CC BY-SA 4.0)
   and Kashmiri (joegoauk73, CC BY-SA 2.0) are credited on credits.html.
   ============================================================= */
(function () {
  "use strict";

  var VARIETIES = [
    { name: "Teja", tag: "Hot · bright red", img: "assets/cv-teja.jpg",
      alt: "A heap of long, thin, bright red Teja chillies",
      d: "Long, thin and sharp. A little gives real heat, so it is the chilli for food that should be spicy.",
      uses: "Andhra chicken curry, mutton and fish curry, pickles, misal kat, vada pav garlic chutney" },
    /* 20 Oct 2026: 341 added, owner's own photo (WhatsApp Image 12.56.02 PM, feet cropped out) */
    { name: "341", tag: "Hot \u00b7 rich red", img: "assets/cv-341.jpg",
      alt: "A heap of dark red 341 chillies",
      d: "Heat and colour together. A thick-skinned, dark crimson chilli that makes a powder both spicy and red.",
      uses: "Everyday chicken and egg curry, kolhapuri rassa, misal, usal, pickles" },
    { name: "Byadgi", tag: "Mild · deep red", img: "assets/cv-byadgi.jpg",
      alt: "Wrinkled, dark red Byadgi chillies",
      d: "Wrinkled and deep maroon. Gives food a rich red colour with gentle heat — the chilli of South Indian home cooking.",
      uses: "Sambar, rasam, red chutney for dosa, idli podi, fish fry, ghee roast" },
    { name: "Kashmiri", tag: "Very mild · brightest red", img: "assets/cv-kashmiri.jpg",
      alt: "A plate of short, glossy Kashmiri chillies",
      d: "Short, smooth and glossy. The brightest red with almost no heat, so children enjoy the food too.",
      uses: "Butter chicken, paneer makhani, tandoori marinades, rogan josh, pav bhaji" }
  ];

  var CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';

  var box = document.createElement("div");
  box.className = "cvar";
  box.hidden = true;
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-labelledby", "cvar-h");
  box.innerHTML =
    '<div class="cvar-card">' +
      '<button class="cvar-x" type="button" aria-label="Close">' + CLOSE + "</button>" +
      '<p class="cvar-k">Chilli powder</p>' +
      '<h2 id="cvar-h" class="cvar-h">Choose your chilli</h2>' +
      '<p class="cvar-l">Every chilli brings its own heat and colour. Pick the one your dish needs.</p>' +
      '<div class="cvar-grid">' +
        VARIETIES.map(function (v) {
          return '<article class="cvar-c">' +
            '<div class="cvar-ph"><img src="' + v.img + '" alt="' + v.alt + '" loading="lazy"><span>' + v.tag + "</span></div>" +
            '<div class="cvar-b"><h3>' + v.name + "</h3><p>" + v.d + "</p>" +
            '<p class="cvar-u"><b>Best for</b>' + v.uses + "</p></div></article>";
        }).join("") +
      "</div>" +
    "</div>";
  document.body.appendChild(box);

  var lastFocus = null;
  function open() {
    lastFocus = document.activeElement;
    box.hidden = false;
    document.documentElement.classList.add("cvar-open");
    box.querySelector(".cvar-x").focus();
  }
  function close() {
    box.hidden = true;
    document.documentElement.classList.remove("cvar-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  box.querySelector(".cvar-x").addEventListener("click", close);
  box.addEventListener("click", function (e) { if (e.target === box) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !box.hidden) close(); });

  function isChilli(card) {
    var h = card && card.querySelector("h3");
    return h && h.textContent.trim() === "Chilli Powder";
  }

  /* the range re-renders its cards on every tab change, so the hint is
     re-added whenever the grid changes */
  function mark() {
    [].forEach.call(document.querySelectorAll(".range .pcard"), function (c) {
      if (!isChilli(c) || c.querySelector(".cvar-hint")) return;
      c.classList.add("has-cvar");
      c.setAttribute("tabindex", "0");
      c.setAttribute("role", "button");
      c.setAttribute("aria-label", "Chilli Powder - see the chilli varieties");
      var b = c.querySelector(".pbody");
      if (b) b.insertAdjacentHTML("beforeend", '<span class="cvar-hint">Chilli varieties <i aria-hidden="true">&rarr;</i></span>');
    });
  }
  var grid = document.getElementById("pgrid");
  if (grid) new MutationObserver(mark).observe(grid, { childList: true });
  mark();

  document.addEventListener("click", function (e) {
    var c = e.target.closest && e.target.closest(".range .pcard");
    if (!c || !isChilli(c) || e.target.closest("a")) return;
    e.preventDefault();
    open();
  });
  document.addEventListener("keydown", function (e) {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("has-cvar")) {
      e.preventDefault();
      open();
    }
  });
})();
