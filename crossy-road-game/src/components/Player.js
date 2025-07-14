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
// In stepCompleted() - updates the logical grid position
// vs in setPosition() - updates the visual 3D position
export function stepCompleted(camera = null) {
    const direction = movesQueue.shift();
    
    if (!camera) {
        // Fallback to world-relative movement if no camera provided
        if (direction == "forward") position.currentY += tileSize;
        else if (direction == "backward") position.currentY -= tileSize;
        else if (direction == "left") position.currentX -= tileSize;
        else if (direction == "right") position.currentX += tileSize;
        return;
    }
    
    // Calculate camera's view direction from its actual position
    const target = camera.userData.target;
    const cameraPos = camera.position;
    
    // Camera forward direction (from camera to target)
    const forward = {
        x: target.x - cameraPos.x,
        y: target.y - cameraPos.y
    };
    
    // Normalize the forward vector
    const forwardLength = Math.sqrt(forward.x * forward.x + forward.y * forward.y);
    forward.x /= forwardLength;
    forward.y /= forwardLength;
    
    // Right direction (perpendicular to forward)
    const right = {
        x: forward.y,  // 90 degree rotation
        y: -forward.x
    };
    
    let deltaX = 0;
    let deltaY = 0;
    
    if (direction == "forward") {
        deltaX = forward.x * tileSize;
        deltaY = forward.y * tileSize;
    } else if (direction == "backward") {
        deltaX = -forward.x * tileSize;
        deltaY = -forward.y * tileSize;
    } else if (direction == "left") {
        deltaX = -right.x * tileSize;
        deltaY = -right.y * tileSize;
    } else if (direction == "right") {
        deltaX = right.x * tileSize;
        deltaY = right.y * tileSize;
    }
    
    position.currentX += deltaX;
    position.currentY += deltaY;
}