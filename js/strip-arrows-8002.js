/* 10 Nov 2026, owner: "have a button or an arrow pointing right so that
   customers know that the items are on the right to be slid over".
   Phones only (the strips only scroll sideways there; css/center-8002.css
   "PHONE STRIP ARROWS" hides the buttons above 760px). A round arrow sits on
   the right edge of the product strip (#pgrid) and the recipe strip
   (#recipes-grid); tapping it slides one card along. A left arrow appears once
   the strip has moved, and the right one goes away at the end. */
(function () {
  var mq = window.matchMedia("(max-width:760px)");
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';

  ["pgrid", "recipes-grid"].forEach(function (id) {
    var g = document.getElementById(id);
    if (!g) return;
    var host = g.parentElement;
    host.classList.add("sa-host");
    var next = document.createElement("button"), prev = document.createElement("button");
    next.type = prev.type = "button";
    next.className = "sa-btn sa-next sa-nudge"; prev.className = "sa-btn sa-prev";
    next.setAttribute("aria-label", "Show more"); prev.setAttribute("aria-label", "Show previous");
    next.innerHTML = prev.innerHTML = ARROW;
    host.appendChild(prev); host.appendChild(next);

    function step() {
      var c = [].filter.call(g.children, function (el) { return el.offsetWidth; })[0];
      var gap = parseFloat(getComputedStyle(g).columnGap) || 12;
      return c ? c.offsetWidth + gap : g.clientWidth * 0.8;
    }
    function place() {
      var mid = g.offsetTop + g.offsetHeight / 2;
      next.style.top = prev.style.top = mid + "px";
    }
    function paint() {
      if (!mq.matches) return;
      var max = g.scrollWidth - g.clientWidth - 4;
      next.hidden = g.scrollLeft >= max || g.scrollWidth <= g.clientWidth + 4;
      prev.hidden = g.scrollLeft <= 4;
      if (g.scrollLeft > 4) next.classList.remove("sa-nudge");
    }
    next.addEventListener("click", function () { g.scrollBy({ left: step(), behavior: "smooth" }); });
    prev.addEventListener("click", function () { g.scrollBy({ left: -step(), behavior: "smooth" }); });
    g.addEventListener("scroll", paint, { passive: true });
    addEventListener("resize", function () { place(); paint(); });
    if (window.ResizeObserver) new ResizeObserver(function () { place(); paint(); }).observe(g);
    /* shelf tabs swap the cards in #pgrid; recheck after they settle */
    new MutationObserver(function () { setTimeout(function () { place(); paint(); }, 60); }).observe(g, { childList: true });
    place(); paint();
  });
})();
