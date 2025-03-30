// Three.js background animations

// Global variables
let scene, camera, renderer;
let particles = [];
let animationId;
let themeColor = 'light';

// Initialize the Three.js scene
function initThreeBackground() {
    const container = document.getElementById('three-background');
    if (!container) return;

    // Create scene
    scene = new THREE.Scene();
    window.scene = scene; // Make it globally available for theme changes

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Check current theme
    themeColor = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    
    // Create light mode animated background
    createLightModeBackground();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    animate();
}

// Light mode background with floating particles - using existing particles but making them more visible
function createLightModeBackground() {
    // Clear existing particles
    if (particles.length > 0) {
        particles.forEach(particle => {
            scene.remove(particle);
        });
        particles = [];
    }

    // Create particles - keep the same count but make them more visible
    const particleCount = Math.min(window.innerWidth / 10, 100); // Keep original count
    const particleGeometry = new THREE.SphereGeometry(0.2, 8, 8); // Larger size for visibility
    
    // Use a more vibrant gold color with higher opacity for light mode
    const particleMaterial = new THREE.MeshBasicMaterial({
        color: 0xC9A87C, // Secondary gold color
        transparent: true,
        opacity: 0.9 // Higher opacity for better visibility in light mode
    });

    for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
        
        // Random positions across screen
        particle.position.x = Math.random() * 40 - 20;
        particle.position.y = Math.random() * 30 - 15;
        particle.position.z = Math.random() * 10 - 15;
        
        // Add random movement properties with slightly faster animation
        particle.userData = {
            speed: Math.random() * 0.04 + 0.02, // Faster speed for more noticeable movement
            rotationSpeed: Math.random() * 0.02, // Maintain rotation speed
            direction: new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5
            ).normalize(),
            size: Math.random() * 0.4 + 0.3 // Larger size range for better visibility
        };
        
        // Set random size
        particle.scale.set(
            particle.userData.size,
            particle.userData.size,
            particle.userData.size
        );
        
        scene.add(particle);
        particles.push(particle);
    }

    // Add floating triangular elements (decorative) - with enhanced visibility
    const triangleCount = Math.min(window.innerWidth / 50, 15); // Keep original count
    const triangleGeometry = new THREE.BufferGeometry();
    
    // Create a triangle
    const vertices = new Float32Array([
        0.0, 1.0, 0.0,    // top
        -0.87, -0.5, 0.0, // bottom left
        0.87, -0.5, 0.0   // bottom right
    ]);

    triangleGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    
    // Use a more prominent accent color for triangles in light mode
    const triangleMaterial = new THREE.MeshBasicMaterial({
        color: 0x4F6D7A, // Accent color
        transparent: true,
        opacity: 0.4, // Higher opacity for better visibility
        side: THREE.DoubleSide
    });

    for (let i = 0; i < triangleCount; i++) {
        const triangle = new THREE.Mesh(triangleGeometry, triangleMaterial.clone());
        
        // Random positions
        triangle.position.x = Math.random() * 50 - 25;
        triangle.position.y = Math.random() * 40 - 20;
        triangle.position.z = Math.random() * 10 - 15;
        
        // Larger scale for better visibility
        const scale = Math.random() * 1.5 + 1.0;
        triangle.scale.set(scale, scale, scale);
        
        // Random rotation
        triangle.rotation.z = Math.random() * Math.PI;
        
        // Add movement behavior with slightly increased speed
        triangle.userData = {
            speed: Math.random() * 0.015 + 0.005, // Slightly faster
            rotationSpeed: Math.random() * 0.005 + 0.003,
            direction: new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                0
            ).normalize()
        };
        
        scene.add(triangle);
        particles.push(triangle);
    }

    // Store particles for theme change
    window.particles = particles;
}

// Animation loop
function animate() {
    animationId = requestAnimationFrame(animate);
    
    // Animate particles
    particles.forEach(particle => {
        // Move particle
        particle.position.x += particle.userData.direction.x * particle.userData.speed;
        particle.position.y += particle.userData.direction.y * particle.userData.speed;
        particle.position.z += particle.userData.direction.z * particle.userData.speed * 0.5;
        
        // Rotate particle
        particle.rotation.x += particle.userData.rotationSpeed;
        particle.rotation.y += particle.userData.rotationSpeed;
        
        // Boundary check - wrap around if particles go too far
        const bounds = 30;
        if (particle.position.x > bounds) particle.position.x = -bounds;
        if (particle.position.x < -bounds) particle.position.x = bounds;
        if (particle.position.y > bounds) particle.position.y = -bounds;
        if (particle.position.y < -bounds) particle.position.y = bounds;
        if (particle.position.z > 5) particle.position.z = -15;
        if (particle.position.z < -15) particle.position.z = 5;
        
        // Pulse effect for increased visibility - subtle size variations
        if (Math.random() > 0.99) {
            const pulseSize = particle.userData.size * (Math.random() * 0.2 + 0.9);
            particle.scale.set(pulseSize, pulseSize, pulseSize);
        }
    });
    
    // Mouse interaction - if mouse movement is detected
    if (mousePosition) {
        // Use mouse position to gently move particles
        particles.forEach(particle => {
            // Calculate distance between mouse and particle
            const dx = mousePosition.x - particle.position.x;
            const dy = mousePosition.y - particle.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Apply stronger attraction/repulsion effect for better interactivity
            if (distance < 10) {
                particle.position.x += dx * 0.002;
                particle.position.y += dy * 0.002;
            }
        });
    }
    
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Track mouse movement
let mousePosition = null;
function onMouseMove(event) {
    // Convert mouse coordinates to Three.js coordinate system
    mousePosition = {
        x: (event.clientX / window.innerWidth) * 40 - 20,
        y: -(event.clientY / window.innerHeight) * 30 + 15
    };
}

// Initialize on document load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js scene
    initThreeBackground();
    
    // Add mouse tracking
    document.addEventListener('mousemove', onMouseMove);
    
    // Make update function available globally for theme switcher
    window.updateThreeJsParticles = function(theme) {
        themeColor = theme;
        
        // Update particle colors and opacity based on theme
        particles.forEach(particle => {
            if (particle.material) {
                // For sphere particles
                if (particle.geometry.type === 'SphereGeometry') {
                    particle.material.color.set(theme === 'dark' ? 0x4F6D7A : 0xC9A87C);
                    particle.material.opacity = theme === 'dark' ? 0.7 : 0.9;
                } 
                // For triangle particles
                else if (particle.geometry.type === 'BufferGeometry') {
                    particle.material.color.set(theme === 'dark' ? 0xC9A87C : 0x4F6D7A);
                    particle.material.opacity = theme === 'dark' ? 0.3 : 0.4;
                }
                particle.material.needsUpdate = true;
            }
        });
    };
});