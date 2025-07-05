import * as THREE from 'three';

export default function Player() {
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(15, 15, 20), // width, length, depth/height
        new THREE.MeshLambertMaterial({ // lambert responds to light
             color: "white",
             flatShading: true // no lighting, just flat color
        }) 
    );
    // position of its center; this way its bottom is touching 0
    body.position.z = 10;
    body.castShadow = true;
    body.receiveShadow = true;
    return body;
}