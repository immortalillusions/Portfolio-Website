import * as THREE from 'three';
import './style.css'
import Renderer from "./components/Renderer.js";
import Camera from "./components/Camera.js";
import {player} from "./components/Player.js";
import {map, initializeMap, otherObjects} from "./components/Map.js";
import { PointLight } from './components/PointLight.js';
import { animateVehicles } from './animateVehicles.js';
import { animatePlayer } from './animatePlayer.js';
import { CameraControls } from './components/CameraControls.js';
import './collectUserInput.js'; 
import { setCameraTarget } from "./components/Camera.js";
import { position } from "./components/Player.js";
import { animatePokeball } from './components/Pokeball.js';
import { size } from './constants.js';
import { ClickHandler } from './components/ClickHandler.js';
import { DirectionalLight } from './components/DirectionalLight.js';

const scene = new THREE.Scene();
scene.add(player);
scene.add(map);

// Set skybox as scene background using CubeTextureLoader
const loader = new THREE.CubeTextureLoader();
loader.load([
    './Day_Left.png',   // positive X (right)
    './Day_Right.png',    // negative X (left)
    './Day_Front.png',     // positive Y (top)
    './Day_Back.png',  // negative Y (bottom)
    './Day_Top.png',   // positive Z (front)
    './Day_Bottom.png'     // negative Z (back)
], function(texture) {
    scene.background = texture;
});


    // './clouds1/clouds1_east.bmp',   // positive X
    // './clouds1/clouds1_west.bmp',   // negative X  
    // './clouds1/clouds1_up.bmp',     // positive Y
    // './clouds1/clouds1_down.bmp',   // negative Y
    // './clouds1/clouds1_north.bmp',  // positive Z
    // './clouds1/clouds1_south.bmp'   // negative Z
// lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // soft white light
scene.add(ambientLight);

const pointLight = new PointLight(); // white light
scene.add(pointLight);

// Add helpers to scene (not to light) for correct positioning
if (pointLight.helpers) {
    scene.add(pointLight.helpers.shadowCamera);
    scene.add(pointLight.helpers.direction);
}

const directionalLight = DirectionalLight(); // directional light for shadows
scene.add(directionalLight); 
const lightOffset = { x: 100, y: 100, z: 100 }; // Same offset as in DirectionalLight.js

directionalLight.target = player; // Set light target to player for dynamic shadows
scene.add(directionalLight.target);  // required to add the target to scene (even though player is already added)
scene.add(directionalLight.helper); // Add helper to visualize light direction

const camera = Camera();
const renderer = Renderer();

// Initialize camera controls
const cameraControls = new CameraControls(camera, renderer.domElement);

// Initialize click handler for 3D objects
const clickHandler = new ClickHandler(camera, scene, renderer, ambientLight);

// call before rendering or else empty map
initializeGame();

function initializeGame() {
    initializeMap();
}

// Handle window resize
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  
  // Update camera aspect ratio for perspective camera
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

renderer.setAnimationLoop(animate);

// Animation loop
function animate() {
    animateVehicles();
    animatePlayer(player, camera); // Pass camera to player animation
    
    // Update directional light position to follow player
    directionalLight.position.set(
        player.position.x + lightOffset.x,
        player.position.y + lightOffset.y,
        player.position.z + lightOffset.z 
    );

    // Toggle directional light based on player Y position (efficient method)
    if (position.currentY >= -20) {
        directionalLight.intensity = 1;
        directionalLight.castShadow = true;
    } else {
        directionalLight.intensity = 0;
        directionalLight.castShadow = false;
    }

    // Animate Pokeballs in cards
    for (const [y, objectsAtY] of otherObjects) {
        for (const row of objectsAtY) {
            if (row.type === "card" && row.card.icon) {
                animatePokeball(row.card.icon);
            }
        }
    }
    
    // Update camera to follow player with improved smoothing
    // Use a slightly higher value for more responsive but still smooth following
    setCameraTarget(camera, position.currentX, position.currentY, 0, 0.06);
    
    renderer.render(scene, camera);
}

