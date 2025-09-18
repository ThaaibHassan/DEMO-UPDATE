!function() {
    var e = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function t(e, t, n) {
        return Math.min(n, Math.max(t, e));
    }
    document.addEventListener("DOMContentLoaded", function() {
        !function() {
            if (!e && "IntersectionObserver" in window) {
                var t = new IntersectionObserver(function(e) {
                    e.forEach(function(e) {
                        e.isIntersecting && (e.target.classList.add("reveal-in"), t.unobserve(e.target));
                    });
                }, {
                    rootMargin: "0px 0px -10% 0px",
                    threshold: .15
                });
                document.querySelectorAll("[data-reveal]").forEach(function(e) {
                    t.observe(e);
                });
            } else document.querySelectorAll("[data-reveal]").forEach(function(e) {
                e.classList.add("reveal-in");
            });
        }(), function() {
            var n = Array.prototype.slice.call(document.querySelectorAll("[data-countup]"));
            if (0 !== n.length) if (!e && "IntersectionObserver" in window) {
                var a = new WeakSet, r = new IntersectionObserver(function(e) {
                    e.forEach(function(e) {
                        e.isIntersecting && !a.has(e.target) && (a.add(e.target), i(e.target), r.unobserve(e.target));
                    });
                }, {
                    threshold: .2
                });
                n.forEach(function(e) {
                    r.observe(e);
                });
            } else n.forEach(i);
            function i(n) {
                var a = parseFloat(n.getAttribute("data-countup")) || 0, r = parseInt(n.getAttribute("data-duration") || "1200", 10), i = n.getAttribute("data-prefix") || "", o = n.getAttribute("data-suffix") || "", c = null;
                e ? n.textContent = i + a.toLocaleString() + o : requestAnimationFrame(function e(s) {
                    null === c && (c = s);
                    var l = t((s - c) / r, 0, 1), u = Math.floor(0 + (a - 0) * l);
                    n.textContent = i + u.toLocaleString() + o, l < 1 && requestAnimationFrame(e);
                });
            }
        }(), function() {
            var n = document.querySelector(".hero-background");
            n && (window.scrollY, e || (window.addEventListener("scroll", a, {
                passive: !0
            }), a()));
            function a() {
                var e = t(.2 * window.scrollY, 0, 200);
                n.style.backgroundPosition = "center calc(50% + " + (0 | e) + "px)";
            }
        }(), function() {
            var t = document.querySelector(".brand-carousel");
            if (t) {
                var n = t.querySelector(".brand-track");
                n && (n.style.willChange = "transform", n.style.backfaceVisibility = "hidden", n.style.transform = "translateZ(0)", 
                e ? n.style.animation = "none" : (n.style.animation = "marquee 30s linear infinite", 
                document.addEventListener("visibilitychange", function() {
                    document.hidden ? n.style.animationPlayState = "paused" : n.style.animationPlayState = "running";
                }), t.addEventListener("mouseenter", function() {
                    n.style.animationPlayState = "paused";
                }), t.addEventListener("mouseleave", function() {
                    n.style.animationPlayState = "running";
                })));
            }
        }();
    });
}();