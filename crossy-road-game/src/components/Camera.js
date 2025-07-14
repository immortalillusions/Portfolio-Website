import * as THREE from 'three';
import { size } from '../constants.js';
export default function Camera(){
    const viewRatio = window.innerWidth / window.innerHeight;
    // if width is smaller, width of frustrum = 300 units
    // if height is smaller, height of frustrum = 300 units
    const width = viewRatio < 1 ? size : size * viewRatio;
    const height = viewRatio < 1 ? size / viewRatio : size;
    // use orthographic camera for 2D view (instead of perspective camera) -- like a video game
    const camera = new THREE.OrthographicCamera(
        // frustrum: box that defines what we can see
        -width / 2, // left vertex
        width / 2, // right
        height / 2, // top
        -height / 2, // bottom
        100, // near
        900 // far
    );
    // set z axis as the axis pointing upwards
    camera.up.set(0,0,1); 
    // 250 right, 250 behind, 250 above ground
    // this (and lookAt) causes camera to be at a 45 degree angle
    camera.position.set(size, -size, size);
    camera.lookAt(0, 0, 0);
    
    // Add rotation state
    camera.userData = {
        rotationX: Math.atan2(-size, size), // Initial angle around Z axis
        rotationY: Math.atan2(size, Math.sqrt(size*size + size*size)), // Initial elevation
        distance: Math.sqrt(size*size + size*size + size*size), // Distance from origin
        target: new THREE.Vector3(0, 0, 0)
    };
    
    return camera;
}

// Function to update camera position based on rotation angles
export function updateCameraPosition(camera) {
    const { rotationX, rotationY, distance, target } = camera.userData;
    
    // Convert spherical coordinates to cartesian, centered on target
    const x = target.x + distance * Math.cos(rotationY) * Math.cos(rotationX);
    const y = target.y + distance * Math.cos(rotationY) * Math.sin(rotationX);
    const z = target.z + distance * Math.sin(rotationY);
    
    camera.position.set(x, y, z);
    camera.lookAt(target);
}

// Function to set camera target (player position) with smooth interpolation
export function setCameraTarget(camera, x, y, z = 0, smoothing = 0.05) {
    const target = camera.userData.target;
    
    // Smoothly interpolate to new target position
    target.x += (x - target.x) * smoothing;
    target.y += (y - target.y) * smoothing;
    target.z += (z - target.z) * smoothing;
    
    updateCameraPosition(camera);
}

// Alternative: Set camera target immediately (no smoothing)
export function setCameraTargetImmediate(camera, x, y, z = 0) {
    camera.userData.target.set(x, y, z);
    updateCameraPosition(camera);
}