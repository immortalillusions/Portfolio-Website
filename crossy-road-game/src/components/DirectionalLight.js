import * as THREE from 'three';

export function DirectionalLight() {
    const light = new THREE.DirectionalLight();
    // left back up
    light.position.set(-100, -100, 200); // points at 0,0,0 (which happens to be the player)
    light.up.set(0,0,1); // set z axis as the up axis for the light
    light.castShadow = true; // create shadows
    // resolution / sharpness of the shadow
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    // shadow camera: box as shadow frustrum bc it's orthographic camera
    // bigger than the camera frustrum so all items within camera view should be casting shadows
    light.shadow.camera.up.set(0, 0, 1); // set z axis as the up axis for the shadow camera
    light.shadow.camera.left = -400;
    light.shadow.camera.right = 400;
    light.shadow.camera.top = 400;
    light.shadow.camera.bottom = -400;
    light.shadow.camera.near = 50;
    light.shadow.camera.far = 400;
    return light;
}