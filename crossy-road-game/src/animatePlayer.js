import * as THREE from 'three';
import {movesQueue, stepCompleted, position} from "./components/Player.js";
import { tileSize } from "./constants.js";
// do not start clock immediately
// clock is used to animate player movement; it is PER step
const moveClock = new THREE.Clock(false);

// although player moves in discrete steps, this animates that smoothly
export function animatePlayer(player) {
    if (!movesQueue.length) return;
    if (!moveClock.running) moveClock.start();

    const stepTime = 0.2; // seconds per step
    // progress is % completed of the current step
    const progress = Math.min(1, moveClock.getElapsedTime() / stepTime);
    // update player
    setPosition(progress, player);
    setRotation(progress, player);
    // completed step
    if (progress >= 1) {
        stepCompleted();
        moveClock.stop();
    }
}
// use linear interpolation to move / rotate player smoothly depending on the progress
function setPosition(progress, player) {
    const startX = position.currentX;
    const startY = position.currentY;
    // endX, endY tracks the ending position
    let endX = startX;
    let endY = startY;
    if (movesQueue[0] === "forward") {
        endY += tileSize;
    } else if (movesQueue[0] === "backward") {
        endY -= tileSize;
    } else if (movesQueue[0] === "left") {
        endX -= tileSize;
    } else if (movesQueue[0] === "right") {
        endX += tileSize;
    }
    // linear interpolation to determine what the current x position is depending on what the start and end positions are
    // and progress
    player.position.x = THREE.MathUtils.lerp(startX, endX, progress);
    player.position.y = THREE.MathUtils.lerp(startY, endY, progress);
    // add a little jump
    player.position.z = Math.min(10, Math.sin(progress * Math.PI) * 8 + 2); // 10 is the base height
}
function setRotation(progress, player){
    let endRotation = 0;
    if (movesQueue[0] === "left") {
        endRotation = -Math.PI / 2; // rotate left
    } else if (movesQueue[0] === "right") {
        endRotation = Math.PI / 2; // rotate right
    } else if (movesQueue[0] === "backward") {
        endRotation = Math.PI; // rotate 180 degrees
    } else if (movesQueue[0] === "forward") {
        endRotation = 0; // no rotation
    }
    player.rotation.z = THREE.MathUtils.lerp(player.rotation.z, endRotation, progress);
}