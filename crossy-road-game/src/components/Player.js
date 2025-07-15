import * as THREE from 'three';
import { tileSize } from '../constants.js';
import { endsUpInValidPosition } from '../utilities/endsUpInValidPosition.js';

const pos = [0,-45];

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