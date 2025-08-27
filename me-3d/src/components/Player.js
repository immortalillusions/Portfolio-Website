import * as THREE from 'three';
import { tileSize } from '../constants.js';
import { endsUpInValidPosition } from '../utilities/endsUpInValidPosition.js';

export const pos = [0,-26];

export const player = Player();

function Player() {
    const player = new THREE.Group();
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(15, 15, 20), // width, length, depth/height
        new THREE.MeshLambertMaterial({ // lambert responds to light
             color: "white",
             flatShading: true // no lighting, just flat color
        }) 
    );
    // position of its center; this way its bottom is touching 0; height is 20
    body.position.z = 10;
    body.castShadow = true;
    body.receiveShadow = true;
    player.add(body);
    const cap = new THREE.Mesh(
        new THREE.BoxGeometry(2, 4, 2), // width, length, depth/height
        new THREE.MeshLambertMaterial({
            color: "black",
            flatShading: true
        })
    );
    // body height is 20 so if cap is 2, its center is at 21
    cap.position.z = 21;
    cap.castShadow = true;
    cap.receiveShadow = true;
    player.add(cap);
    
    // Add black round eyes
    const leftEye = new THREE.Mesh(
        new THREE.SphereGeometry(1.5, 8, 8), // radius, widthSegments, heightSegments
        new THREE.MeshLambertMaterial({
            color: "black",
            flatShading: true
        })
    );
    leftEye.position.set(-3, 7, 16); // left side, forward, on the body
    leftEye.castShadow = true;
    player.add(leftEye);
    
    const rightEye = new THREE.Mesh(
        new THREE.SphereGeometry(1.5, 8, 8),
        new THREE.MeshLambertMaterial({
            color: "black",
            flatShading: true
        })
    );
    rightEye.position.set(3, 7, 16); // right side, forward, on the body
    rightEye.castShadow = true;
    player.add(rightEye);
    
    // Add curved mouth - single arc forming a smile
    const mouthMaterial = new THREE.MeshLambertMaterial({
        color: "black",
        flatShading: true
    });
    
    const mouth = new THREE.Mesh(
        new THREE.TorusGeometry(2, 0.3, 8, 16, Math.PI), // radius, tube, radialSegments, tubularSegments, arc
        mouthMaterial
    );
    mouth.position.set(0, 7.5, 12); // centered, forward, on the body
    mouth.rotation.x = -Math.PI/2; // Flip upside down to make it a smile
    mouth.castShadow = true;
    player.add(mouth);
    
    // Add dragon spikes along the back
    const spikeGeometry = new THREE.ConeGeometry(2, 4, 3); // radius, height, radialSegments (3 = triangle)
    const spikeMaterial = new THREE.MeshLambertMaterial({
        color: "black",
        flatShading: true
    });
    
    // Create multiple spikes along the back
    const spikes = [
        { x: 0, y: -9, z: 16 }, // center back, top
        { x: 0, y: -9, z: 11 }, // center back, middle
        { x: 0, y: -9, z: 6 }, // center back, lower
    ];
    
    spikes.forEach(pos => {
        const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
        spike.position.set(pos.x, pos.y, pos.z);
        spike.rotation.x = Math.PI; // Point downward
        spike.castShadow = true;
        player.add(spike);
    });
    
    player.position.x = pos[0] * tileSize; 
    player.position.y = pos[1] * tileSize;
    return player;
}

// for moving player - now using actual coordinates
export const position = {
    currentX: pos[0] * tileSize,
    currentY: pos[1] * tileSize
}

// movements don't execute immediately; need queue
export const movesQueue = [];

export function queueMove(direction){
    // max length of 1
    if (movesQueue.length < 1) {
        movesQueue.push(direction);
    }
}