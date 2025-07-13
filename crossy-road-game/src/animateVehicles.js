import * as THREE from "three";
import {metadata as rows} from "./components/Map.js";
import { minTileIndex, maxTileIndex, tileSize } from "./constants";

const clock = new THREE.Clock();

export function animateVehicles() {
    // time passed
    const delta = clock.getDelta();
    rows.forEach((rowData)=>{
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
    });
}