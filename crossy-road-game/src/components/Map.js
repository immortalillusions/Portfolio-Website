import * as THREE from 'three';
import {Grass} from './Grass.js';
import {Tree} from './Tree.js';
import {Road} from './Road.js';
import {Car} from './Car.js';
import {Truck} from './Truck.js';
import {Card} from './Card.js';
import {Sign} from './Sign.js';
import { tileSize, bottomMap } from '../constants.js';
import { Pokeball } from './Pokeball.js';
import { generateRows } from '../utilities/generateRows.js';

// initial metadata: need to add cards / initial items to a metadata
// also because we need to calculate hit bounds

// CONVERT METADATA TO MAP FOR THE FUNCTION ENDSUPINVALIDPOSITION
// SO WE ONLY HAVE TO CHECK ROWS WITH THE SAME INDEX
// AND NOT ITERATE THROUGH ALL ROWS WHICH CAN GROW A LOT IF USER PLAYS FOR A LONG TIME
// note: this only works if y is in discrete increments of tileSize

export const metadata = new Map();

export const otherObjects = new Map([
    [-38 * tileSize, [{
        type: "truck",
        direction: true,
        speed: 50,
        vehicles: [{initialX: -3 * tileSize, color: 0xff0000}],
        y: -38 * tileSize
    }]],
    
    [-39 * tileSize, [{
        type: "forest",
        trees: [
            {x: -6 * tileSize, height: 70},
            {x: 2 * tileSize, height: 20},
            {x: 1 * tileSize, height: 50}
        ],
        y: -39 * tileSize
    }]],
    
    [-5 * tileSize, [{
        type: "forest",
        trees: [
            {x: -6 * tileSize, height: 70},
            {x: 2 * tileSize, height: 20},
            {x: 1 * tileSize, height: 50}
        ],
        y: -5 * tileSize
    }]],
    
    [-11 * tileSize, [{
        type: "car",
        // true: move right, false: move left
        direction: false,
        speed: 80,
        vehicles: [{initialX: -1 * tileSize, color: 0xff0000}],
        y: -11 * tileSize
    }]],
    
    [-3 * tileSize, [{
        type: "car",
        // true: move right, false: move left
        direction: false,
        speed: 80,
        vehicles: [{initialX: -1 * tileSize, color: 0xff0000}],
        y: -3 * tileSize
    }]],
    
    [-4 * tileSize, [{
        type: "truck",
        direction: true,
        speed: 100,
        vehicles: [{initialX: -4 * tileSize, color: 0x00ff00}],
        y: -4 * tileSize
    }]],
    
    [-40 * tileSize, [{
        type: "card",
        card: {
            x: -2 * tileSize,
            cardWidth: 200,
            cardHeight: 150,
            icon: Pokeball(),
            rightText: "Guess and catch\nPokemon!\nMade with PokeAPI",
            bottomLeftText: "PokiGuess\n2020-2023\nFull-time"
        },
        y: -40 * tileSize
    }]],
    [-35 * tileSize, [{
        type: "sign",
        sign: {
            x: 5 * tileSize,
            width: 100,
            height: 50,
            text: "Hey there,\nWelcome!",
            color: 0xf8e8e8,
            vertical: 5,
            horizontal: -15,
        },
        y: -35 * tileSize
    }]],
    [-36 * tileSize, [{
        type: "sign",
        sign: {
            x: -1 * tileSize,
            width: 60,
            height: 60,
            text: "Click Me!\nDay/Night\nToggle",
            color: 0x6a5acd,
            vertical: 5,
            horizontal: -15,
            toggleSkybox: true
        },
        y: -36 * tileSize
    }]]
]);

export function countObjectsInMap(map) {
    let totalCount = 0;
    for (const objectsArray of map.values()) {
        totalCount += objectsArray.length;
    }
    return totalCount;
}

export const map = new THREE.Group();

export function initializeMap(){
    // Create grass rows before player (negative Y values)
    for (let i = 0; i > bottomMap; i--) {
        if (i == 0){
            const grass = Grass(i * tileSize, 0xa7e3bb, true);
            map.add(grass);
        } else {
            const grass = Grass(i * tileSize, undefined, true); // Skip color, use addTrees
            map.add(grass);
        }
    }
    // Add other objects to the map
    for (const [key, value] of otherObjects) {
        metadata.set(key, [...value]); // Copy array
    }
    // Populate initial data
    populateRows(metadata);
    // Add the new rows
    addRows();  
}

export function populateRows(data) {
    // Add the rows to the map
    for (const [y, objectsAtY] of data) {
        for (const row of objectsAtY) {
            const y = row.y
            if (row.type === "card") {
                const card = Card(row.card.x, y, row.card.cardWidth, row.card.cardHeight, row.card.icon, row.card.rightText, row.card.bottomLeftText);
                map.add(card);
            }
            else if (row.type === "sign") {
                const sign = Sign(row.sign.x, y, row.sign.width, row.sign.height, row.sign.text, row.sign.color, row.sign.vertical, row.sign.horizontal, row.sign.skybox, row.sign.toggleSkybox);
                map.add(sign);
            }

            // first row of the metadata is the second row, after the starting row (which is not included in the metadata)
            if (row.type === "forest") {
                // returns grass Group; represents the row
                const r = Grass(y);
                row.trees.forEach(({x, height}) => {
                    const tree = Tree(x, 0, height); // y=0 since parent group handles positioning
                    // add each tree to the grass Group
                    r.add(tree);
                })
                // add the grass Group to the map
                map.add(r);
            }
            else if (row.type === "car") {
                const r = Road(y);
                row.vehicles.forEach(vehicle => {
                    const car = Car(vehicle.initialX, 0, row.direction, vehicle.color);
                    // store ref to car object for animation
                    vehicle.ref = car;
                    r.add(car);
                });
                map.add(r);
            }
            else if (row.type === "truck") {
                const r = Road(y);
                row.vehicles.forEach(vehicle => {
                    const truck = Truck(vehicle.initialX, 0, row.direction, vehicle.color);
                    vehicle.ref = truck;
                    r.add(truck);
                });
                map.add(r);
            }
        }
    }
}

export function addRows(){
    const startIndex = metadata.size - otherObjects.size;
    const newRows = generateRows(50);
    
    // Create a Map to hold just the new rows for populateRows
    const newRowsMap = new Map();
    
    // Add new rows to metadata Map
    for (let i = 0; i < newRows.length; i++) {
        const y = (startIndex + i + 1) * tileSize;
        newRows[i].y = y;
        
        // Map equivalent of push: set the y-coordinate as key
        if (!metadata.has(y)) {
            metadata.set(y, []);
        }
        metadata.get(y).push(newRows[i]);
        
        // Also add to newRowsMap for populateRows
        if (!newRowsMap.has(y)) {
            newRowsMap.set(y, []);
        }
        newRowsMap.get(y).push(newRows[i]);
    }

    // Populate only the new rows using the newRowsMap
    populateRows(newRowsMap);
    console.log('Added new rows:', metadata.size);
}
