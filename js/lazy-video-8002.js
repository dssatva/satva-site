/* 2 Nov 2026, owner picked "make the site lighter". :8002 only (linked before
   js/satva.js). The site's scripts call video.play() as soon as a card or stage
   becomes "current", even when it is far down the page, so every process film
   (~1.9 MB) downloaded on the first visit. Here play() on a video that is not
   near the screen is held back and runs only when the video scrolls near;
   pause() cancels a held play. Videos near the screen play exactly as before. */
(function () {
  if (!("IntersectionObserver" in window) || !window.HTMLMediaElement) return;
  var P = HTMLMediaElement.prototype, play = P.play, pause = P.pause;
  var MARGIN = 400; // px beyond the screen edge that already counts as "near"
  function near(v) {
    var r = v.getBoundingClientRect();
    if (!r.width && !r.height) return false; // hidden (display:none or not laid out)
    return r.bottom > -MARGIN && r.top < innerHeight + MARGIN &&
           r.right > -MARGIN && r.left < innerWidth + MARGIN;
  }
  var waiting = new WeakSet();
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var v = e.target;
      if (!e.isIntersecting || !waiting.has(v)) return;
      waiting.delete(v); io.unobserve(v);
      var pr = play.call(v); if (pr && pr.catch) pr.catch(function () {});
    });
  }, { rootMargin: MARGIN + "px" });
  P.play = function () {
    if (this.tagName !== "VIDEO" || near(this)) return play.apply(this, arguments);
    waiting.add(this); io.observe(this);
    return Promise.resolve();
  };
  P.pause = function () {
    if (waiting.has(this)) { waiting.delete(this); io.unobserve(this); }
    return pause.apply(this, arguments);
  };
})();
