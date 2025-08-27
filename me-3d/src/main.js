import * as THREE from 'three';
import './style.css'
import Renderer from "./components/Renderer.js";
import Camera from "./components/Camera.js";
import {player, position, pos} from "./components/Player.js";
import {map, initializeMap, otherObjects, modelMixers} from "./components/Map.js";
import { PointLight } from './components/PointLight.js';
import { animateVehicles } from './animateVehicles.js';
import { animatePlayer, resetPlayerState } from './animatePlayer.js';
import { CameraControls } from './components/CameraControls.js';
import './collectUserInput.js'; 
import { setCameraTarget } from "./components/Camera.js";
import { animatePokeball } from './components/Pokeball.js';
import { animateModelIcon } from './components/ModelIcon.js';
import { tileSize } from './constants.js';
import { ClickHandler } from './components/ClickHandler.js';
import { DirectionalLight } from './components/DirectionalLight.js';
import {hitVehicle} from "./utilities/hitVehicle.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { LoadingManager } from './utilities/LoadingManager.js';

// Initialize loading manager
const loadingManager = new LoadingManager();

// Global variables that need to be accessible
let scene, camera, renderer, cameraControls, clickHandler;
let resultDOM, scoreDOM, greetingElement;
let ambientLight, pointLight, directionalLight;
let clock;
let backgroundMusic; // Add audio variable

// Wait for loading to complete, then start the game
window.addEventListener('loadingComplete', startGame);

// Cleanup function to prevent memory leaks
function cleanup() {
    if (renderer) {
        renderer.setAnimationLoop(null);
        renderer.dispose();
    }
    if (scene) {
        scene.clear();
    }
}

// Handle page unload to cleanup WebGL context
window.addEventListener('beforeunload', cleanup);

// startGame();

function startGame() {
scene = new THREE.Scene();
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
ambientLight = new THREE.AmbientLight(0xffffff, 1); // soft white light
scene.add(ambientLight);

pointLight = new PointLight(); // white light
scene.add(pointLight);

// Add helpers to scene (not to light) for correct positioning
// if (pointLight.helpers) {
//     scene.add(pointLight.helpers.shadowCamera);
//     scene.add(pointLight.helpers.direction);
// }

directionalLight = DirectionalLight(); // directional light for shadows
scene.add(directionalLight); 
const lightOffset = { x: 100, y: 100, z: 100 }; // Same offset as in DirectionalLight.js

directionalLight.target = player; // Set light target to player for dynamic shadows
scene.add(directionalLight.target);  // required to add the target to scene (even though player is already added)
// scene.add(directionalLight.helper); // Add helper to visualize light direction

camera = Camera();
renderer = Renderer();

// Initialize camera controls
cameraControls = new CameraControls(camera, renderer.domElement);

// Initialize click handler for 3D objects
clickHandler = new ClickHandler(camera, scene, renderer, ambientLight);

resultDOM = document.getElementById("result-container")
scoreDOM = document.getElementById("score");
greetingElement = document.querySelector("#greeting");

// Clock for GLTF animations
clock = new THREE.Clock();

// Initialize background music
backgroundMusic = new Audio('./music.mp3');
backgroundMusic.loop = true; // Enable looping

document.querySelector("#retry")?.addEventListener("click", initializeGame);
document.querySelector("#greeting")?.addEventListener("click", () => {    
    if (greetingElement) {
        if (greetingElement.innerText === ">") {
            greetingElement.innerHTML = "Hi! I'm Joanna,<br>Welcome to my site!<br><br>Credits: Hunor Márton Borbély (Idea), Sketchfab (Models), Unity (Skybox), Suno (Music)";
            greetingElement.className = "expanded";
        } else {
            greetingElement.innerText = ">";
            greetingElement.className = "collapsed";
        }
    }
});

// Skybox toggle button event listener
document.querySelector("#skybox-toggle")?.addEventListener("click", () => {
    if (clickHandler) {
        clickHandler.toggleSkybox();
    }
});

// Audio toggle button event listener
document.querySelector("#audio-toggle")?.addEventListener("click", () => {
    const button = document.querySelector("#audio-toggle");
    const emojiSpan = button?.querySelector(".emoji-center");
    
    if (emojiSpan && backgroundMusic) {
        if (emojiSpan.textContent === '⦸') {
            // Mute/pause the music
            backgroundMusic.pause();
            emojiSpan.textContent = '♪'; // Muted
        } else {
            // Play/unmute the music
            backgroundMusic.play().catch(error => {
                console.error('Error playing audio:', error);
                // Some browsers require user interaction before playing audio
            });
            emojiSpan.textContent = '⦸'; // Playing
        }
    }
});

// call before rendering or else empty map
initializeGame();

function initializeGame() {
    // Reset player state first
    resetPlayerState();
    
    initializeMap();
    if (scoreDOM) {
        scoreDOM.innerText = "Can you find the game?";
        scoreDOM.style.fontSize = "16px";
    }
    if (resultDOM) {
        resultDOM.classList.add("hidden");
    } 
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
    const delta = clock.getDelta();
    
    if(resultDOM.classList.contains("hidden")){
        animateVehicles();
        animatePlayer(player, camera); // Pass camera to player animation
        if(position.currentY >= 0){
            hitVehicle();
        }
    }

    // Update GLTF model animations (all models)
    if (modelMixers.length > 0) {
        modelMixers.forEach(mixer => {
            mixer.update(delta);
        });
    }

    // Update directional light position to follow player
    directionalLight.position.set(
        player.position.x + lightOffset.x,
        player.position.y + lightOffset.y,
        player.position.z + lightOffset.z 
    );

    // Toggle directional light based on player Y position (efficient method)
    // row 0 (which is 42 units wide)
    if (position.currentY >= -20) {
        directionalLight.intensity = 1;
        if (scoreDOM && scoreDOM.innerText === "Can you find the game?"){
            scoreDOM.innerText = "You found it!"
        }
    } else {
        directionalLight.intensity = 0.01; // Keep very low instead of 0
        // this is to prevent lag, since if i turn it ON suddenly, it'll have to calculate all the shadows (= lag)
    }

    // Animate Pokeballs and Model Icons in cards
    for (const [y, objectsAtY] of otherObjects) {
        for (const row of objectsAtY) {
            if (row.type === "card" && row.card.icon) {
                // Check if it's a pokeball or model icon
                if (row.card.icon.userData && row.card.icon.userData.bobSpeed) {
                    if (row.card.icon.userData.isLoaded !== undefined) {
                        // It's a model icon
                        animateModelIcon(row.card.icon);
                    } else {
                        // It's a pokeball
                        animatePokeball(row.card.icon);
                    }
                }
            }
        }
    }
    
    // Update camera to follow player with improved smoothing
    // Use a slightly higher value for more responsive but still smooth following
    setCameraTarget(camera, position.currentX, position.currentY, 0, 0.06);
    
    renderer.render(scene, camera);
}

} // End of startGame function

// The loading manager will now handle initialization through the start button

