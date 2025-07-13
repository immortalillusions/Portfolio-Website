import * as THREE from 'three';

export default function Camera(){
    const size = 300;
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
    // 300 right, 300 behind, 300 above ground
    // this (and lookAt) causes camera to be at a 45 degree angle
    camera.position.set(300, -300, 300);
    camera.lookAt(0, 0, 0);
    return camera;
}