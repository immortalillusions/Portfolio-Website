import * as THREE from 'three';
import {movesQueue, stepCompleted, position} from "./components/Player.js";
import { tileSize } from "./constants.js";
import { endsUpInValidPosition } from './utilities/endsUpInValidPosition.js';
// do not start clock immediately
// clock is used to animate player movement; it is PER step
const moveClock = new THREE.Clock(false);

// although player moves in discrete steps, this animates that smoothly
export function animatePlayer(player, camera) {
    if (!movesQueue.length) return;
    if (!moveClock.running) moveClock.start();

    const stepTime = 0.2; // seconds per step
    // progress is % completed of the current step
    const progress = Math.min(1, moveClock.getElapsedTime() / stepTime);

    if (!endsUpInValidPosition(camera)) {
        movesQueue.length = 0; // Clear the array without reassigning
        moveClock.stop();
        return;
    }

    // update player
    setPosition(progress, player, camera);
    setRotation(progress, player, camera);
    // completed step
    if (progress >= 1) {
        stepCompleted(camera);
        moveClock.stop();
    }
}

// use linear interpolation to move / rotate player smoothly depending on the progress
function setPosition(progress, player, camera) {
    const startX = position.currentX;
    const startY = position.currentY;
    
    // Calculate camera's view direction from its actual position (match Player.js)
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
    
    let endX = startX;
    let endY = startY;
    
    if (movesQueue[0] === "forward") {
        endX += forward.x * tileSize;
        endY += forward.y * tileSize;
    } else if (movesQueue[0] === "backward") {
        endX -= forward.x * tileSize;
        endY -= forward.y * tileSize;
    } else if (movesQueue[0] === "left") {
        endX -= right.x * tileSize;
        endY -= right.y * tileSize;
    } else if (movesQueue[0] === "right") {
        endX += right.x * tileSize;
        endY += right.y * tileSize;
    }
    
    // linear interpolation to determine what the current x position is depending on what the start and end positions are
    // and progress
    player.position.x = THREE.MathUtils.lerp(startX, endX, progress);
    player.position.y = THREE.MathUtils.lerp(startY, endY, progress);
    // add a little jump
    player.position.z = Math.min(10, Math.sin(progress * Math.PI) * 8 + 2); // 10 is the base height
}

function setRotation(progress, player, camera){
    // Calculate rotation based on camera's actual viewing direction
    const target = camera.userData.target;
    const cameraPos = camera.position;
    
    // Camera forward direction (bc camera will be looking at the player)
    const forward = {
        x: target.x - cameraPos.x,
        y: target.y - cameraPos.y
    };
    
    const cameraRotation = Math.atan2(forward.y, forward.x) - Math.PI/2; // Adjust for coordinate system
    let endRotation = cameraRotation;
    
    if (movesQueue[0] === "left") {
        endRotation = cameraRotation - Math.PI / 2; // rotate left relative to camera
    } else if (movesQueue[0] === "right") {
        endRotation = cameraRotation + Math.PI / 2; // rotate right relative to camera
    } else if (movesQueue[0] === "backward") {
        endRotation = cameraRotation + Math.PI; // rotate 180 degrees relative to camera
    } else if (movesQueue[0] === "forward") {
        endRotation = cameraRotation; // face camera direction
    }
    
    player.rotation.z = THREE.MathUtils.lerp(player.rotation.z, endRotation, progress);
}