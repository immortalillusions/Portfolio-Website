import * as THREE from 'three';

// I use pointlight instead of directional light bc i want the shadow direction / shape to change depending
// on the object's relative position to the light source
// directional light just calculates one angle and applies it to all objects
// spot light is like point light but beyond its cone it doesn't cast shadows
export function PointLight() {
    
    const light = new THREE.PointLight(0xffffff, 1); 

    light.distance = 0;
    light.decay = 0;
    
    light.position.set(-250, -2050, 800);
    light.up.set(0, 0, 1);
    light.castShadow = true;

    // Higher resolution for better shadow quality
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    
    // Center the shadow camera over the map area
    light.shadow.camera.up.set(0, 0, 1);
    light.shadow.camera.near = 200;
    light.shadow.camera.far = 2250; // no more shadow once we get to the crossy game

    light.shadow.camera.top = 0; // Stop at Y = 0, no shadows beyond this line

    // Create helpers but don't add them to the light
    const helper = new THREE.CameraHelper(light.shadow.camera);
    const helper2 = new THREE.PointLightHelper(light, 50); // Made larger for visibility
    
    // Store helpers on the light object so they can be added to scene later
    light.helpers = {
        shadowCamera: helper,
        direction: helper2
    };

    return light;
}