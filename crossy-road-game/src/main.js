import * as THREE from 'three';
import './style.css'
import Renderer from "./components/Renderer.js";
import Camera from "./components/Camera.js";
import Player from "./components/Player.js";
import {map, initializeMap} from "./components/Map.js";
import { DirectionalLight } from './components/DirectionalLight.js';
const scene = new THREE.Scene();
const player = Player();
scene.add(player);
scene.add(map);
// lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // soft white light
scene.add(ambientLight);

const directionalLight = new DirectionalLight(); // white light
// by default, the directional light points at 0,0,0
scene.add(directionalLight);

const camera = Camera();
scene.add(camera);
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
  const size = 300;
  const viewRatio = width / height;
  const frustumWidth = viewRatio < 1 ? size : size * viewRatio;
  const frustumHeight = viewRatio < 1 ? size / viewRatio : size;
  
  camera.left = -frustumWidth / 2;
  camera.right = frustumWidth / 2;
  camera.top = frustumHeight / 2;
  camera.bottom = -frustumHeight / 2;
  camera.updateProjectionMatrix();
});

const renderer = Renderer();

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();