// Modern animations for KostKusip website

// Performance utilities
const animationUtils = {
    // Check if device is low-end (low memory or CPU)
    isLowEndDevice: () => {
        return (
            navigator.deviceMemory < 4 || // Less than 4GB RAM
            navigator.hardwareConcurrency < 4 // Less than 4 CPU cores
        );
    },
    
    // Check if user prefers reduced motion
    prefersReducedMotion: () => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
    
    // Throttle function to limit execution frequency
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Animation observer for scroll animations
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    // Skip heavy animations if device is low-end or user prefers reduced motion
    const shouldReduceMotion = animationUtils.prefersReducedMotion() || animationUtils.isLowEndDevice();
    
    // IntersectionObserver configuration
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply simpler animation for reduced motion preference
                if (shouldReduceMotion) {
                    entry.target.classList.add('animated-simple');
                } else {
                    entry.target.classList.add('animated');
                }
                // Only observe once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Lower threshold for earlier triggering
        rootMargin: '0px 0px -30px 0px'
    });
    
    // Observe each element
    elements.forEach(element => {
        // Add will-change property for better performance
        element.style.willChange = 'opacity, transform';
        observer.observe(element);
    });
};

// Optimized parallax effects for hero section
const initParallax = () => {
    const heroSection = document.querySelector('.hero');
    
    if (!heroSection) return;
    
    // Skip parallax on low-end devices or reduced motion preference
    if (animationUtils.prefersReducedMotion() || animationUtils.isLowEndDevice()) {
        return;
    }
    
    // Set will-change for better performance
    heroSection.style.willChange = 'background-position';
    
    let ticking = false;
    let lastScrollY = 0;
    
    // Use requestAnimationFrame for smooth parallax
    const updateParallax = () => {
        const scrollValue = window.scrollY;
        if (scrollValue <= window.innerHeight) {
            heroSection.style.backgroundPositionY = `${scrollValue * 0.3}px`;
        }
        ticking = false;
        lastScrollY = scrollValue;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking && Math.abs(window.scrollY - lastScrollY) > 5) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
};

// Optimized header scroll effect
const headerScrollEffect = () => {
    const header = document.querySelector('.header-modern');
    if (!header) return;
    
    let ticking = false;
    let lastScrollY = 0;
    
    const updateHeaderClass = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        ticking = false;
        lastScrollY = window.scrollY;
    };
    
    window.addEventListener('scroll', animationUtils.throttle(() => {
        if (!ticking && Math.abs(window.scrollY - lastScrollY) > 5) {
            requestAnimationFrame(updateHeaderClass);
            ticking = true;
        }
    }, 100));
};

// Text typing animation with optimizations
const typingAnimation = () => {
    const animatedTexts = document.querySelectorAll('.typing-animation');
    
    // Skip typing animations on reduced motion preference
    if (animationUtils.prefersReducedMotion()) {
        animatedTexts.forEach(text => {
            text.style.visibility = 'visible';
        });
        return;
    }
    
    animatedTexts.forEach(text => {
        const originalText = text.textContent;
        text.textContent = '';
        text.style.visibility = 'visible';
        
        let letterIndex = 0;
        const speed = parseInt(text.dataset.speed) || 80;
        
        function type() {
            if (letterIndex < originalText.length) {
                text.textContent += originalText.charAt(letterIndex);
                letterIndex++;
                setTimeout(type, speed);
            }
        }
        
        // Start typing animation with a delay
        setTimeout(() => {
            type();
        }, 300);
    });
};

// Optimized hover effects for interactive elements
const addHoverEffects = () => {
    // Skip hover effects on low-end devices
    if (animationUtils.isLowEndDevice()) return;
    
    const interactiveElements = document.querySelectorAll('.benefit-card, .availability-card');
    
    interactiveElements.forEach(element => {
        // Use CSS classes instead of direct style manipulation for better performance
        element.addEventListener('mouseenter', () => {
            element.classList.add('hover-active');
        });
        
        element.addEventListener('mouseleave', () => {
            element.classList.remove('hover-active');
        });
    });
};

// Clean up animation resources when not needed
const cleanupAnimations = () => {
    // Remove will-change properties after animations complete
    const animatedElements = document.querySelectorAll('.animated, .animated-simple');
    
    if (animatedElements.length > 0) {
        setTimeout(() => {
            animatedElements.forEach(element => {
                element.style.willChange = 'auto';
            });
        }, 1000); // Give time for animations to complete
    }
};

// Add animation classes to elements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    const shouldReduceMotion = animationUtils.prefersReducedMotion() || animationUtils.isLowEndDevice();
    
    // Add animation classes for scroll animations
    const benefitCards = document.querySelectorAll('.benefit-card');
    const availabilityCards = document.querySelectorAll('.availability-card');
    const sectionTitles = document.querySelectorAll('.section-title');
    
    // Use smaller animation delays for better perceived performance
    const delayIncrement = shouldReduceMotion ? 0.05 : 0.08;
    
    benefitCards.forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        card.style.animationDelay = `${index * delayIncrement}s`;
    });
    
    availabilityCards.forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        card.style.animationDelay = `${index * delayIncrement}s`;
    });
    
    sectionTitles.forEach(title => {
        title.classList.add('animate-on-scroll');
    });
    
    // Initialize animations
    animateOnScroll();
    headerScrollEffect();
    addHoverEffects();
    
    // Delay heavier animations slightly
    setTimeout(() => {
        initParallax();
        typingAnimation();
    }, 100);
    
    // Schedule cleanup
    setTimeout(cleanupAnimations, 3000);
});

// Add CSS styles for animations
(function addAnimationStyles() {
    const styleElement = document.createElement('style');
    
    styleElement.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.7s cubic-bezier(0.23, 1, 0.32, 1), 
                        transform 0.7s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .animate-on-scroll.animated {
            opacity: 1;
            transform: translateY(0);
        }
        
        .animate-on-scroll.animated-simple {
            opacity: 1;
            transform: none;
        }
        
        .hover-active {
            transform: translateY(-5px) !important;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        /* Optimized keyframes */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.95);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        /* Reduced motion styles */
        @media (prefers-reduced-motion: reduce) {
            .animate-on-scroll {
                transition-duration: 0.3s;
            }
            
            .hover-active {
                transform: none !important;
            }
        }
    `;
    
    document.head.appendChild(styleElement);
})();

// Listen for reduced motion preference changes
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
    // Reload animations with new preference
    animateOnScroll();
    initParallax();
});