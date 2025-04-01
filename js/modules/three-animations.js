// Three.js background animations

// Global variables
let scene, camera, renderer;
let particles = [];
let animationId;
let themeColor = 'light';
let isReducedMotion = false;
let isLowEndDevice = false;
let mousePosition = null;
let isAnimating = true;
let lastFrameTime = 0;
const targetFPS = 30; // Target frame rate for performance

// Performance check utility
function checkPerformance() {
    // Check for reduced motion preference
    isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Check for low-end device
    isLowEndDevice = (
        navigator.deviceMemory < 4 || // Less than 4GB RAM
        navigator.hardwareConcurrency < 4 // Less than 4 CPU cores
    );
    
    // Set particle count based on device capability
    return {
        particleCount: isLowEndDevice ? 30 : Math.min(window.innerWidth / 10, 100),
        triangleCount: isLowEndDevice ? 5 : Math.min(window.innerWidth / 50, 15),
        useSimpleShaders: isLowEndDevice,
        reduceAnimationSpeed: isReducedMotion,
        pixelRatio: isLowEndDevice ? Math.min(1, window.devicePixelRatio) : window.devicePixelRatio
    };
}

// Initialize the Three.js scene
function initThreeBackground() {
    const container = document.getElementById('three-background');
    if (!container) return;
    
    // Run performance checks
    const perfSettings = checkPerformance();

    // Create scene
    scene = new THREE.Scene();
    window.scene = scene; // Make it globally available for theme changes

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    // Create renderer with optimized settings
    renderer = new THREE.WebGLRenderer({ 
        antialias: !isLowEndDevice, // Disable antialiasing on low-end devices
        alpha: true,
        powerPreference: 'low-power' // Prefer power savings
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(perfSettings.pixelRatio);
    container.appendChild(renderer.domElement);

    // Check current theme
    themeColor = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    
    // Create light mode animated background
    createLightModeBackground(perfSettings);

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Add visibility change listeners to pause/resume animations
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Add reduced motion listener
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
        isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        updateAnimationSpeed();
    });

    // Start animation loop
    animate();
}

// Light mode background with floating particles
function createLightModeBackground(perfSettings) {
    // Clear existing particles
    if (particles.length > 0) {
        particles.forEach(particle => {
            if (particle.material) {
                particle.material.dispose();
            }
            if (particle.geometry) {
                particle.geometry.dispose();
            }
            scene.remove(particle);
        });
        particles = [];
    }

    // Create particles
    const particleCount = perfSettings.particleCount;
    const particleGeometry = new THREE.SphereGeometry(0.2, isLowEndDevice ? 4 : 8, isLowEndDevice ? 4 : 8);
    
    // Use instanced meshes for better performance with many particles
    const particleMaterial = new THREE.MeshBasicMaterial({
        color: 0xC9A87C, // Secondary gold color
        transparent: true,
        opacity: 0.9
    });
    
    // Create individual particles for easier manipulation
    for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
        
        // Random positions across screen
        particle.position.x = Math.random() * 40 - 20;
        particle.position.y = Math.random() * 30 - 15;
        particle.position.z = Math.random() * 10 - 15;
        
        // Optimization: Adjust speed based on reduced motion preference
        const speedMultiplier = isReducedMotion ? 0.3 : 1.0;
        
        // Add random movement properties
        particle.userData = {
            speed: (Math.random() * 0.04 + 0.02) * speedMultiplier,
            rotationSpeed: (Math.random() * 0.02) * speedMultiplier,
            direction: new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5
            ).normalize(),
            size: Math.random() * 0.4 + 0.3
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

    // Add floating triangular elements (decorative)
    // Skip triangles on very low-end devices
    if (!isLowEndDevice || perfSettings.triangleCount > 0) {
        const triangleCount = perfSettings.triangleCount;
        const triangleGeometry = new THREE.BufferGeometry();
        
        // Create a triangle
        const vertices = new Float32Array([
            0.0, 1.0, 0.0,    // top
            -0.87, -0.5, 0.0, // bottom left
            0.87, -0.5, 0.0   // bottom right
        ]);

        triangleGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        
        const triangleMaterial = new THREE.MeshBasicMaterial({
            color: 0x4F6D7A, // Accent color
            transparent: true,
            opacity: 0.4,
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
            
            // Optimization: Adjust speed based on reduced motion preference
            const speedMultiplier = isReducedMotion ? 0.3 : 1.0;
            
            // Add movement behavior
            triangle.userData = {
                speed: (Math.random() * 0.015 + 0.005) * speedMultiplier,
                rotationSpeed: (Math.random() * 0.005 + 0.003) * speedMultiplier,
                direction: new THREE.Vector3(
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    0
                ).normalize()
            };
            
            scene.add(triangle);
            particles.push(triangle);
        }
    }

    // Store particles for theme change
    window.particles = particles;
}

// Animation loop with frame limiting for performance
function animate(timestamp) {
    if (!isAnimating) {
        return;
    }
    
    animationId = requestAnimationFrame(animate);
    
    // Limit frame rate for better performance on low-end devices
    if (isLowEndDevice) {
        // Skip frames to achieve target FPS
        const elapsed = timestamp - lastFrameTime;
        const frameInterval = 1000 / targetFPS;
        
        if (elapsed < frameInterval) {
            return;
        }
        
        lastFrameTime = timestamp - (elapsed % frameInterval);
    }
    
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
        
        // Pulse effect - only apply if not in reduced motion mode
        if (!isReducedMotion && Math.random() > 0.99) {
            const pulseSize = particle.userData.size * (Math.random() * 0.2 + 0.9);
            particle.scale.set(pulseSize, pulseSize, pulseSize);
        }
    });
    
    // Mouse interaction - if mouse movement is detected
    // Skip in reduced motion mode
    if (!isReducedMotion && mousePosition) {
        // Use mouse position to gently move particles
        // Only process every nth particle for performance on low-end devices
        const skipFactor = isLowEndDevice ? 3 : 1;
        
        particles.forEach((particle, index) => {
            if (index % skipFactor !== 0) return;
            
            // Calculate distance between mouse and particle
            const dx = mousePosition.x - particle.position.x;
            const dy = mousePosition.y - particle.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Apply attraction/repulsion effect
            if (distance < 10) {
                particle.position.x += dx * 0.002;
                particle.position.y += dy * 0.002;
            }
        });
    }
    
    renderer.render(scene, camera);
}

