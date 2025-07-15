import * as THREE from 'three';
import './style.css'
import Renderer from "./components/Renderer.js";
import Camera from "./components/Camera.js";
import {player} from "./components/Player.js";
import {map, initializeMap, metadata} from "./components/Map.js";
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

const scene = new THREE.Scene();
scene.add(player);
scene.add(map);

// lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // soft white light
scene.add(ambientLight);

const pointLight = new PointLight(); // white light
scene.add(pointLight);

// Add helpers to scene (not to light) for correct positioning
if (pointLight.helpers) {
    scene.add(pointLight.helpers.shadowCamera);
    scene.add(pointLight.helpers.direction);
}

const camera = Camera();
const renderer = Renderer();

// Initialize camera controls
const cameraControls = new CameraControls(camera, renderer.domElement);

// Initialize click handler for 3D objects
const clickHandler = new ClickHandler(camera, scene, renderer);

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
    
    // Animate Pokeballs in cards
    metadata.forEach(row => {
        if (row.type === "card" && row.card.icon) {
            animatePokeball(row.card.icon);
        }
    });
    
    // Update camera to follow player with improved smoothing
    // Use a slightly higher value for more responsive but still smooth following
    setCameraTarget(camera, position.currentX, position.currentY, 0, 0.06);
    
    renderer.render(scene, camera);
}

