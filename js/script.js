// Main script file for KostKusip

// Update background animation based on theme (replaced Three.js particles)
window.updateBackgroundTheme = function(theme) {
    // The CSS handles the background animation themes automatically
    // This function remains as a placeholder in case additional theme-related
    // changes are needed in the future
    console.log(`Theme changed to: ${theme}`);
};

// Initialize room 3D models with Three.js
const initRoom3DModel = (roomType, container) => {
    if (!container) return;
    
    // Room size configurations
    const roomSizes = {
        'standard': { width: 3, length: 4, height: 2.5 },
        'deluxe': { width: 4, length: 5, height: 2.7 },
        'premium': { width: 6, length: 6, height: 3 }
    };
    
    // Colors based on room type
    const roomColors = {
        'standard': 0xE6D5B8,
        'deluxe': 0xD4C2A8,
        'premium': 0xC9A87C
    };
    
    // Get room dimensions
    const size = roomSizes[roomType] || roomSizes.standard;
    const roomColor = roomColors[roomType] || roomColors.standard;
    
    // Create a scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f7f3);
    
    const camera = new THREE.PerspectiveCamera(
        50, container.offsetWidth / container.offsetHeight, 0.1, 1000
    );
    camera.position.set(size.length * 0.7, size.height * 0.8, size.width * 1.5);
    camera.lookAt(0, 0, 0);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Create room geometry
    createRoom(scene, size, roomColor);
    
    // Add furniture based on room type
    addFurniture(scene, roomType, size);
    
    // Add room controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    
    // Animation function
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Handle resize
    window.addEventListener('resize', () => {
        if (container) {
            camera.aspect = container.offsetWidth / container.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.offsetWidth, container.offsetHeight);
        }
    });
    
    // Start animation
    animate();
    
    // Return cleanup function
    return () => {
        controls.dispose();
        renderer.dispose();
        container.removeChild(renderer.domElement);
    };
};

// Create room geometry
function createRoom(scene, size, color) {
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(size.length, size.width);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xEAE0D5,
        roughness: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.1;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Walls
    const wallMaterial = new THREE.MeshStandardMaterial({ 
        color: color,
        roughness: 0.6
    });
    
    // Back wall
    const backWallGeometry = new THREE.PlaneGeometry(size.length, size.height);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.z = -size.width/2;
    backWall.position.y = size.height/2 - 0.1;
    scene.add(backWall);
    
    // Right wall
    const rightWallGeometry = new THREE.PlaneGeometry(size.width, size.height);
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
    rightWall.rotation.y = Math.PI / 2;
    rightWall.position.x = size.length/2;
    rightWall.position.y = size.height/2 - 0.1;
    scene.add(rightWall);
    
    // Left wall
    const leftWallGeometry = new THREE.PlaneGeometry(size.width, size.height);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.rotation.y = -Math.PI / 2;
    leftWall.position.x = -size.length/2;
    leftWall.position.y = size.height/2 - 0.1;
    scene.add(leftWall);
}

// Add furniture based on room type
function addFurniture(scene, roomType, size) {
    // Simple placeholder furniture based on room type
    if (roomType === 'standard') {
        // Single bed
        addBed(scene, 0.9, 2, -size.length/2 + 1, 0, -size.width/2 + 0.5);
        
        // Small desk
        addDesk(scene, 0.8, 0.5, size.length/2 - 0.4, 0, -size.width/2 + 0.3);
        
    } else if (roomType === 'deluxe') {
        // Queen bed
        addBed(scene, 1.5, 2, -size.length/2 + 1.2, 0, 0);
        
        // Desk and chair
        addDesk(scene, 1.2, 0.6, size.length/2 - 0.6, 0, -size.width/2 + 0.4);
        
        // Small wardrobe
        addWardrobe(scene, 1, 0.6, size.length/2 - 0.5, 0, size.width/2 - 0.4);
        
    } else if (roomType === 'premium') {
        // King bed
        addBed(scene, 2, 2.2, -size.length/2 + 1.5, 0, 0);
        
        // Large desk and chair
        addDesk(scene, 1.5, 0.8, size.length/2 - 0.8, 0, -size.width/2 + 0.5);
        
        // Wardrobe
        addWardrobe(scene, 1.2, 0.6, size.length/2 - 0.6, 0, size.width/2 - 0.5);
        
        // Sofa
        addSofa(scene, 1.8, 0.8, -size.length/2 + 1, 0, size.width/2 - 0.5);
    }
}

