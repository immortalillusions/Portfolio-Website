import * as THREE from 'three';
import { minTileIndex, maxTileIndex, tileSize } from '../constants';

export function generateRows(amount, difficulty) {
    const rows = [];
    for (let i = 0; i < amount; i++){
        const rowData = generateRow(difficulty);
        rows.push(rowData);
    }
    return rows;
}

// either car, truck, or forest
function generateRow(difficulty) {
    const type = randomElement(["car", "truck", "forest"]);
    if (type == "car") return generateVehicleLaneMetadata("car", difficulty);
    if (type == "truck") return generateVehicleLaneMetadata("truck", difficulty);
    return generateForestLaneMetadata();
}

export function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateForestLaneMetadata() {
    const trees = [];
    const occupiedTiles = new Set();
    // 110 tiles wide so generate max 20 trees
    const treeCount = Math.floor(Math.random() * 2) + 1; // 1 to 3 trees
    for (let i = 0; i < treeCount; i++) {
        let x;
        do {
            x = THREE.MathUtils.randInt(minTileIndex, maxTileIndex); // random x position 
        } while (occupiedTiles.has(x));
        const height = Math.floor(Math.random() * 50) + 20; // random height between 20 and 70
        trees.push({ x: x * tileSize, height });
        occupiedTiles.add(x);
    }
    return {
        type: "forest",
        trees
    };
}

function generateVehicleLaneMetadata(vehicle, difficulty) {
    const direction = randomElement([true, false]); // true: right, false: left
    const speed = randomElement([100, 120, 150, 200])*(1+difficulty*0.25); // random speed
    const vehicles = [];
    const occupiedTiles = new Set();

    let vehicleCount;
    if (vehicle === "car") {
        vehicleCount = Math.floor(Math.random() * 3) + 5; // 3 to 8 vehicles
    } else {
        vehicleCount = Math.floor(Math.random() * 1) + 3; // 1 to 3 trucks
    }
    for (let i = 0; i < vehicleCount; i++) {
        let initialX;
        do {
            initialX = THREE.MathUtils.randInt(minTileIndex, maxTileIndex); // random x position
        } while (occupiedTiles.has(initialX));
        const color = randomElement([0xED254E, 0xFFD3DA, 0x02A9EA]); // random color
        vehicles.push({ initialX: initialX * tileSize, color });
        occupiedTiles.add(initialX);
        // because car is 60 units wide and tiles are 42 so 2 tiles is 42*2 = 84 units
        // don't want overlapping cars
        occupiedTiles.add(initialX + 1); // occupy next tile for larger vehicles
        occupiedTiles.add(initialX - 1); // occupy previous tile for larger vehicles
        if (vehicle === "truck") {
            occupiedTiles.add(initialX + 2); // truck is 80+24 wide
            occupiedTiles.add(initialX - 2);
        }
    }
    if (vehicle === "car") {
        return { type: "car", direction, speed, vehicles };
    }
    return { type: "truck", direction, speed, vehicles };
}
