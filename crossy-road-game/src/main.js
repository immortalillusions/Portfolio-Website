import * as THREE from 'three';
import './style.css'
import Renderer from "./components/Renderer.js";
import Camera from "./components/Camera.js";
import {player} from "./components/Player.js";
import {map, initializeMap, metadata} from "./components/Map.js";
import { DirectionalLight } from './components/DirectionalLight.js';
import { animateVehicles } from './animateVehicles.js';
import { animatePlayer } from './animatePlayer.js';
import { CameraControls } from './components/CameraControls.js';
import './collectUserInput.js'; 
import { setCameraTarget } from "./components/Camera.js";
import { position } from "./components/Player.js";
import { animatePokeball } from './components/Pokeball.js';
import { size } from './constants.js';

const scene = new THREE.Scene();
scene.add(player);
scene.add(map);

// lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // soft white light
scene.add(ambientLight);

const directionalLight = new DirectionalLight(); // white light
// by default, the directional light points at 0,0,0
scene.add(directionalLight);

const camera = Camera();
const renderer = Renderer();

// Initialize camera controls
const cameraControls = new CameraControls(camera, renderer.domElement);

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
  
  // Update camera frustum for orthographic camera
  const viewRatio = width / height;
  const frustumWidth = viewRatio < 1 ? size : size * viewRatio;
  const frustumHeight = viewRatio < 1 ? size / viewRatio : size;
  
  camera.left = -frustumWidth / 2;
  camera.right = frustumWidth / 2;
  camera.top = frustumHeight / 2;
  camera.bottom = -frustumHeight / 2;
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

