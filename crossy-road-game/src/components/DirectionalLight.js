import * as THREE from 'three';

export function DirectionalLight() {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(100, 100, 100); // Position the light above the player
    light.castShadow = true; // Enable shadows

    // Set shadow properties
    light.shadow.mapSize.width = 1024; // Shadow map resolution
    light.shadow.mapSize.height = 1024;
    light.shadow.camera.near = 0.5; // Near plane for shadow camera
    light.shadow.camera.far = 2000; // Far plane for shadow camera

    // need to increase shadow bounds because default for orthographic camera is small (vs perspective like pointlight)
    const shadowSize = 800; 
    light.shadow.camera.left = -shadowSize;
    light.shadow.camera.right = shadowSize;
    light.shadow.camera.top = shadowSize;
    light.shadow.camera.bottom = -shadowSize;



    const helper = new THREE.DirectionalLightHelper(light, 5); // Helper for visualizing light direction
    light.helper = helper;

    return light;
}