// Handle window resize with throttling
const throttledResize = throttle(onWindowResize, 100);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Simple throttle function to limit execution frequency
function throttle(func, limit) {
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

// Track mouse movement with throttling
const throttledMouseMove = throttle(onMouseMove, 50);
function onMouseMove(event) {
    // Skip tracking in reduced motion mode
    if (isReducedMotion) return;
    
    // Convert mouse coordinates to Three.js coordinate system
    mousePosition = {
        x: (event.clientX / window.innerWidth) * 40 - 20,
        y: -(event.clientY / window.innerHeight) * 30 + 15
    };
}

// Pause/resume animations when tab not visible
function handleVisibilityChange() {
    if (document.hidden) {
        pauseAnimation();
    } else {
        resumeAnimation();
    }
}

// Pause animation
function pauseAnimation() {
    isAnimating = false;
    cancelAnimationFrame(animationId);
}

// Resume animation
function resumeAnimation() {
    if (!isAnimating) {
        isAnimating = true;
        lastFrameTime = 0;
        animate();
    }
}

// Update animation speed based on reduced motion preference
function updateAnimationSpeed() {
    const speedMultiplier = isReducedMotion ? 0.3 : 1.0;
    
    particles.forEach(particle => {
        if (particle.userData) {
            // Scale the original speed values
            if (particle.geometry.type === 'SphereGeometry') {
                particle.userData.speed = (Math.random() * 0.04 + 0.02) * speedMultiplier;
                particle.userData.rotationSpeed = (Math.random() * 0.02) * speedMultiplier;
            } else {
                particle.userData.speed = (Math.random() * 0.015 + 0.005) * speedMultiplier;
                particle.userData.rotationSpeed = (Math.random() * 0.005 + 0.003) * speedMultiplier;
            }
        }
    });
}

// Clean up resources
function disposeResources() {
    // Remove event listeners
    window.removeEventListener('resize', throttledResize);
    document.removeEventListener('mousemove', throttledMouseMove);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    
    // Dispose geometries and materials
    particles.forEach(particle => {
        if (particle.material) {
            particle.material.dispose();
        }
        if (particle.geometry) {
            particle.geometry.dispose();
        }
        scene.remove(particle);
    });
    
    if (renderer) {
        renderer.dispose();
    }
    
    // Clear references
    scene = null;
    camera = null;
    renderer = null;
    particles = [];
}

// Initialize on document load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js scene
    initThreeBackground();
    
    // Add mouse tracking with throttling for performance
    document.addEventListener('mousemove', throttledMouseMove);
    
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
    
    // Clean up on page unload
    window.addEventListener('beforeunload', disposeResources);
});