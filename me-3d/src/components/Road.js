import * as THREE from 'three';
import {tilesPerRow, tileSize} from '../constants.js';

export function Road(yPosition) {
    const road = new THREE.Group();
    road.position.y = yPosition;

    const foundation = new THREE.Mesh(
        new THREE.BoxGeometry(tilesPerRow * tileSize, tileSize, 3), // width, length, depth/height
        new THREE.MeshLambertMaterial({
            color: 0x454a59,
        })
    );
    foundation.receiveShadow = true; // receive shadows from other objects
    road.add(foundation);
    return road;
}   