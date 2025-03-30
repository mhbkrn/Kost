// Navigation functionality for KostKusip

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav a');
    const body = document.body;
    
    // Toggle mobile menu
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            nav.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (nav.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
    }
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileToggle && mobileToggle.classList.contains('active')) {
                mobileToggle.classList.remove('active');
                nav.classList.remove('active');
                body.style.overflow = '';
            }
        });
    });
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only if the link points to an ID on this page
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Calculate header height to offset scroll position
                    const header = document.querySelector('.header-modern');
                    const headerHeight = header ? header.offsetHeight : 0;
                    
                    // Scroll to element with header offset
                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight,
                        behavior: 'smooth'
                    });
                    
                    // Update URL but don't scroll again
                    history.pushState(null, null, targetId);
                }
            }
        });
    });
    
    // Highlight active nav link based on scroll position
    function highlightNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const headerHeight = document.querySelector('.header-modern').offsetHeight;
        
        // Get current scroll position
        let scrollPosition = window.scrollY + headerHeight + 100; // Add offset for better detection
        
        // Check each section
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current section's link
                document.querySelector(`nav a[href="#${sectionId}"]`)?.classList.add('active');
            }
        });
    }
    
    // Run on scroll
    window.addEventListener('scroll', highlightNavLink);
    
    // Run once on load
    highlightNavLink();
});