import * as THREE from 'three';
import { size } from '../constants.js';
export default function Camera(){
    // Use perspective camera
    const camera = new THREE.PerspectiveCamera(
        50, // field of view in degrees
        window.innerWidth / window.innerHeight, // aspect ratio
        1, // near clipping plane
        2000 // far clipping plane
    );
    
    // set z axis as the axis pointing upwards
    camera.up.set(0,0,1); 
    // Position camera at same initial location with player's position (0, -size, 50)
    camera.position.set(0, -size, 50);
    camera.lookAt(0, 0, 0);
    
    // Add rotation state
    camera.userData = {
        rotationX: Math.atan2(-size, 0), // X=0
        rotationY: Math.atan2(50, Math.sqrt(0*0 + size*size)), // Z=50
        distance: Math.sqrt(0*0 + size*size + 50*50),
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
export function setCameraTarget(camera, x, y, z = 0, smoothing = 0.15) {
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