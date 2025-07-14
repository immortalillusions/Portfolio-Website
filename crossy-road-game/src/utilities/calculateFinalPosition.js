import { tileSize } from '../constants.js';
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
            finalY += tileSize;
        } else if (direction === "backward") {
            finalY -= tileSize;
        } else if (direction === "left") {
            finalX -= tileSize;
        } else if (direction === "right") {
            finalX += tileSize;
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
            finalX += forward.x * tileSize;
            finalY += forward.y * tileSize;
        } else if (direction === "backward") {
            finalX -= forward.x * tileSize;
            finalY -= forward.y * tileSize;
        } else if (direction === "left") {
            finalX -= right.x * tileSize;
            finalY -= right.y * tileSize;
        } else if (direction === "right") {
            finalX += right.x * tileSize;
            finalY += right.y * tileSize;
        }
    }
    
    return { x: finalX, y: finalY };
}