// Create a simple bed
function addBed(scene, width, length, x, y, z) {
    // Bed frame
    const frameGeometry = new THREE.BoxGeometry(length, 0.3, width);
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(x, y + 0.15, z);
    frame.castShadow = true;
    frame.receiveShadow = true;
    scene.add(frame);
    
    // Mattress
    const mattressGeometry = new THREE.BoxGeometry(length - 0.1, 0.2, width - 0.1);
    const mattressMaterial = new THREE.MeshStandardMaterial({ color: 0xEEEEEE });
    const mattress = new THREE.Mesh(mattressGeometry, mattressMaterial);
    mattress.position.set(x, y + 0.4, z);
    mattress.castShadow = true;
    mattress.receiveShadow = true;
    scene.add(mattress);
    
    // Pillow
    const pillowGeometry = new THREE.BoxGeometry(0.4, 0.1, width - 0.3);
    const pillowMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const pillow = new THREE.Mesh(pillowGeometry, pillowMaterial);
    pillow.position.set(x - length/2 + 0.3, y + 0.55, z);
    pillow.castShadow = true;
    scene.add(pillow);
}

// Create a simple desk
function addDesk(scene, width, depth, x, y, z) {
    const deskGeometry = new THREE.BoxGeometry(depth, 0.05, width);
    const deskMaterial = new THREE.MeshStandardMaterial({ color: 0x5D4037 });
    const desk = new THREE.Mesh(deskGeometry, deskMaterial);
    desk.position.set(x, y + 0.7, z);
    desk.castShadow = true;
    desk.receiveShadow = true;
    scene.add(desk);
    
    // Desk legs
    const legGeometry = new THREE.BoxGeometry(0.05, 0.7, 0.05);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x3E2723 });
    
    const positions = [
        [x - depth/2 + 0.025, y + 0.35, z - width/2 + 0.025],
        [x - depth/2 + 0.025, y + 0.35, z + width/2 - 0.025],
        [x + depth/2 - 0.025, y + 0.35, z - width/2 + 0.025],
        [x + depth/2 - 0.025, y + 0.35, z + width/2 - 0.025]
    ];
    
    positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(pos[0], pos[1], pos[2]);
        leg.castShadow = true;
        leg.receiveShadow = true;
        scene.add(leg);
    });
}

// Create a simple wardrobe
function addWardrobe(scene, width, depth, x, y, z) {
    const wardrobeGeometry = new THREE.BoxGeometry(depth, 2, width);
    const wardrobeMaterial = new THREE.MeshStandardMaterial({ color: 0x795548 });
    const wardrobe = new THREE.Mesh(wardrobeGeometry, wardrobeMaterial);
    wardrobe.position.set(x, y + 1, z);
    wardrobe.castShadow = true;
    wardrobe.receiveShadow = true;
    scene.add(wardrobe);
    
    // Door handle
    const handleGeometry = new THREE.SphereGeometry(0.03);
    const handleMaterial = new THREE.MeshStandardMaterial({ color: 0xD4AF37 });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(x - depth/2 - 0.02, y + 1, z - width/4);
    handle.castShadow = true;
    scene.add(handle);
}

// Create a simple sofa
function addSofa(scene, width, depth, x, y, z) {
    // Base
    const baseGeometry = new THREE.BoxGeometry(depth, 0.4, width);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x546E7A });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(x, y + 0.2, z);
    base.castShadow = true;
    base.receiveShadow = true;
    scene.add(base);
    
    // Back
    const backGeometry = new THREE.BoxGeometry(0.2, 0.6, width);
    const backMaterial = new THREE.MeshStandardMaterial({ color: 0x546E7A });
    const back = new THREE.Mesh(backGeometry, backMaterial);
    back.position.set(x - depth/2 + 0.1, y + 0.7, z);
    back.castShadow = true;
    back.receiveShadow = true;
    scene.add(back);
    
    // Arms
    const armGeometry = new THREE.BoxGeometry(depth, 0.6, 0.2);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0x546E7A });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(x, y + 0.5, z - width/2 + 0.1);
    leftArm.castShadow = true;
    leftArm.receiveShadow = true;
    scene.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(x, y + 0.5, z + width/2 - 0.1);
    rightArm.castShadow = true;
    rightArm.receiveShadow = true;
    scene.add(rightArm);
}

// When DOM is loaded, set up our custom functions
document.addEventListener('DOMContentLoaded', () => {
    // Set up custom 3D viewer for rooms
    if (typeof THREE !== 'undefined' && typeof THREE.OrbitControls === 'undefined') {
        // Load OrbitControls if Three.js is available but OrbitControls is not
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';
        document.head.appendChild(script);
        
        script.onload = () => {
            console.log('OrbitControls loaded');
        };
    }
    
    // Initialize room 3D viewer on button click
    window.showRoomModel = function(roomType) {
        const container = document.getElementById('room-3d-container');
        if (container) {
            // Clear any existing content
            container.innerHTML = '';
            
            // Initialize 3D model
            initRoom3DModel(roomType, container);
        }
    };
});

