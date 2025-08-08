import * as THREE from 'three';
import { setShadowsRecursively } from '../constants';

export function ModelIcon(gloader, path, baseHeight, scale = 10, rx = 0, ry = 0, rz = 0) {
    // Create a group to hold the model (similar to how you handle other objects)
    const modelGroup = new THREE.Group();
    
    // Add loading properties for animation (similar to pokeball)
    modelGroup.userData = {
        baseZ: baseHeight, // base height position
        bobSpeed: 0.02,
        bobHeight: 2, // smaller bobbing for models
        time: 0,
        isLoaded: false
    };
    
    // Load the model asynchronously
    gloader.load(
        path,
        function(gltf) {
            const model = gltf.scene;
            
            // Set scale and rotation
            model.scale.set(scale, scale, scale);
            model.rotation.x = rx;
            model.rotation.y = ry;
            model.rotation.z = rz;
            
            // Enable shadows
            setShadowsRecursively(model, true, true);
            
            // Position the model
            model.position.set(0, 0, 0);
            
            // Add model to the group
            modelGroup.add(model);
            
            // Mark as loaded for animation
            modelGroup.userData.isLoaded = true;
            
            // Store reference to the actual model for easy access
            modelGroup.userData.model = model;
            
        },
        // Progress callback
        function(progress) {
            // Optional: handle loading progress
            // console.log('Model loading progress:', (progress.loaded / progress.total * 100) + '%');
        },
        // Error callback
        function(error) {
            console.error('Error loading model:', path, error);
        }
    );
    
    return modelGroup;
}

// Function to animate the model icon (similar to animatePokeball)
export function animateModelIcon(modelIcon) {
    if (modelIcon && modelIcon.userData.bobSpeed && modelIcon.userData.isLoaded) {
        modelIcon.userData.time += modelIcon.userData.bobSpeed;
        
        // Use sine wave for smooth up and down motion
        const bobOffset = Math.sin(modelIcon.userData.time) * modelIcon.userData.bobHeight;
        modelIcon.position.z = modelIcon.userData.baseZ + bobOffset;
    }
}
