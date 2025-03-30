// Room carousel functionality

document.addEventListener('DOMContentLoaded', () => {
    // Room carousel navigation
    const prevRoomBtn = document.querySelector('.prev-room');
    const nextRoomBtn = document.querySelector('.next-room');
    const roomDots = document.querySelectorAll('.room-dot');
    const roomImages = document.querySelectorAll('.room-image');
    const roomDetails = document.querySelectorAll('.room-detail');
    
    let currentRoomIndex = 0;
    const roomTypes = ['standard', 'deluxe', 'premium'];
    
    // Show the current room
    function showRoom(index) {
        // Update room images
        roomImages.forEach(img => img.classList.remove('active'));
        roomImages[index].classList.add('active');
        
        // Update room details
        roomDetails.forEach(detail => detail.classList.remove('active'));
        roomDetails[index].classList.add('active');
        
        // Update dots
        roomDots.forEach(dot => dot.classList.remove('active'));
        roomDots[index].classList.add('active');
        
        // Update current index
        currentRoomIndex = index;
    }
    
    // Next room
    nextRoomBtn.addEventListener('click', () => {
        let nextIndex = currentRoomIndex + 1;
        if (nextIndex >= roomImages.length) {
            nextIndex = 0;
        }
        showRoom(nextIndex);
    });
    
    // Previous room
    prevRoomBtn.addEventListener('click', () => {
        let prevIndex = currentRoomIndex - 1;
        if (prevIndex < 0) {
            prevIndex = roomImages.length - 1;
        }
        showRoom(prevIndex);
    });
    
    // Click on dots
    roomDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showRoom(index);
        });
    });
    
    // Auto-advance carousel
    let carouselInterval = setInterval(() => {
        nextRoomBtn.click();
    }, 8000);
    
    // Pause auto-advance on user interaction
    function pauseCarousel() {
        clearInterval(carouselInterval);
        // Resume after longer delay
        carouselInterval = setInterval(() => {
            nextRoomBtn.click();
        }, 8000);
    }
    
    // Pause on interaction
    prevRoomBtn.addEventListener('click', pauseCarousel);
    nextRoomBtn.addEventListener('click', pauseCarousel);
    roomDots.forEach(dot => dot.addEventListener('click', pauseCarousel));
    
    // Add hover effects to room images
    roomImages.forEach(image => {
        image.addEventListener('mouseenter', () => {
            image.querySelector('.room-overlay').style.opacity = '1';
        });
        
        image.addEventListener('mouseleave', () => {
            image.querySelector('.room-overlay').style.opacity = '0.9';
        });
    });
});