// Main script file for KostKusip

document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation menu toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show-menu');
        });
    }

    // Update background animation based on theme (removed Three.js particles)
    window.updateBackgroundTheme = function(theme) {
        // The CSS handles the background animation themes automatically
        // This function remains as a placeholder in case additional theme-related
        // changes are needed in the future
        console.log(`Theme changed to: ${theme}`);
    };

    // Initialize room carousel
    const roomCarousel = document.getElementById('room-carousel');
    if (roomCarousel) {
        const flkty = new Flickity( roomCarousel, {
            // options
            cellAlign: 'left',
            contain: true,
            wrapAround: true
        });
    }

    // Initialize contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // Handle form submission
            console.log('Form submitted!');
        });
    }
});

