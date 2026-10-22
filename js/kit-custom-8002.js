/* ============================================================
   CUSTOMISE YOUR KIT, :8002 only (15 Oct 2026). Owner: "in this
   particular space [after the last product card] create a block ...
   tell the viewers that they can customize the grocery kit - and keep a
   button to click on customize. and when they click that they will have
   all the masalas display with option to select on each masala - 100g,
   200g, 500g and finally when they click done, the selected masalas with
   the quantity should be displayed and also a message that TAKE A PIC
   AND SEND VIA whats app to place the order".

   The block is the last item in #pgrid and stretches to the end of the
   last row (a "span" worked out from the column count), so it fills the gap whatever the
   column count. #pgrid is rebuilt by js/satva.js on every shelf tab, so a
   MutationObserver puts the block back each time. Picks are kept in
   localStorage (per viewer, optional). Styles: css/kit-custom-8002.css.
   ============================================================ */
(function () {
  var grid = document.getElementById("pgrid");
  if (!grid) return;

  var WA = "919689888822", WA_SHOW = "+91-9689888822";
  var SIZES = [100, 200, 500];
  var GROUPS = [
    { name: "Spices", items: [
      ["Turmeric", "हल्दी", "u-turmeric.jpg"],
      ["Coriander Powder", "धनिया पावडर", "j-coriander-3-powder.jpg"], ["Coriander Seeds", "धनिया", "u-coriander-seeds.jpg"],
      ["Cumin Seeds", "जीरा", "u-cumin-seeds.jpg"], ["Mustard Seeds", "राई", "u-mustard-seeds.jpg"],
      ["Black Pepper", "काली मिर्च", "u-black-pepper.jpg"] ] },
    /* 20 Oct 2026, owner: "even in the customizing kit, add the varieties of
       chilli so that they can select and place the order" - one Chilli Powder
       became three, the same three as js/chilli-varieties-8002.js. */
    { name: "Chilli powder \u00b7 pick your chilli", items: [
      ["Teja Chilli Powder", "Hot \u00b7 bright red", "cv-teja.jpg"],
      ["341 Chilli Powder", "Hot \u00b7 rich red", "cv-341.jpg"],
      ["Byadgi Chilli Powder", "Mild \u00b7 deep red", "cv-byadgi.jpg"],
      ["Kashmiri Chilli Powder", "Very mild \u00b7 brightest red", "cv-kashmiri.jpg"] ] },
    { name: "Home-made masalas", items: [
      ["Garam Masala", "गरम मसाला", "u-garam-masala.jpg"], ["Biryani Masala", "बिरयानी मसाला", "u-biryani-masala.jpg"],
      ["Meat Masala", "मीट मसाला", "u-meat-masala.jpg"], ["Sambar Masala", "सांबार मसाला", "u-sambar-masala-8002.jpg"],
      ["Chatpat Masala", "चटपट मसाला", "u-chatpat-masala.jpg"] ] },
    { name: "Seeds", items: [
      ["Chia Seeds", "चिया बीज", "u-chia-seeds.jpg"], ["Flax Seeds", "अलसी", "u-flax-seeds.jpg"],
      ["Methi Seeds", "मेथी दाना", "u-methi-seeds.jpg"] ] },
    { name: "Healthy essentials", items: [
      ["Himalayan Pink Salt", "गुलाबी नमक", "u-himalayan-pink-salt.jpg"], ["Coconut Sugar", "नारियल शक्कर", "u-coconut-sugar.jpg"],
      ["Monk Fruit Sweetener", "मंक फ्रूट", "j-monk-3-powder.jpg"] ] }
  ];

  var KEY = "satva-kit-picks";
  /* 16 Oct 2026, owner: "when customise your kit is clicked, nothing should be
     selected inside" - picks are no longer remembered between visits, and the
     Customise button always starts empty ("Change items" on the order slip
     still keeps them, so the customer can adjust their own list). */
  var picks = {};
  try { localStorage.removeItem(KEY); } catch (e) {}
  function save() {}
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function grams(g) { return g >= 1000 ? (g / 1000) + " kg" : g + " g"; }

  /* ---------- the block in the grid ---------- */
  var block = document.createElement("article");
  block.className = "kitcust";
  /* 16 Oct 2026: option 13 of kit-custom-variations.html (terracotta, potli on
     an ivory disc, size chips) in a lighter terracotta, with a strip of
     ingredient photos scrolling along the foot of this block only */
  var STRIP = ["u-turmeric", "u-chilli-powder", "u-garam-masala", "u-cumin-seeds", "u-coriander-seeds", "j-coriander-3-powder",
               "u-himalayan-pink-salt", "u-chia-seeds", "u-sambar-masala-8002", "u-methi-seeds", "u-mustard-seeds", "u-coconut-sugar", "u-black-pepper"];
  var stripHTML = STRIP.map(function (f) { return '<span><img src="assets/' + f + '.jpg" alt="" loading="lazy"></span>'; }).join("");
  block.innerHTML = '<div class="kc-in">' +
    '<div class="kc-art kc-disc" aria-hidden="true"><div class="kc-d"><img src="assets/kit-potli-ivory.png" alt="" loading="lazy"></div></div>' +
    '<div class="kc-copy"><p class="kc-kick">Healthy Grocery Kit &middot; made to order</p>' +
      '<h3 class="kc-h">Build your own kit</h3>' +
      '<p class="kc-d2">Pick only the masalas and staples your kitchen uses, in the size you need. Our Sahelis pack it fresh, just for you.</p>' +
      '<div class="kc-sz"><span>100 g</span><span>200 g</span><span>500 g</span></div>' +
      '<button type="button" class="btn-gold kc-btn">Customise your kit <span aria-hidden="true">&rarr;</span></button>' +
      '<p class="kc-count" aria-live="polite"></p></div></div>' +
    '<div class="kc-strip" aria-hidden="true"><div class="kc-track">' + stripHTML + stripHTML + '</div></div>';
  block.querySelector(".kc-btn").addEventListener("click", function (e) { picks = {}; openPicker(e); });
  /* 21 Oct 2026, owner: the "Customise your kit" button at the foot of the
     kit box (#kit) opens this same picker, starting empty like the one above. */
  [].forEach.call(document.querySelectorAll("[data-kitcustom]"), function (b) {
    b.addEventListener("click", function (e) { picks = {}; openPicker(e); });
  });

  /* span the columns left over in the last row (all of them if it is full) */
  function fit() {
    var cols = getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length || 1;
    var used = (grid.children.length - 1) % cols;
    block.style.gridColumn = "span " + (used ? cols - used : cols);
  }
  addEventListener("resize", fit);
  function place() {
    if (grid.lastElementChild !== block) grid.appendChild(block);
    fit(); updateCount();
  }
  new MutationObserver(function () { if (grid.lastElementChild !== block) place(); }).observe(grid, { childList: true });
  place();

  function chosen() {
    var out = [];
    GROUPS.forEach(function (g) { g.items.forEach(function (it) { if (picks[it[0]]) out.push({ name: it[0], hi: it[1], img: it[2], g: picks[it[0]] }); }); });
    return out;
  }
  function updateCount() {
    var n = chosen().length, el = block.querySelector(".kc-count");
    el.textContent = n ? n + (n === 1 ? " item" : " items") + " picked — tap to review" : "";
  }

  /* ---------- the dialog ---------- */
  var dlg = document.createElement("div");
  dlg.className = "kcdlg"; dlg.hidden = true;
  dlg.setAttribute("role", "dialog"); dlg.setAttribute("aria-modal", "true"); dlg.setAttribute("aria-labelledby", "kc-title");
  dlg.innerHTML = '<div class="kc-card"><button type="button" class="kc-x" aria-label="Close">&times;</button><div class="kc-view"></div></div>';
  document.body.appendChild(dlg);
  var view = dlg.querySelector(".kc-view"), last = null;

  function openPicker(e) {
    last = (e && e.currentTarget) || last;
    renderPicker();
    dlg.hidden = false; document.documentElement.classList.add("kc-on");
    var f = dlg.querySelector(".kc-opt, .kc-done"); if (f) f.focus();
  }
  function close() {
    dlg.hidden = true; document.documentElement.classList.remove("kc-on");
    updateCount(); if (last) last.focus();
  }
  dlg.querySelector(".kc-x").addEventListener("click", close);
  dlg.addEventListener("click", function (e) { if (e.target === dlg) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !dlg.hidden) close(); });

  function renderPicker() {
    var h = '<div class="kc-top"><p class="kc-kick">Customise your Healthy Grocery Kit</p>' +
            '<h2 id="kc-title">Choose what goes in</h2>' +
            '<p class="kc-sub">Tap a size for each item you want. Tap it again to take it out.</p></div><div class="kc-list">';
    GROUPS.forEach(function (g) {
      h += '<section class="kc-grp"><h3>' + esc(g.name) + '</h3><ul>';
      g.items.forEach(function (it) {
        var sel = picks[it[0]] || 0;
        h += '<li class="kc-item' + (sel ? ' is-on' : '') + '"><img src="assets/' + it[2] + '" alt="" loading="lazy">' +
             '<div class="kc-nm"><b>' + esc(it[0]) + '</b><i class="dv">' + esc(it[1]) + '</i></div>' +
             '<div class="kc-opts" role="group" aria-label="' + esc(it[0]) + ' size">' +
             SIZES.map(function (s) {
               return '<button type="button" class="kc-opt" data-n="' + esc(it[0]) + '" data-g="' + s + '" aria-pressed="' + (sel === s) + '">' + s + 'g</button>';
             }).join("") + '</div></li>';
      });
      h += '</ul></section>';
    });
    h += '</div><div class="kc-foot"><p class="kc-tally"></p><button type="button" class="btn-gold kc-done">Done</button></div>';
    view.innerHTML = h;
    view.scrollTop = 0;
    tally();
    [].forEach.call(view.querySelectorAll(".kc-opt"), function (b) {
      b.addEventListener("click", function () {
        var n = b.getAttribute("data-n"), g = +b.getAttribute("data-g");
        if (picks[n] === g) delete picks[n]; else picks[n] = g;
        save();
        var li = b.closest(".kc-item");
        li.classList.toggle("is-on", !!picks[n]);
        [].forEach.call(li.querySelectorAll(".kc-opt"), function (o) { o.setAttribute("aria-pressed", String(picks[n] === +o.getAttribute("data-g"))); });
        tally();
      });
    });
    view.querySelector(".kc-done").addEventListener("click", renderSummary);
  }
  function tally() {
    var c = chosen(), tot = c.reduce(function (a, x) { return a + x.g; }, 0);
    view.querySelector(".kc-tally").innerHTML = c.length
      ? '<b>' + c.length + (c.length === 1 ? ' item' : ' items') + '</b> &middot; ' + grams(tot) + ' in all'
      : 'Nothing picked yet';
    view.querySelector(".kc-done").disabled = !c.length;
  }

  function renderSummary() {
    var c = chosen(), tot = c.reduce(function (a, x) { return a + x.g; }, 0);
    var d = new Date(), when = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    var text = "Namaskar! I would like to order my Healthy Grocery Kit:\n" +
      c.map(function (x) { return "- " + x.name + " - " + x.g + "g"; }).join("\n") + "\nTotal: " + grams(tot);
    view.innerHTML =
      '<div class="kc-slip"><div class="kc-slip-h"><img src="assets/logo-stack-dark.png" alt="DS SATVA">' +
        '<div><p class="kc-kick">My Healthy Grocery Kit</p><h2 id="kc-title">Your order</h2><p class="kc-when">' + when + '</p></div></div>' +
        '<table class="kc-tbl"><thead><tr><th>Item</th><th>Qty</th></tr></thead><tbody>' +
        c.map(function (x) { return '<tr><td><img src="assets/' + x.img + '" alt="">' + esc(x.name) + '</td><td>' + x.g + ' g</td></tr>'; }).join("") +
        '</tbody><tfoot><tr><td>' + c.length + (c.length === 1 ? ' item' : ' items') + '</td><td>' + grams(tot) + '</td></tr></tfoot></table>' +
        '<div class="kc-msg"><b>Take a pic &amp; send via WhatsApp to place the order</b><span>WhatsApp ' + WA_SHOW + '</span></div>' +
      '</div>' +
      '<div class="kc-foot"><button type="button" class="kc-edit">&larr; Change items</button>' +
        '<button type="button" class="btn-gold kc-wa">Open WhatsApp</button></div>';
    view.scrollTop = 0;
    view.querySelector(".kc-edit").addEventListener("click", renderPicker);
    view.querySelector(".kc-wa").addEventListener("click", function () { askNumber(text); });
  }

  /* ---------- ask the customer's WhatsApp number, then open WhatsApp ----------
     16 Oct 2026, owner: "when open whats app is clicked, the number should be
     asked and connected to whats app" (and the same for Buy the kit). The
     customer's number is written into the message, so DS Satva can reply. */
  var ask = document.createElement("div");
  ask.className = "kcask"; ask.hidden = true;
  ask.setAttribute("role", "dialog"); ask.setAttribute("aria-modal", "true"); ask.setAttribute("aria-labelledby", "kcask-t");
  ask.innerHTML = '<form class="kcask-card" novalidate><button type="button" class="kc-x" aria-label="Close">&times;</button>' +
    '<p class="kc-kick">Almost done</p><h2 id="kcask-t">Your WhatsApp number</h2>' +
    '<p class="kcask-d">We will confirm your order on this number.</p>' +
    '<label class="kcask-f"><span>+91</span><input type="tel" inputmode="numeric" autocomplete="tel-national" maxlength="12" placeholder="10-digit mobile number" required></label>' +
    '<p class="kcask-err" aria-live="polite"></p>' +
    '<button type="submit" class="btn-gold kcask-go">Continue on WhatsApp</button></form>';
  document.body.appendChild(ask);
  var askMsg = "", askLast = null, inp = ask.querySelector("input"), err = ask.querySelector(".kcask-err");
  /* 22 Oct 2026, owner: the Saheli "Apply" buttons should not say "confirm your
     order" - a second argument "saheli" swaps the dialog's words. */
  var ASKW = {
    order:  ["Almost done", "Your WhatsApp number", "We will confirm your order on this number."],
    saheli: ["Join us", "Connect with us to become a Satva Saheli", "Share your WhatsApp number and our team will reach out to you."]
  };
  function askNumber(msg, kind) {
    var w = ASKW[kind] || ASKW.order;
    ask.querySelector(".kc-kick").textContent = w[0];
    ask.querySelector("#kcask-t").textContent = w[1];
    ask.querySelector(".kcask-d").textContent = w[2];
    askMsg = msg; askLast = document.activeElement;
    var saved = ""; try { saved = localStorage.getItem("satva-wa-no") || ""; } catch (e) {}
    inp.value = saved; err.textContent = "";
    ask.hidden = false; document.documentElement.classList.add("kc-on");
    setTimeout(function () { inp.focus(); }, 30);
  }
  function askClose() { ask.hidden = true; if (dlg.hidden) document.documentElement.classList.remove("kc-on"); if (askLast) askLast.focus(); }
  ask.querySelector(".kc-x").addEventListener("click", askClose);
  ask.addEventListener("click", function (e) { if (e.target === ask) askClose(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !ask.hidden) { e.stopImmediatePropagation(); askClose(); } }, true);
  ask.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
    var d = inp.value.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
    if (!/^[6-9]\d{9}$/.test(d)) { err.textContent = "Please enter a valid 10-digit mobile number."; inp.focus(); return; }
    try { localStorage.setItem("satva-wa-no", d); } catch (e2) {}
    var text = askMsg + "\n\nMy WhatsApp number: +91 " + d;
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    askClose();
  });
  window.satvaAskNumber = askNumber;
  [].forEach.call(document.querySelectorAll("[data-kitbuy]"), function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      askNumber("Namaskar! I would like to buy the Satva Healthy Grocery Kit.");
    });
  });
})();
