import * as THREE from 'three';
import {tilesPerRow, tileSize} from '../constants.js';

export function Grass(rowIndex) {
    const grass = new THREE.Group();
    grass.position.y = rowIndex * tileSize; // position based on row index

    const foundation = new THREE.Mesh(
        // has slight height vs roads that are flat
        new THREE.BoxGeometry(tilesPerRow * tileSize, tileSize, 3), // width, length, depth/height
        new THREE.MeshLambertMaterial({
            color: 0x50C878,
        })
    );
    foundation.position.z = 1.5;
    foundation.receiveShadow = true; // receive shadows from other objects
    grass.add(foundation);
    return grass;
}   