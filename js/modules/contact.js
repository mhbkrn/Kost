/**
 * Contact Module
 * Handles WhatsApp and contact functionality
 */

const ContactManager = (function() {
    // Initialize contact features
    const init = function() {
        setupWhatsAppButton();
    };
    
    // Setup WhatsApp contact button with dynamic message
    const setupWhatsAppButton = function() {
        const whatsappButton = document.querySelector('.whatsapp-button');
        
        if (whatsappButton) {
            whatsappButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Add click animation
                this.classList.add('button-clicked');
                setTimeout(() => this.classList.remove('button-clicked'), 300);
                
                const defaultMessage = "Hello! I'm interested in booking a premium room at KostKusip.";
                const whatsappNumber = this.href.split('wa.me/')[1];
                const encodedMessage = encodeURIComponent(defaultMessage);
                
                window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
            });
        }
    };
    
    // Public API
    return {
        init: init
    };
})();