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

    // MagicBento Tilt Effect Only
    function initMagicBento() {
        if (prefersReduced || !window.gsap) return;
        
        var cards = document.querySelectorAll('.methodology-step');
        if (cards.length === 0) return;
        
        cards.forEach(function(card) {
            function handleMouseMove(e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var centerX = rect.width / 2;
                var centerY = rect.height / 2;
                
                var rotateX = ((y - centerY) / centerY) * -10;
                var rotateY = ((x - centerX) / centerX) * 10;
                
                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    duration: 0.1,
                    ease: 'power2.out',
                    transformPerspective: 1000
                });
            }
            
            function handleMouseLeave() {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
            
            card.addEventListener('mousemove', handleMouseMove);
            card.addEventListener('mouseleave', handleMouseLeave);
        });
    }

    // Modern micro-interactions
    function initMicroInteractions() {
        if (prefersReduced) return;
        
        // Add subtle hover effects to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .grid-item, .insight-card, .article-card, .testimonial-card');
        
        interactiveElements.forEach(function(element) {
            element.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
        
        // Add ripple effect to buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(function(button) {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(function() {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // FAQ Accordion functionality
    function initFAQ() {
        var faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(function(item) {
            var question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', function() {
                    var isActive = item.classList.contains('active');
                    
                    // Close all other FAQ items
                    faqItems.forEach(function(otherItem) {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    // Toggle current item
                    if (isActive) {
                        item.classList.remove('active');
                    } else {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    // Initialize after DOM ready
    document.addEventListener('DOMContentLoaded', function(){
        initReveal();
        initCountUp();
        initParallax();
        initBrandCarousel();
        initMagicBento();
        initMicroInteractions();
        initFAQ();

        // Contact form handling is now managed in contact.html
    });
})();


