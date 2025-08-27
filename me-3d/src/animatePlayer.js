import * as THREE from 'three';
import {movesQueue, position, pos, player} from "./components/Player.js";
import { addRows, metadata, otherObjects, countObjectsInMap } from './components/Map.js';
import { endsUpInValidPosition } from './utilities/endsUpInValidPosition.js';
import { tileSize } from './constants.js';

// do not start clock immediately
// clock is used to animate player movement; it is PER step
const moveClock = new THREE.Clock(false);

let score = 0;

let adjustedPosition = { x: position.currentX, y: position.currentY };

const numberObjects = countObjectsInMap(otherObjects); // initial count of objects in the map

// Reset function for game restart
export function resetPlayerState() {
    score = 0;
    moveClock.stop();
    // reset player
    position.currentX = pos[0] * tileSize;
    position.currentY = pos[1] * tileSize;  
    player.position.x = pos[0] * tileSize; 
    player.position.y = pos[1] * tileSize; 
    adjustedPosition = { x: position.currentX, y: position.currentY };
}

// although player moves in discrete steps, this animates that smoothly
export function animatePlayer(player, camera) {
    if (!movesQueue.length) return;
    if (!moveClock.running) {
        moveClock.start();
        // only need to calculate the adjust position at the beginning of the step/move
        adjustedPosition = endsUpInValidPosition(camera);
        // add rows if we're 25 tiles away from end of the map
        if ((metadata.size - numberObjects) * tileSize - adjustedPosition.y < 25 * tileSize) {
            addRows();
        }
    }
    const stepTime = 0.2; // seconds per step
    // progress is % completed of the current step
    const progress = Math.min(1, moveClock.getElapsedTime() / stepTime);

    // update player
    setPosition(progress, player, camera, adjustedPosition.x, adjustedPosition.y);
    setRotation(progress, player, camera);
    // completed step
    if (progress >= 1) {
        //stepCompleted(camera);
        movesQueue.shift();
        // Use the adjusted position (which handles collisions and boundaries)
        position.currentX = adjustedPosition.x;
        position.currentY = adjustedPosition.y;
        moveClock.stop();
        // Update score
        const scoreDOM = document.getElementById("score");
        if (scoreDOM) {
            const oldScore = score;
            score = 1+Math.floor(position.currentY/tileSize)
            if (oldScore < score && score >= 0) {
                scoreDOM.innerText = score.toString();
                scoreDOM.style.fontSize = "40px"; // Set custom font size
            } else {
                score = oldScore;
            }
            
        }
    }
}

// use linear interpolation to move / rotate player smoothly depending on the progress
function setPosition(progress, player, camera, adjustedX, adjustedY) {
    const startX = position.currentX;
    const startY = position.currentY;
    
    // Use the collision-adjusted position as the actual end point
    const finalEndX = adjustedX;
    const finalEndY = adjustedY;
    
    // Smooth interpolation from start to collision-adjusted end position
    player.position.x = THREE.MathUtils.lerp(startX, finalEndX, progress);
    player.position.y = THREE.MathUtils.lerp(startY, finalEndY, progress);
    
    // add a little jump only if there's actual movement
    const isMoving = Math.abs(finalEndX - startX) > 1 || Math.abs(finalEndY - startY) > 1;
    if (isMoving) {
        player.position.z = Math.sin(progress * Math.PI) * 8 + 2;
    } else {
        player.position.z = 2; // Stay on ground if not moving
    }
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
        endRotation = cameraRotation + Math.PI / 2; // rotate left relative to camera
    } else if (movesQueue[0] === "right") {
        endRotation = cameraRotation - Math.PI / 2; // rotate right relative to camera
    } else if (movesQueue[0] === "backward") {
        endRotation = cameraRotation + Math.PI; // rotate 180 degrees relative to camera
    } else if (movesQueue[0] === "forward") {
        endRotation = cameraRotation; // face camera direction
    }
    
    player.rotation.z = THREE.MathUtils.lerp(player.rotation.z, endRotation, progress);
}