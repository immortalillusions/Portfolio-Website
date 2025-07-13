import * as THREE from 'three';
import { tileSize } from '../constants.js';

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
    return player;
}

// for moving player - now using actual coordinates
export const position = {
    currentX: 0,
    currentY: 0
}

// movements don't execute immediately; need queue
export const movesQueue = [];

export function queueMove(direction){
    // max length of 1
    if (movesQueue.length < 1) {
        movesQueue.push(direction);
    }
}

// want players to move by tiles / rows instead of pixels
// CHANGE LATER TO PIXELS
export function stepCompleted() {
    const direction = movesQueue.shift();
    if (direction == "forward") position.currentY += tileSize;
    else if (direction == "backward") position.currentY -= tileSize;
    else if (direction == "left") position.currentX -= tileSize;
    else if (direction == "right") position.currentX += tileSize;
}