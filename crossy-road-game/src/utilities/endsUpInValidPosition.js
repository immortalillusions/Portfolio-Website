import { calculateFinalPosition } from "./calculateFinalPosition.js";
import { tileSize, minTileIndex, maxTileIndex, bottomMap } from "../constants.js";
import { metadata as rows } from "../components/Map.js";

export function endsUpInValidPosition(camera) {
    const finalPosition = calculateFinalPosition(camera);

    let yWorks = true;
    let xWorks = true;

    // detect if we hit the edge of the board
    if (finalPosition.x <= minTileIndex * tileSize || finalPosition.x >= maxTileIndex * tileSize) {
        xWorks = false;
    }
    // may need to edit the upper bound of board if we want it to expand infinitely
    if (finalPosition.y <= (bottomMap+1) * tileSize  || finalPosition.y >= (rows.length-1) * tileSize) {
        yWorks = false;
    }
    // UPDATE HIT BOUNDS FOR VEHICLES AND CARDS
    // hit bounds should reflect size

    // hit tree
    for (const row of rows) {
        if (row.type === "forest") {
            for (const tree of row.trees) {
                const treeX = tree.x;
                const treeY = row.y;
                if (
                    finalPosition.x >= treeX - tileSize / 2 &&
                    finalPosition.x <= treeX + tileSize / 2 &&
                    finalPosition.y >= treeY - tileSize / 2 &&
                    finalPosition.y <= treeY + tileSize / 2
                ) {
                    xWorks = false; // Hit a tree
                    yWorks = false; // Hit a tree
                }
            }
        }
        // hit card
        if (row.type === "card") {
            const cardX = row.card.x;
            const cardY = row.y;
            const cardWidth = row.card.cardWidth;
            const cardHeight = row.card.cardHeight;
            
            const xCollision = finalPosition.x >= cardX - cardWidth / 2 && 
                             finalPosition.x <= cardX + cardWidth / 2;
            const yCollision = finalPosition.y >= cardY - cardHeight / 2 && 
                             finalPosition.y <= cardY + cardHeight / 2;
            
            if (xCollision && yCollision) {
                xWorks = false;
                yWorks = false;
            }
        }
    }

    return xWorks && yWorks;
}