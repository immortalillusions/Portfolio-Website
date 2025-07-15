import { calculateFinalPosition } from "./calculateFinalPosition.js";
import { tileSize, minTileIndex, maxTileIndex, bottomMap } from "../constants.js";
import { metadata as rows } from "../components/Map.js";
import { movesQueue, position } from '../components/Player.js';
import { treeSize } from "../constants.js";

export function endsUpInValidPosition(camera) {
    const finalPosition = calculateFinalPosition(camera);

    const [startX, startY] = [position.currentX, position.currentY];

    let y = finalPosition.y;
    let x = finalPosition.x;
    console.log("Current position:", { x: startX, y: startY });
    console.log("Final position before collision:", finalPosition);

    // detect if we hit the edge of the board
    if (finalPosition.x <= minTileIndex * tileSize) {
        x = minTileIndex * tileSize; // Snap to edge
    } else if (finalPosition.x >= maxTileIndex * tileSize) {
        x = maxTileIndex * tileSize; // Snap to edge
    }
    // may need to edit the upper bound of board if we want it to expand infinitely
    if (finalPosition.y <= (bottomMap+1) * tileSize) {
        y = (bottomMap+1) * tileSize; // Snap to edge
    } else if (finalPosition.y >= (rows.length-1) * tileSize) {
        y = (rows.length-1) * tileSize; // Snap to edge
    }
    // HIT BOUNDS SHOULD REFLECT SIZE OF OBJECT
    // NOTE THAT THE BOUNDS NEED TO BE TWICE THE SIZE OF THE TILE OR ELSE THE PLAYER CAN WALK THROUGH OBJ

    // hit tree
    for (const row of rows) {
        if (row.type === "forest") {
            for (const tree of row.trees) {
                const treeX = tree.x;
                const treeY = row.y;
                if (
                    finalPosition.x > treeX - treeSize / 2 &&
                    finalPosition.x < treeX + treeSize / 2 &&
                    finalPosition.y > treeY - treeSize / 2 &&
                    finalPosition.y < treeY + treeSize / 2
                ) {
                    if (!(startX > treeX - treeSize / 2 &&
                    startX < treeX + treeSize / 2)){
                        if (treeX > finalPosition.x) {
                            x = treeX - treeSize / 2;
                        } else {
                            x = treeX + treeSize / 2;
                        }
                    }
                    if (!(startY > treeY - treeSize / 2 &&
                    startY < treeY + treeSize / 2)) {
                        if (treeY > finalPosition.y) {
                            y = treeY - treeSize / 2;
                        } else {
                            y = treeY + treeSize / 2;
                        }
                    }
                }
            }
        }
        if (row.type === "card") {
            const cardX = row.card.x;
            const cardY = row.y;
            const cardWidth = row.card.cardWidth;
            const cardHeight = row.card.cardHeight;
            // if there is an overlap
            if (
                finalPosition.x > cardX - cardWidth / 2 &&
                finalPosition.x < cardX + cardWidth / 2 &&
                finalPosition.y > cardY - cardHeight / 2 &&
                finalPosition.y < cardY + cardHeight / 2
            ) {
                // X was not the problem before which means it is a problem now
                if (!(startX > cardX - cardWidth / 2 &&
                    startX < cardX + cardWidth / 2)) {
                    // snap x to edge (depending on if its left or right of middle)
                    if (cardX > finalPosition.x) {
                        x = cardX - cardWidth / 2;
                    } else {
                        x = cardX + cardWidth / 2;
                    }
                }
                // y was not the problem before which means it is a problem now
                if (!(startY > cardY - cardHeight / 2 &&
                    startY < cardY + cardHeight / 2)) {
                    if (cardY > finalPosition.y) {
                        y = cardY - cardHeight / 2;
                    } else {
                        y = cardY + cardHeight / 2;
                    }
                }
            }
        }
    }
    console.log("Final position after collision:", { x, y });
    return { x, y };
}