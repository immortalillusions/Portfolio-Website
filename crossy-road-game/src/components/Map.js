import * as THREE from 'three';
import {Grass} from './Grass.js';
import {Tree} from './Tree.js';
import {Road} from './Road.js';
import {Car} from './Car.js';
import {Truck} from './Truck.js';
export const metadata = [
    {
        type: "truck",
        direction: true,
        speed: 0,
        vehicles: [{initialTileIndex: -3, color: 0xff0000}],
    },
    {
        type: "forest",
        trees: [
            {tileIndex: -3, height: 70},
            {tileIndex: 2, height: 20},
            {tileIndex: 1, height: 50}
        ]
    },
    {
        type: "car",
        // true: move right, false: move left
        direction: false,
        speed: 1,
        vehicles: [{initialTileIndex: -1, color: 0xff0000}],
    },
    {
        type: "truck",
        direction: true,
        speed: 0,
        vehicles: [{initialTileIndex: -4, color: 0x00ff00}],
    }
]

export const map = new THREE.Group();
export function initializeMap(){
    // player position is rowIndex = 0
    // for aesthetic reasons, add grass rows before player
    for (let rowIndex = 0; rowIndex > -5; rowIndex--) {
        const grass = Grass(rowIndex);
        map.add(grass);
    }
    // Add the rows with trees
    addRows();  
}

export function addRows(){
    metadata.forEach((row, index) => {
        // first row of the metadata is the second row, after the starting row (which is not included in the metadata)
        const rowIndex = index + 1;
        if (row.type === "forest") {
            // returns grass Group; represents the row
            const r = Grass(rowIndex);
            row.trees.forEach(({tileIndex, height}) => {
                const tree = Tree(tileIndex, height);
                // add each tree to the grass Group
                r.add(tree);
            })
            // add the grass Group to the map
            map.add(r);
        }
        else if (row.type === "car") {
            const r = Road(rowIndex);
            row.vehicles.forEach(vehicle => {
                const car = Car(
                    vehicle.initialTileIndex,
                    row.direction,
                    vehicle.color
                )
                r.add(car);
            });
            map.add(r);
        }
        else if (row.type === "truck") {
            const r = Road(rowIndex);
            row.vehicles.forEach(vehicle => {
                const truck = Truck(
                    vehicle.initialTileIndex,
                    row.direction,
                    vehicle.color
                )
                r.add(truck);
            });
            map.add(r);
        }
    });
    
}