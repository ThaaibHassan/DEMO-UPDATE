!function() {
    var t = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function e(t, e, n) {
        return Math.min(n, Math.max(e, t));
    }
    document.addEventListener("DOMContentLoaded", function() {
        var n;
        !function() {
            if (!t && "IntersectionObserver" in window) {
                var e = new IntersectionObserver(function(t) {
                    t.forEach(function(t) {
                        t.isIntersecting && (t.target.classList.add("reveal-in"), e.unobserve(t.target));
                    });
                }, {
                    rootMargin: "0px 0px -10% 0px",
                    threshold: .15
                });
                document.querySelectorAll("[data-reveal]").forEach(function(t) {
                    e.observe(t);
                });
            } else document.querySelectorAll("[data-reveal]").forEach(function(t) {
                t.classList.add("reveal-in");
            });
        }(), function() {
            var n = Array.prototype.slice.call(document.querySelectorAll("[data-countup]"));
            if (0 !== n.length) if (!t && "IntersectionObserver" in window) {
                var a = new WeakSet, i = new IntersectionObserver(function(t) {
                    t.forEach(function(t) {
                        t.isIntersecting && !a.has(t.target) && (a.add(t.target), r(t.target), i.unobserve(t.target));
                    });
                }, {
                    threshold: .2
                });
                n.forEach(function(t) {
                    i.observe(t);
                });
            } else n.forEach(r);
            function r(n) {
                var a = parseFloat(n.getAttribute("data-countup")) || 0, i = parseInt(n.getAttribute("data-duration") || "1200", 10), r = n.getAttribute("data-prefix") || "", o = n.getAttribute("data-suffix") || "", c = null;
                t ? n.textContent = r + a.toLocaleString() + o : requestAnimationFrame(function t(s) {
                    null === c && (c = s);
                    var l = e((s - c) / i, 0, 1), u = Math.floor(0 + (a - 0) * l);
                    n.textContent = r + u.toLocaleString() + o, l < 1 && requestAnimationFrame(t);
                });
            }
        }(), function() {
            var n = document.querySelector(".hero-background");
            n && (window.scrollY, t || (window.addEventListener("scroll", a, {
                passive: !0
            }), a()));
            function a() {
                var t = e(.2 * window.scrollY, 0, 200);
                n.style.backgroundPosition = "center calc(50% + " + (0 | t) + "px)";
            }
        }(), function() {
            var e = document.querySelector(".brand-carousel");
            if (e) {
                var n = e.querySelector(".brand-track");
                n && (n.style.willChange = "transform", n.style.backfaceVisibility = "hidden", n.style.transform = "translateZ(0)", 
                t ? n.style.animation = "none" : (n.style.animation = "marquee 30s linear infinite", 
                document.addEventListener("visibilitychange", function() {
                    document.hidden ? n.style.animationPlayState = "paused" : n.style.animationPlayState = "running";
                }), e.addEventListener("mouseenter", function() {
                    n.style.animationPlayState = "paused";
                }), e.addEventListener("mouseleave", function() {
                    n.style.animationPlayState = "running";
                })));
            }
        }(), function() {
            if (!t && window.gsap) {
                var e = document.querySelectorAll(".methodology-step");
                0 !== e.length && e.forEach(function(t) {
                    t.addEventListener("mousemove", function(e) {
                        var n = t.getBoundingClientRect(), a = e.clientX - n.left, i = e.clientY - n.top, r = n.width / 2, o = n.height / 2, c = (i - o) / o * -10, s = (a - r) / r * 10;
                        gsap.to(t, {
                            rotateX: c,
                            rotateY: s,
                            duration: .1,
                            ease: "power2.out",
                            transformPerspective: 1e3
                        });
                    }), t.addEventListener("mouseleave", function() {
                        gsap.to(t, {
                            rotateX: 0,
                            rotateY: 0,
                            duration: .3,
                            ease: "power2.out"
                        });
                    });
                });
            }
        }(), function() {
            if (t) return;
            document.querySelectorAll("a, button, .grid-item, .insight-card, .article-card, .testimonial-card").forEach(function(t) {
                t.addEventListener("mouseenter", function() {
                    this.style.transform = "translateY(-2px)";
                }), t.addEventListener("mouseleave", function() {
                    this.style.transform = "translateY(0)";
                });
            }), document.querySelectorAll(".btn").forEach(function(t) {
                t.addEventListener("click", function(t) {
                    const e = document.createElement("span"), n = this.getBoundingClientRect(), a = Math.max(n.width, n.height), i = t.clientX - n.left - a / 2, r = t.clientY - n.top - a / 2;
                    e.style.width = e.style.height = a + "px", e.style.left = i + "px", e.style.top = r + "px", 
                    e.classList.add("ripple"), this.appendChild(e), setTimeout(function() {
                        e.remove();
                    }, 600);
                });
            });
        }(), (n = document.querySelectorAll(".faq-item")).forEach(function(t) {
            var e = t.querySelector(".faq-question");
            e && e.addEventListener("click", function() {
                var e = t.classList.contains("active");
                n.forEach(function(e) {
                    e !== t && e.classList.remove("active");
                }), e ? t.classList.remove("active") : t.classList.add("active");
            });
        });
    });
}();