import * as THREE from "three";
import {metadata} from "./components/Map.js";
import { position } from "./components/Player.js";
import { minTileIndex, maxTileIndex, tileSize } from "./constants";

const clock = new THREE.Clock();

export function animateVehicles() {
    // time passed
    const delta = clock.getDelta();

    // TO BE EFFICIENT LET'S ONLY ANIMATE VEHICLES WITHIN +- 55 ROW TILES OF PLAYER
    const [x, y] = [position.currentX, position.currentY];
    const startY = Math.floor((y - 55 * tileSize) / tileSize) * tileSize;
    const endY = Math.floor((y + 55 * tileSize) / tileSize) * tileSize;

    for (let checkY = startY; checkY <= endY; checkY += tileSize) {
        const objectsAtY = metadata.get(checkY);
        if (!objectsAtY) continue; // No objects at this y-coordinate
        for (const rowData of objectsAtY) {
            if (rowData.type == "car" || rowData.type == "truck"){
            // spawn / despawn outside of the visible area for pretty
            const beginningOfRow = (minTileIndex - 2) * tileSize;
            const endOfRow = (maxTileIndex + 2) * tileSize;
            rowData.vehicles.forEach(({ref}) => {
                if (!ref) throw Error("Vehicle reference not found");
                if (rowData.direction){
                    // move right
                    // respawn if off screen
                    ref.position.x = ref.position.x > endOfRow ? beginningOfRow : ref.position.x + rowData.speed * delta;     
                } else {
                    ref.position.x = ref.position.x < beginningOfRow ? endOfRow : ref.position.x - rowData.speed * delta;
                }
            });

            }
        }
    }
}