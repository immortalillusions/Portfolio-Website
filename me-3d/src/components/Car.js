import * as THREE from "three";
import { setShadowsRecursively } from "../constants.js";
import { Wheel } from "./Wheel.js";

export function Car(x, y, direction, color) {
    const car = new THREE.Group();
    car.position.x = x;
    car.position.y = y;
    if(!direction) car.rotation.z = Math.PI; // rotate 180 degrees if moving left
    
    const main = new THREE.Mesh(
        new THREE.BoxGeometry(60,30,15),
        new THREE.MeshLambertMaterial({color, flatShading: true})
    )
    main.position.z = 12; // wheel ends at 12, so main overlaps with wheel
    car.add(main);
    
    const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(30, 24, 12),
        new THREE.MeshLambertMaterial({color: "white", flatShading: true})
    )
    // slightly behind relative to center of main
    cabin.position.x = -6;
    cabin.position.z = 25.5; //12 + 12/2 + 15/2
    car.add(cabin);

    const frontWheel = Wheel(18);
    car.add(frontWheel);
    const backWheel = Wheel(-18);
    car.add(backWheel);
    setShadowsRecursively(car, true, true);
    return car;
}