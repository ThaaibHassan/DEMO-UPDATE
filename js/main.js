// Main site interactions: scroll reveal, count up, parallax
// Respects reduced motion

(function() {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }

    // Scroll Reveal
    function initReveal() {
        if (prefersReduced || !('IntersectionObserver' in window)) {
            document.querySelectorAll('[data-reveal]').forEach(function(el){
                el.classList.add('reveal-in');
            });
            return;
        }
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry){
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

        document.querySelectorAll('[data-reveal]').forEach(function(el){
            observer.observe(el);
        });
    }

    // Count Up for numbers
    function initCountUp() {
        var els = Array.prototype.slice.call(document.querySelectorAll('[data-countup]'));
        if (els.length === 0) return;
        function animate(el) {
            var end = parseFloat(el.getAttribute('data-countup')) || 0;
            var duration = parseInt(el.getAttribute('data-duration') || '1200', 10);
            var prefix = el.getAttribute('data-prefix') || '';
            var suffix = el.getAttribute('data-suffix') || '';
            var startTime = null;
            var start = 0;
            function step(ts){
                if (startTime === null) startTime = ts;
                var p = clamp((ts - startTime) / duration, 0, 1);
                var val = Math.floor(start + (end - start) * p);
                el.textContent = prefix + val.toLocaleString() + suffix;
                if (p < 1) requestAnimationFrame(step);
            }
            if (prefersReduced) {
                el.textContent = prefix + end.toLocaleString() + suffix;
            } else {
                requestAnimationFrame(step);
            }
        }

        if (prefersReduced || !('IntersectionObserver' in window)) {
            els.forEach(animate);
            return;
        }
        var seen = new WeakSet();
        var io = new IntersectionObserver(function(entries){
            entries.forEach(function(entry){
                if (entry.isIntersecting && !seen.has(entry.target)) {
                    seen.add(entry.target);
                    animate(entry.target);
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        els.forEach(function(el){ io.observe(el); });
    }

    // Lightweight hero parallax (background position)
    function initParallax() {
        var bg = document.querySelector('.hero-background');
        if (!bg) return;
        var lastY = window.scrollY;
        function onScroll(){
            var y = window.scrollY;
            // Parallax strength
            var offset = clamp(y * 0.2, 0, 200); // limit shift
            bg.style.backgroundPosition = 'center calc(50% + ' + (offset|0) + 'px)';
            lastY = y;
        }
        if (prefersReduced) return;
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // Brand carousel enhancement
    function initBrandCarousel() {
        var carousel = document.querySelector('.brand-carousel');
        if (!carousel) return;
        
        var track = carousel.querySelector('.brand-track');
        if (!track) return;
        
        // Ensure smooth animation on all devices
        track.style.willChange = 'transform';
        track.style.backfaceVisibility = 'hidden';
        track.style.transform = 'translateZ(0)';
        
        // Handle reduced motion preference
        if (prefersReduced) {
            track.style.animation = 'none';
            return;
        }
        
        // Force hardware acceleration and smooth animation
        track.style.animation = 'marquee 30s linear infinite';
        
        // Pause animation when tab is not visible
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                track.style.animationPlayState = 'paused';
            } else {
                track.style.animationPlayState = 'running';
            }
        });
        
        // Ensure animation doesn't restart on hover
        carousel.addEventListener('mouseenter', function() {
            track.style.animationPlayState = 'paused';
        });
        
        carousel.addEventListener('mouseleave', function() {
            track.style.animationPlayState = 'running';
        });
    }

    // Initialize after DOM ready
    document.addEventListener('DOMContentLoaded', function(){
        initReveal();
        initCountUp();
        initParallax();
        initBrandCarousel();

        // Contact form handling is now managed in contact.html
    });
})();


