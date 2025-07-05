import * as THREE from 'three';
import { tileSize, setShadowsRecursively } from '../constants';

export function Tree(tileIndex, height) {
    const tree = new THREE.Group();
    // x is right/left
    tree.position.x = tileIndex * tileSize;
    const trunk = new THREE.Mesh(
        new THREE.BoxGeometry(15,15,20),
        new THREE.MeshLambertMaterial({
            color: 0x4d2926,
            flatShading: true
        })
    )
    trunk.position.z = 10;
    tree.add(trunk);

    const leaves = new THREE.Mesh(
        new THREE.BoxGeometry(30, 30, height), // width, length, height
        new THREE.MeshLambertMaterial({
            color: 0x7aa21d,
            flatShading: true
        })
    )
    // adjust for trunk
    leaves.position.z = height / 2 + 20;
    tree.add(leaves);
    setShadowsRecursively(tree, true, true);
    return tree;
}