import * as THREE from "three";
import { setShadowsRecursively } from "../constants.js";
import { Wheel } from "./Wheel.js";

export function Truck(x, y, direction, color) {
    const truck = new THREE.Group();
    truck.position.x = x;
    truck.position.y = y;
    if(!direction) truck.rotation.z = Math.PI; // rotate 180 degrees if moving left
    const cargo = new THREE.Mesh(
        new THREE.BoxGeometry(80, 30, 30),
        new THREE.MeshLambertMaterial({color: 0xb4c6fc, flatShading: true})
    )
    cargo.position.z = 18;
    truck.add(cargo);
    const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(24, 24, 24),
        new THREE.MeshLambertMaterial({color: color, flatShading: true})
    )
    // slightly behind relative to center of main
    cabin.position.x = 52;
    cabin.position.z = 15; //12 + 12/2 + 15/2
    truck.add(cabin);
    const cabinWheel = Wheel(52);
    truck.add(cabinWheel);
    const frontWheel = Wheel(18);
    truck.add(frontWheel);
    const backWheel = Wheel(-18);
    truck.add(backWheel);
    setShadowsRecursively(truck, true, true);
    return truck;
}