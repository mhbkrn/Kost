// Modern animations for KostKusip website

// Animation observer for scroll animations
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    // IntersectionObserver configuration
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Only observe once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe each element
    elements.forEach(element => {
        observer.observe(element);
    });
};

// Parallax effects for hero section
const initParallax = () => {
    const heroSection = document.querySelector('.hero');
    
    if (!heroSection) return;
    
    window.addEventListener('scroll', () => {
        const scrollValue = window.scrollY;
        if (scrollValue <= window.innerHeight) {
            heroSection.style.backgroundPositionY = `${scrollValue * 0.5}px`;
        }
    });
};

// Header scroll effect
const headerScrollEffect = () => {
    const header = document.querySelector('.header-modern');
    const heroSection = document.querySelector('.hero');
    
    if (!header || !heroSection) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
};

// Text typing animation
const typingAnimation = () => {
    const animatedTexts = document.querySelectorAll('.typing-animation');
    
    animatedTexts.forEach(text => {
        const originalText = text.textContent;
        text.textContent = '';
        
        let letterIndex = 0;
        const speed = text.dataset.speed || 100;
        
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
        }, 500);
    });
};

// Add hover effects for interactive elements
const addHoverEffects = () => {
    const interactiveElements = document.querySelectorAll('.benefit-card, .availability-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-10px)';
            element.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0)';
            element.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.05)';
        });
    });
};

// Add animation classes to elements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add animation classes for scroll animations
    const benefitCards = document.querySelectorAll('.benefit-card');
    const availabilityCards = document.querySelectorAll('.availability-card');
    const sectionTitles = document.querySelectorAll('.section-title');
    
    benefitCards.forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    availabilityCards.forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    sectionTitles.forEach(title => {
        title.classList.add('animate-on-scroll');
    });
    
    // Initialize animations
    setTimeout(() => {
        animateOnScroll();
        headerScrollEffect();
        addHoverEffects();
        initParallax();
        typingAnimation();
    }, 100);
});

// Add CSS styles for animations
(function addAnimationStyles() {
    const styleElement = document.createElement('style');
    
    styleElement.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .animate-on-scroll.animated {
            opacity: 1;
            transform: translateY(0);
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    
    document.head.appendChild(styleElement);
})();