import * as THREE from "three";
import {metadata} from "../components/Map";
import {tileSize} from "../constants"
import {player, position} from "../components/Player";
import {randomElement} from "./generateRows"

const resultDOM = document.getElementById("result-container");
const finalScoreDOM = document.getElementById("final-score");
const highScoreDOM = document.getElementById("high-score");
const messageDOM = document.getElementById("message");

export function hitVehicle(){
    const startTileY = Math.max((Math.floor(position.currentY / tileSize) - 1), 0) * tileSize;
    const endTileY = (Math.floor(position.currentY / tileSize) + 1) * tileSize;
    
    const playerBoundingBox = new THREE.Box3();
    playerBoundingBox.setFromObject(player);

    // Only iterate through rows in the target y-coordinate range
    for (let checkY = startTileY; checkY <= endTileY; checkY += tileSize) {
        console.log(startTileY, endTileY)
        const items = metadata.get(checkY);
        
        // Skip if no objects at this y-coordinate
        if (!items) continue;
        
        // Check collision with all objects at this y-coordinate
        // hit vehicle
        for (const item of items) {
            if (item.type === "car" || item.type === "truck") {
                item.vehicles.forEach(({ref}) => {
                    if (!ref) throw Error("No vehicle reference");
                    const vehicleBoundingBox = new THREE.Box3();
                    vehicleBoundingBox.setFromObject(ref);

                    if (playerBoundingBox.intersectsBox(vehicleBoundingBox)){                                            
                        if(!resultDOM || !finalScoreDOM) return;
                        resultDOM.classList.remove("hidden");
                        const score = 1+Math.floor(position.currentY/tileSize)
                        finalScoreDOM.innerText = score.toString();
                        const highScore = parseInt(highScoreDOM.innerText);
                        if (highScore < score){
                            highScoreDOM.innerText = score.toString();
                            messageDOM.innerText = "New High Score!";
                        } else {
                            messageDOM.innerText = randomElement([
                                "Nice try!",
                                "So close!",
                                "That was great!",
                                "Try again?",
                                "Run it back?"
                            ]);
                        }
                    }
                })
            }
        }
    }
}