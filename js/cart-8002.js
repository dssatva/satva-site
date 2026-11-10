/* 10 Nov 2026, owner: "add an add to cart button on all the items of the site".
   8002 only (linked from 8002's index.html). Every product card in #pgrid gets
   an "Add to cart" button. Tapping it asks the pack size (and the chilli for
   Chilli Powder) and how many packs; a cart button then floats above the
   WhatsApp button. The cart is sent as a WhatsApp order through the same
   "Your WhatsApp number" step as the kit (window.satvaAskNumber from
   js/kit-custom-8002.js). No prices yet - the owner has not set them.
   The cart is kept in this browser only (localStorage), so a customer who
   leaves and comes back still has it. Styles: css/cart-8002.css. */
(function () {
  var grid = document.getElementById("pgrid");
  if (!grid) return;

  var KEY = "satva-cart-v1";
  var SIZES = [100, 200, 500];
  var SIZE_OF = { "Himalayan Pink Salt": [500, 1000] };       // same as the kit picker
  var VARIETY = { "Chilli Powder": ["Teja", "341", "Byadgi", "Kashmiri"] };

  var cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY) || "[]") || []; } catch (e) { cart = []; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} paintFab(); }
  function grams(g) { return g >= 1000 ? (g / 1000) + " kg" : g + " g"; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function label(it) { return (it.v ? it.v + " " : "") + it.name; }
  function count() { return cart.reduce(function (a, x) { return a + x.q; }, 0); }

  var BAG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>';

  /* ---------- the button on every card ---------- */
  function addButtons() {
    [].forEach.call(grid.querySelectorAll(".pcard"), function (card) {
      if (card.querySelector(".cart-add")) return;
      var h = card.querySelector("h3"), body = card.querySelector(".pbody");
      if (!h || !body) return;
      var b = document.createElement("button");
      b.type = "button"; b.className = "cart-add";
      b.innerHTML = BAG + "<span>Add to cart</span>";
      b.addEventListener("click", function (e) {
        e.preventDefault(); e.stopPropagation();
        var img = card.querySelector(".still-shot img, img");
        openPick(h.textContent.trim(), img ? img.getAttribute("src") : "", b);
      });
      body.appendChild(b);
    });
  }
  addButtons();
  new MutationObserver(addButtons).observe(grid, { childList: true, subtree: true });

  /* ---------- shared sheet (pack picker and the cart itself) ---------- */
  var sh = document.createElement("div");
  sh.className = "cartdlg"; sh.hidden = true;
  sh.setAttribute("role", "dialog"); sh.setAttribute("aria-modal", "true"); sh.setAttribute("aria-labelledby", "cart-t");
  sh.innerHTML = '<div class="cart-card"><button type="button" class="cart-x" aria-label="Close">&times;</button><div class="cart-view"></div></div>';
  document.body.appendChild(sh);
  var view = sh.querySelector(".cart-view"), back = null;
  function show() { tst.classList.remove("on"); sh.hidden = false; document.documentElement.classList.add("kc-on"); var f = sh.querySelector(".cart-view button, .cart-view input"); if (f) f.focus(); }
  function hide() { sh.hidden = true; document.documentElement.classList.remove("kc-on"); if (back) back.focus(); }
  sh.querySelector(".cart-x").addEventListener("click", hide);
  sh.addEventListener("click", function (e) { if (e.target === sh) hide(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !sh.hidden) hide(); });

  function chips(name, list, cur, fmt) {
    return '<div class="cart-chips" role="group" aria-label="' + name + '">' + list.map(function (x) {
      return '<button type="button" class="cart-chip" data-val="' + esc(x) + '" aria-pressed="' + (x === cur) + '">' + esc(fmt ? fmt(x) : x) + '</button>';
    }).join("") + '</div>';
  }

  function openPick(name, img, from) {
    back = from;
    var sizes = SIZE_OF[name] || SIZES, vars = VARIETY[name];
    var st = { g: sizes[0], v: vars ? vars[0] : "", q: 1 };
    function paint() {
      view.innerHTML =
        '<div class="cart-ph"><img src="' + esc(img) + '" alt=""><div><p class="cart-kick">Add to cart</p><h2 id="cart-t">' + esc(name) + '</h2></div></div>' +
        (vars ? '<p class="cart-lbl">Which chilli?</p>' + chips("Chilli", vars, st.v) : "") +
        '<p class="cart-lbl">Pack size</p>' + chips("Pack size", sizes, st.g, grams) +
        '<p class="cart-lbl">How many packs?</p>' +
        '<div class="cart-qty"><button type="button" class="cart-minus" aria-label="One less">&minus;</button><output>' + st.q + '</output><button type="button" class="cart-plus" aria-label="One more">+</button></div>' +
        '<button type="button" class="btn-gold cart-go">Add to cart</button>';
      [].forEach.call(view.querySelectorAll(".cart-chips"), function (grp) {
        grp.addEventListener("click", function (e) {
          var c = e.target.closest(".cart-chip"); if (!c) return;
          var val = c.getAttribute("data-val");
          if (grp.getAttribute("aria-label") === "Chilli") st.v = val; else st.g = +val;
          paint(); var again = view.querySelector('.cart-chip[data-val="' + val + '"]'); if (again) again.focus();
        });
      });
      view.querySelector(".cart-minus").addEventListener("click", function () { if (st.q > 1) { st.q--; view.querySelector("output").textContent = st.q; } });
      view.querySelector(".cart-plus").addEventListener("click", function () { if (st.q < 50) { st.q++; view.querySelector("output").textContent = st.q; } });
      view.querySelector(".cart-go").addEventListener("click", function () {
        var same = cart.filter(function (x) { return x.name === name && x.g === st.g && x.v === st.v; })[0];
        if (same) same.q += st.q; else cart.push({ name: name, v: st.v, g: st.g, q: st.q, img: img });
        save(); hide(); bump(); toast(label({ name: name, v: st.v }) + " added to cart");
      });
    }
    paint(); show();
  }

  function openCart(from) {
    back = from || back;
    if (!cart.length) {
      view.innerHTML = '<p class="cart-kick">Your cart</p><h2 id="cart-t">Your cart is empty</h2><p class="cart-empty">Tap <b>Add to cart</b> on any product, or <b>Customise your kit</b>, to start.</p>';
      show(); return;
    }
    view.innerHTML =
      '<p class="cart-kick">Your cart</p><h2 id="cart-t">' + count() + (count() === 1 ? ' pack' : ' packs') + '</h2>' +
      '<ul class="cart-list">' + cart.map(function (x, i) {
        return '<li><img src="' + esc(x.img) + '" alt=""><div class="cart-nm"><b>' + esc(label(x)) + '</b><span>' + grams(x.g) + ' pack' + (x.kit ? ' <em class="cart-kit">Kit</em>' : '') + '</span></div>' +
          '<div class="cart-qty sm"><button type="button" data-i="' + i + '" data-d="-1" aria-label="One less ' + esc(label(x)) + '">&minus;</button><output>' + x.q + '</output>' +
          '<button type="button" data-i="' + i + '" data-d="1" aria-label="One more ' + esc(label(x)) + '">+</button></div></li>';
      }).join("") + '</ul>' +
      '<p class="cart-note">Prices are confirmed on WhatsApp.</p>' +
      '<div class="cart-foot"><button type="button" class="cart-clear">Empty cart</button>' +
      '<button type="button" class="btn-gold cart-order">Order on WhatsApp</button></div>';
    [].forEach.call(view.querySelectorAll(".cart-list button"), function (b) {
      b.addEventListener("click", function () {
        var i = +b.getAttribute("data-i"), d = +b.getAttribute("data-d");
        cart[i].q += d; if (cart[i].q < 1) cart.splice(i, 1);
        save(); openCart();
        var f = view.querySelector('.cart-list button[data-i="' + Math.min(i, cart.length - 1) + '"][data-d="' + d + '"]') || view.querySelector(".cart-x, button"); if (f) f.focus();
      });
    });
    view.querySelector(".cart-clear").addEventListener("click", function () { cart = []; save(); openCart(); });
    view.querySelector(".cart-order").addEventListener("click", function () {
      var msg = orderText();
      hide();
      if (window.satvaAskNumber) window.satvaAskNumber(msg);
      else window.open("https://wa.me/" + (window.SATVA_WA_NUMBER || "919689888822") + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
    });
    show();
  }

  /* 10 Nov 2026, owner: "in the WhatsApp message, customise according to the
     product that is added" - one product reads as one sentence; kit items are
     listed as "Items for my Healthy Grocery Kit"; other products as "Products". */
  function line(x) { return "- " + label(x) + " - " + grams(x.g).replace(" ", "") + " x " + x.q; }
  function orderText() {
    var kit = cart.filter(function (x) { return x.kit; }), other = cart.filter(function (x) { return !x.kit; });
    var tot = cart.reduce(function (a, x) { return a + x.g * x.q; }, 0);
    if (cart.length === 1 && !kit.length) {
      var x = cart[0];
      return "Namaskar! I would like to order " + label(x) + " - " + grams(x.g).replace(" ", "") + " x " + x.q + ".";
    }
    var t = "Namaskar! I would like to order:";
    if (kit.length) t += "\n\nItems for my Healthy Grocery Kit:\n" + kit.map(line).join("\n");
    if (other.length) t += "\n\n" + (kit.length ? "Products:" : "Items:") + "\n" + other.map(line).join("\n");
    return t + "\n\nTotal: " + count() + (count() === 1 ? " pack" : " packs") + ", " + grams(tot);
  }
  /* 10 Nov 2026, owner: "items added with Add to cart and the items in Customise
     the kit should both be in the final cart". js/kit-custom-8002.js calls this
     when the kit picker's Done is pressed. */
  function addItem(it) {
    var same = cart.filter(function (x) { return x.name === it.name && x.g === it.g && (x.v || "") === (it.v || "") && !!x.kit === !!it.kit; })[0];
    if (same) same.q += it.q || 1; else cart.push({ name: it.name, v: it.v || "", g: it.g, q: it.q || 1, img: it.img, kit: !!it.kit });
    save(); bump();
  }

  /* ---------- floating cart button + "added" toast ---------- */
  var fab = document.createElement("button");
  fab.type = "button"; fab.className = "cartfab"; fab.setAttribute("aria-label", "Open cart");
  fab.innerHTML = BAG + '<span class="cartfab-n"></span>';
  fab.addEventListener("click", function () { openCart(fab); });
  document.body.appendChild(fab);
  function paintFab() {
    var n = count();
    fab.hidden = !n;
    fab.querySelector(".cartfab-n").textContent = n;
    fab.setAttribute("aria-label", "Open cart, " + n + (n === 1 ? " pack" : " packs"));
  }
  function bump() { fab.classList.remove("bump"); void fab.offsetWidth; fab.classList.add("bump"); }
  var tst = document.createElement("div");
  tst.className = "carttoast"; tst.setAttribute("role", "status"); tst.setAttribute("aria-live", "polite");
  document.body.appendChild(tst);
  var tt = 0;
  function toast(t) {
    tst.innerHTML = esc(t) + ' <button type="button">View cart</button>';
    tst.querySelector("button").addEventListener("click", function () { tst.classList.remove("on"); openCart(fab); });
    tst.classList.add("on"); clearTimeout(tt); tt = setTimeout(function () { tst.classList.remove("on"); }, 3200);
  }
  paintFab();
  window.satvaOpenCart = openCart;
  window.satvaCart = { add: addItem, open: openCart, toast: toast };
})();
