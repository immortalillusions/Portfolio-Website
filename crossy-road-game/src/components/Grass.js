import * as THREE from 'three';
import {tilesPerRow, tileSize, maxTilePlayer, minTilePlayer, maxTileIndex, minTileIndex} from '../constants.js';
import {Tree} from "./Tree.js"
export function Grass(yPosition, color = 0x50C878, addTrees = false) {
    const grass = new THREE.Group();
    grass.position.y = yPosition; // y position

    const foundation = new THREE.Mesh(
        // has slight height vs roads that are flat
        new THREE.BoxGeometry(tilesPerRow * tileSize, tileSize, 3), // width, length, depth/height
        new THREE.MeshLambertMaterial({
            color: color,
        })
    );
    foundation.position.z = 1.5;
    foundation.receiveShadow = true; // receive shadows from other objects
    grass.add(foundation);
    // boundary trees
    const treeRight = new Tree((maxTilePlayer+1)*tileSize, 0, 50+Math.random()*100)
    const treeLeft = new Tree((minTilePlayer-1)*tileSize, 0, 50+Math.random()*100)
    grass.add(treeRight)
    grass.add(treeLeft)

    if(addTrees){
        // trees beyond boundary
        const occupiedTiles = new Set();
        // don't add trees into player walkable area
        for (let i = minTilePlayer; i<maxTilePlayer+1; i++){
            occupiedTiles.add(i)
        }
        // Reduced tree count for better performance
        const treeCount = Math.floor(Math.random() * 1) + 1; // 2 to 5 trees instead of 10-20
        for (let i = 0; i < treeCount; i++) {
            let x;
            do {
                x = THREE.MathUtils.randInt(minTileIndex, maxTileIndex); // random x position 
            } while (occupiedTiles.has(x));
            const height = Math.floor(Math.random() * 50) + 20; // random height between 20 and 70
            const tree = new Tree(x*tileSize, 0, height); // Use 0 for Y since parent group handles positioning
            grass.add(tree)
            occupiedTiles.add(x);
        }
    }
    return grass;
}   