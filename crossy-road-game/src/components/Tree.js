import * as THREE from 'three';
import { setShadowsRecursively } from '../constants';

export function Tree(x, y, height) {
    const tree = new THREE.Group();
    tree.position.x = x; // x is right/left
    // Note if tree is part of a group (e.g. grass), y is relative to that group SO just set y = 0
    tree.position.y = y;
    
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