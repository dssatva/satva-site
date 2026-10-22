/* =============================================================
   CONNECTING LINKS, :8002 ONLY  10 Oct 2026
   -------------------------------------------------------------
   Owner: "if you could connect anything within the website then
   do it". Loaded by ports/8002/index.html only, after satva.js.
   1. Footer "The range" links filter the listing to their shelf,
      the same as the Shop by Category cards (they only scrolled).
   2. Every recipe ends with its product: "See it in our range"
      (closes the recipe, shows the card and lights it up) and
      "Order on WhatsApp".
   ============================================================= */
(function () {
  "use strict";
  var WA = "https://wa.me/" + (window.SATVA_WA_NUMBER || "919689888822") + "?text="; /* 20 Oct 2026: was the old number 917709932222 */
  var norm = function (s) { return (s || "").replace(/\s+/g, " ").trim().toLowerCase(); };

  /* 1. footer shelves -> the matching category card */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-shelf]");
    if (!a) return;
    var want = norm(a.dataset.shelf);
    var card = [].filter.call(document.querySelectorAll("#cats > button"), function (b) {
      var h = b.querySelector("h3,strong,b");
      return norm(h ? h.textContent : b.textContent).indexOf(want) === 0;
    })[0];
    if (!card) return;           // no card: the plain #categories link still works
    e.preventDefault();
    card.click();
  });

  /* 2. recipe -> its product */
  function showProduct(name) {
    var tabs = [].slice.call(document.querySelectorAll("#rtabs button"));
    var find = function () {
      return [].filter.call(document.querySelectorAll("#pgrid > *"), function (c) {
        var h = c.querySelector("h3");
        return h && norm(h.firstChild ? h.firstChild.textContent : h.textContent) === norm(name);
      })[0];
    };
    var card = find();
    for (var i = 0; !card && i < tabs.length; i++) { tabs[i].click(); card = find(); }
    var range = document.getElementById("range");
    if (!card) { if (range) range.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.classList.remove("lk-flash"); void card.offsetWidth; card.classList.add("lk-flash");
    setTimeout(function () { card.classList.remove("lk-flash"); }, 2600);
  }

  function addLinks(sheet) {
    var body = sheet.querySelector(".rs-body"), kick = sheet.querySelector(".rs-kick");
    if (!body || !kick || body.querySelector(".rs-links")) return;
    var m = kick.textContent.match(/made with\s+(.+)$/i);
    if (!m) return;
    var name = m[1].split(/\s+\u00b7\s+|\s+-\s+/)[0].trim();   // the gallery adds " \u00b7 5 min"
    var row = document.createElement("div");
    row.className = "rs-links";
    row.innerHTML =
      '<button type="button" class="btn-gold rs-see">See ' + name + ' in our range</button>' +
      '<a class="btn-ghost" target="_blank" rel="noopener" href="' + WA +
        encodeURIComponent("Namaskar! I would like to order " + name + ".") + '">Order on WhatsApp</a>';
    body.appendChild(row);
    row.querySelector(".rs-see").addEventListener("click", function () {
      sheet.close();
      // the recipe may have been opened from the "All our recipes" gallery
      setTimeout(function () {
        [].forEach.call(document.querySelectorAll("dialog[open]"), function (d) { d.close(); });
        showProduct(name);
      }, 60);
    });
  }

  new MutationObserver(function () {
    var s = document.querySelector("dialog.rsheet[open]");
    if (s) addLinks(s);
  }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["open"] });
})();
