import * as THREE from 'three';
import { setShadowsRecursively } from '../constants';
export function Pokeball() {
    const ballTexture = new THREE.TextureLoader().load('/pokeball.jpeg'); // load pokeball texture
    const ball = new THREE.Mesh(
    new THREE.SphereGeometry(25, 24, 24), // create sphere geometry
    new THREE.MeshStandardMaterial({ map: ballTexture }) // create material with texture
    );
    setShadowsRecursively(ball, true, true); // enable shadows for the ball
    ball.position.set(0, 0, 50); // set position of the ball
    
    // Set fixed rotation for the ball
    ball.rotation.x = Math.PI/2; // 30 degrees tilt
    ball.rotation.y = 3*Math.PI/2; // 45 degrees rotation
    ball.rotation.z = 0;
    
    // Add bobbing properties for animation
    ball.userData = {
        baseZ: 40, // base height position
        bobSpeed: 0.02, // speed of bobbing motion
        bobHeight: 3, // how high/low it bobs
        time: 0 // time tracker for sine wave
    };
    
    return ball;
}

// Function to animate the pokeball bobbing
export function animatePokeball(pokeball) {
    if (pokeball && pokeball.userData.bobSpeed) {
        pokeball.userData.time += pokeball.userData.bobSpeed;
        
        // Use sine wave for smooth up and down motion
        const bobOffset = Math.sin(pokeball.userData.time) * pokeball.userData.bobHeight;
        pokeball.position.z = pokeball.userData.baseZ + bobOffset;
    }
}