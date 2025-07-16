import { calculateFinalPosition } from "./calculateFinalPosition.js";
import { tileSize, minTileIndex, maxTileIndex, bottomMap } from "../constants.js";
import { metadata } from "../components/Map.js";
import { position } from '../components/Player.js';
import { treeBoundSize } from "../constants.js";

// CONVERT METADATA TO MAP FOR THE FUNCTION ENDSUPINVALIDPOSITION
// SO WE ONLY HAVE TO CHECK ROWS WITH THE SAME INDEX
// AND NOT ITERATE THROUGH ALL ROWS WHICH CAN GROW A LOT IF USER PLAYS FOR A LONG TIME

export function endsUpInValidPosition(camera) {
    const finalPosition = calculateFinalPosition(camera);

    const [startX, startY] = [position.currentX, position.currentY];

    let y = finalPosition.y;
    let x = finalPosition.x;
 //   console.log("Current position:", { x: startX, y: startY });
 //   console.log("Final position before collision:", finalPosition);

    // detect if we hit the edge of the board
    if (finalPosition.x <= minTileIndex * tileSize) {
        x = minTileIndex * tileSize; // Snap to edge
    } else if (finalPosition.x >= maxTileIndex * tileSize) {
        x = maxTileIndex * tileSize; // Snap to edge
    }
    // may need to edit the upper bound of board if we want it to expand infinitely
    if (finalPosition.y <= (bottomMap+1) * tileSize) {
        y = (bottomMap+1) * tileSize; // Snap to edge
    }
    // no upper bound because expands infinitely
    // } else if (finalPosition.y >= (rows.length-1) * tileSize) {
    //     y = (rows.length-1) * tileSize; // Snap to edge
    // }


    // HIT BOUNDS SHOULD REFLECT SIZE OF OBJECT
    
    // Calculate target y-coordinate range for collision detection
    const minY = Math.min(startY, finalPosition.y);
    const maxY = Math.max(startY, finalPosition.y);
    
    // Convert to tile coordinates and expand by 1 tile in each direction
    const startTileY = (Math.floor(minY / tileSize) - 1) * tileSize;
    const endTileY = (Math.floor(maxY / tileSize) + 1) * tileSize;
    
    // Only iterate through rows in the target y-coordinate range
    for (let checkY = startTileY; checkY <= endTileY; checkY += tileSize) {
        const rows = metadata.get(checkY);
        
        // Skip if no objects at this y-coordinate
        if (!rows) continue;
        
    // Check collision with all objects at this y-coordinate
    // hit tree
        for (const row of rows) {
            if (row.type === "forest") {
                for (const tree of row.trees) {
                    const result = checkBounds("tree", startX, startY, finalPosition.x, finalPosition.y,
                        tree.x, row.y, treeBoundSize, treeBoundSize);
                    // Only update if there was a collision (position changed)
                    if (result[0] !== finalPosition.x || result[1] !== finalPosition.y) {
                        x = result[0];
                        y = result[1];
                    }
                    // const treeX = tree.x;
                    // const treeY = row.y;
                    // if (
                    //     finalPosition.x > treeX - treeBoundSize / 2 &&
                    //     finalPosition.x < treeX + treeBoundSize / 2 &&
                    //     finalPosition.y > treeY - treeBoundSize / 2 &&
                    //     finalPosition.y < treeY + treeBoundSize / 2
                    // ) {
                    //     if (!(startX > treeX - treeBoundSize / 2 &&
                    //     startX < treeX + treeBoundSize / 2)){
                    //         if (treeX > finalPosition.x) {
                    //             x = treeX - treeBoundSize / 2;
                    //         } else {
                    //             x = treeX + treeBoundSize / 2;
                    //         }
                    //     }
                    //     if (!(startY > treeY - treeBoundSize / 2 &&
                    //     startY < treeY + treeBoundSize / 2)) {
                    //         if (treeY > finalPosition.y) {
                    //             y = treeY - treeBoundSize / 2;
                    //         } else {
                    //             y = treeY + treeBoundSize / 2;
                    //         }
                    //     }
                    // }
                }
            }
            if (row.type === "card") {
                const result = checkBounds("card", startX, startY, finalPosition.x, finalPosition.y,
                    row.card.x, row.y, row.card.cardWidth, row.card.cardHeight);
                // Only update if there was a collision (position changed)
                if (result[0] !== finalPosition.x || result[1] !== finalPosition.y) {
                    x = result[0];
                    y = result[1];
                }
                // const cardX = row.card.x;
                // const cardY = row.y;
                // const cardWidth = row.card.cardWidth;
                // const cardHeight = row.card.cardHeight;
                // // if there is an overlap
                // if (
                //     finalPosition.x > cardX - cardWidth / 2 &&
                //     finalPosition.x < cardX + cardWidth / 2 &&
                //     finalPosition.y > cardY - cardHeight / 2 &&
                //     finalPosition.y < cardY + cardHeight / 2
                // ) {
                //     // X was not the problem before which means it is a problem now
                //     if (!(startX > cardX - cardWidth / 2 &&
                //         startX < cardX + cardWidth / 2)) {
                //         // snap x to edge (depending on if its left or right of middle)
                //         if (cardX > finalPosition.x) {
                //             x = cardX - cardWidth / 2;
                //         } else {
                //             x = cardX + cardWidth / 2;
                //         }
                //     }
                //     // y was not the problem before which means it is a problem now
                //     if (!(startY > cardY - cardHeight / 2 &&
                //         startY < cardY + cardHeight / 2)) {
                //         if (cardY > finalPosition.y) {
                //             y = cardY - cardHeight / 2;
                //         } else {
                //             y = cardY + cardHeight / 2;
                //         }
                //     }
                // }
            }
        }
    }
  //  console.log("Final position after collision:", { x, y });
    return { x, y };
}
// Helper function to check bounds for collisions
// startX, startY = player starting position
// finalX, finalY = player ending position
// x, y = center of the object
function checkBounds(i = "", startX, startY, finalX, finalY, itemX, itemY, itemWidth, itemHeight) {
    let x = finalX; // Default to final position
    let y = finalY; // Default to final position
    // if there is an overlap in the ending position
    if (
        finalX > itemX - itemWidth / 2 &&
        finalX < itemX + itemWidth / 2 &&
        finalY > itemY - itemHeight / 2 &&
        finalY < itemY + itemHeight / 2
    ) {
        // X was not the problem before which means it is a problem now
        if (!(startX > itemX - itemWidth / 2 &&
            startX < itemX + itemWidth / 2)) {
            // snap x to edge (depending on if its left or right of middle)
            if (itemX > startX) {
                x = itemX - itemWidth / 2;
            } else {
                x = itemX + itemWidth / 2;
            }
        }
        // y was not the problem before which means it is a problem now
        if (!(startY > itemY - itemHeight / 2 &&
            startY < itemY + itemHeight / 2)) {
            if (itemY > startY) {
                y = itemY - itemHeight / 2;
            } else {
                y = itemY + itemHeight / 2;
            }
        }
    }

    // NOTE: I HAVENT HAD ANY SUPER SMALL OBJECTS YET TO TEST THIS WITH
    // if player WENT THROUGH the object from bottom to top / top to bottom
    if (
        (startY <= itemY - itemHeight / 2 &&
        finalY >= itemY + itemHeight / 2) ||
        (startY >= itemY + itemHeight / 2 && 
        finalY <= itemY - itemHeight / 2
        )
    ) {

        console.log("Checking overlap in Y direction");
        // check overlap in x values
        if (checkIntervalIntersection(startX, finalX, itemX - itemWidth / 2, itemX + itemWidth / 2)) {
            console.log("Go through detected in Y direction");
            return [startX, startY]; // Do not move player
        }
    }
    // if player WENT THROUGH the object from left to right / right to left
    if (
        (startX <= itemX - itemWidth / 2 &&
        finalX >= itemX + itemWidth / 2) ||
        (startX >= itemX + itemWidth / 2 && 
        finalX <= itemX - itemWidth / 2
        )
    ) {
        console.log("Checking overlap in X direction");
        // check overlap in y values
        if (checkIntervalIntersection(startY, finalY, itemY - itemHeight / 2, itemY + itemHeight / 2)) {
            console.log("Go through detected in X direction");
            return [startX, startY]; // Do not move player
        }
    }

    return [x,y];
}

function checkIntervalIntersection(start, end, itemStart, itemEnd) {
    if (start > itemStart) {
        // for simplicity, start is always less than or equal to itemStart
        temp = start;
        start = itemStart;
        itemStart = temp;
        temp = end;
        end = itemEnd; 
        itemEnd = temp;
    }
    return end >= itemStart;
}