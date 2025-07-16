import { playerStep } from '../constants.js';
import { movesQueue, position } from '../components/Player.js';

export function calculateFinalPosition(camera = null) {
    // Start with current position
    let finalX = position.currentX;
    let finalY = position.currentY;
    
    // Check if there's actually a move queued
    if (movesQueue.length === 0) {
        return { x: finalX, y: finalY };
    }
    
    const direction = movesQueue[0]; // Get the next move
    
    if (!camera) {
        // Simple world movement
        if (direction === "forward") {
            finalY += playerStep;
        } else if (direction === "backward") {
            finalY -= playerStep;
        } else if (direction === "left") {
            finalX -= playerStep;
        } else if (direction === "right") {
            finalX += playerStep;
        }
    } else {
        // Camera-relative movement (same as Player.js)
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
        
        if (direction === "forward") {
            finalX += forward.x * playerStep;
            finalY += forward.y * playerStep;
        } else if (direction === "backward") {
            finalX -= forward.x * playerStep;
            finalY -= forward.y * playerStep;
        } else if (direction === "left") {
            finalX -= right.x * playerStep;
            finalY -= right.y * playerStep;
        } else if (direction === "right") {
            finalX += right.x * playerStep;
            finalY += right.y * playerStep;
        }
    }
    
    return { x: finalX, y: finalY };
}