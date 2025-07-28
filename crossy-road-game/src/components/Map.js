import * as THREE from 'three';
import {Grass} from './Grass.js';
import {Tree} from './Tree.js';
import {Road} from './Road.js';
import {Car} from './Car.js';
import {Truck} from './Truck.js';
import {Card, addText} from './Card.js';
import {Sign} from './Sign.js';
import { tileSize, bottomMap, grassBehindPlayer } from '../constants.js';
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
    [-30 * tileSize, [{
        type: "truck",
        direction: true,
        speed: 50,
        vehicles: [{initialX: -3 * tileSize, color: 0xff0000}],
        y: -30 * tileSize
    }]],
    
    [-32 * tileSize, [{
        type: "forest",
        trees: [
            {x: -6 * tileSize, height: 70},
            {x: 2 * tileSize, height: 20},
            {x: 1 * tileSize, height: 50}
        ],
        y: -32 * tileSize
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
    
    [-35 * tileSize, [{
        type: "card",
        card: {
            x: -2 * tileSize,
            cardWidth: 200,
            cardHeight: 150,
            icon: Pokeball(),
            rightText: "Guess and catch\nPokemon!\nMade with\nPokeAPI",
            bottomLeftText: "PokiGuess\n2020-2023\nFull-time"
        },
        y: -35 * tileSize
    }]],
    [-42 * tileSize, [{
        type: "sign",
        sign: {
            x: 1 * tileSize,
            width: 100,
            height: 50,
            text: "Hey there,\nI'm Joanna!\nWelcome to\nmy site!",
            color: 0xf8e8e8,
            vertical: 10,
            horizontal: -25,
        },
        y: -42 * tileSize
    }]],
    [-30 * tileSize, [{
        type: "sign",
        sign: {
            x: -1 * tileSize,
            width: 70,
            height: 60,
            text: "Click Me!\nDay/Night\nToggle",
            color: 0x6a5acd,
            vertical: 5,
            horizontal: -22,
            toggleSkybox: true
        },
        y: -30 * tileSize
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
    // Clear the map completely (allows completely newly regenerated random map)
    map.clear();
    // Clear metadata
    metadata.clear();
    // Create grass rows before player (negative Y values)
    for (let i = 0; i > bottomMap - grassBehindPlayer; i--) {
        if (i == 0){
            const grass = Grass(i * tileSize, 0xa7e3bb, true, false);
            map.add(grass);
        } else if (i>bottomMap) {
            const grass = Grass(i * tileSize, undefined, true, false); // Skip color, use addTrees
            map.add(grass);
        } else {
            // behind player for visuals
            const grass = Grass(i*tileSize, undefined, true, true)
            map.add(grass)
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

    // Items that I can walk through
    addText("Move camera with mouse", map, -44*tileSize)
}

export function populateRows(data) {
    // Add the rows to the map
    for (const [y, objectsAtY] of data) {
        for (const object of objectsAtY) {
            const y = object.y
            if (object.type === "card") {
                const card = Card(object.card.x, y, object.card.cardWidth, object.card.cardHeight, object.card.icon, object.card.rightText, object.card.bottomLeftText);
                map.add(card);
                object.ref = card;
            }
            else if (object.type === "sign") {
                const sign = Sign(object.sign.x, y, object.sign.width, object.sign.height, object.sign.text, object.sign.color, object.sign.vertical, object.sign.horizontal, object.sign.skybox, object.sign.toggleSkybox);
                map.add(sign);
                object.ref = sign;
            }

            // first row of the metadata is the second row, after the starting row (which is not included in the metadata)
            if (object.type === "forest") {
                // returns grass Group; represents the row
                const r = Grass(y);
                object.trees.forEach(({x, height}) => {
                    const tree = Tree(x, 0, height); // y=0 since parent group handles positioning
                    // add each tree to the grass Group
                    r.add(tree);
                })
                // add the grass Group to the map
                map.add(r);
                object.ref = r
            }
            else if (object.type === "car") {
                const r = Road(y);
                object.vehicles.forEach(vehicle => {
                    const car = Car(vehicle.initialX, 0, object.direction, vehicle.color);
                    // store ref to car object for animation
                    vehicle.ref = car;
                    r.add(car);
                });
                map.add(r);
                object.ref = r
            }
            else if (object.type === "truck") {
                const r = Road(y);
                object.vehicles.forEach(vehicle => {
                    const truck = Truck(vehicle.initialX, 0, object.direction, vehicle.color);
                    vehicle.ref = truck;
                    r.add(truck);
                });
                map.add(r);
                object.ref = r
            }
        }
    }
}

export function addRows(){
    const startIndex = metadata.size - otherObjects.size
    const newRows = generateRows(40, startIndex/40);
    
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
    console.log('Added new rows:', metadata.size, startIndex/40);
}
