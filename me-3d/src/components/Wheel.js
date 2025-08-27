// one long box for both wheels
import * as THREE from 'three';

export function Wheel(x) {
    const wheel = new THREE.Mesh(
        new THREE.BoxGeometry(12, 33, 12),
        new THREE.MeshLambertMaterial({
            color: "black",
            flatShading: true // no lighting, just flat color
        })
    );
    wheel.position.x = x; // position based on x offset
    wheel.position.z = 6; // position above the ground
    return wheel;
}