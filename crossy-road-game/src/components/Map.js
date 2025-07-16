import * as THREE from 'three';
import {Grass} from './Grass.js';
import {Tree} from './Tree.js';
import {Road} from './Road.js';
import {Car} from './Car.js';
import {Truck} from './Truck.js';
import {Card} from './Card.js';
import { tileSize, bottomMap } from '../constants.js';
import { Pokeball } from './Pokeball.js';
import { generateRows } from '../utilities/generateRows.js';

// initial metadata: need to add cards / initial items to a metadata
// also because we need to calculate hit bounds
export const metadata = [];

const otherObjects = [
    {
        type: "truck",
        direction: true,
        speed: 50,
        vehicles: [{initialX: -3 * tileSize, color: 0xff0000}],
        y: -38 * tileSize
    },
    {
        type: "forest",
        trees: [
            {x: -6 * tileSize, height: 70},
            {x: 2 * tileSize, height: 20},
            {x: 1 * tileSize, height: 50}
        ],
        y: -39 * tileSize
    },
    {
        type: "forest",
        trees: [
            {x: -6 * tileSize, height: 70},
            {x: 2 * tileSize, height: 20},
            {x: 1 * tileSize, height: 50}
        ],
        y: -5 * tileSize
    },
    {
        type: "car",
        // true: move right, false: move left
        direction: false,
        speed: 80,
        vehicles: [{initialX: -1 * tileSize, color: 0xff0000}],
        y:-11 * tileSize
    },
    {
        type: "car",
        // true: move right, false: move left
        direction: false,
        speed: 80,
        vehicles: [{initialX: -1 * tileSize, color: 0xff0000}],
        y: -3 * tileSize
    },
    {
        type: "truck",
        direction: true,
        speed: 100,
        vehicles: [{initialX: -4 * tileSize, color: 0x00ff00}],
        y: -4 * tileSize
    },
    {
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
    }
];

export const numberObjects = otherObjects.length;

export const map = new THREE.Group();

export function initializeMap(){
    // Create grass rows before player (negative Y values)
    for (let i = 0; i > bottomMap; i--) {
        if (i == 0){
            const grass = Grass(i * tileSize, 0xa7e3bb);
            map.add(grass);
        } else {
            const grass = Grass(i * tileSize);
            map.add(grass);
        }
    }
    // Add other objects to the map
    metadata.push(...otherObjects);
    // Populate initial data
    populateRows(metadata, false);
    // Add the new rows
    addRows();  
}

export function populateRows(data, generated = true, startIndex = 0) {
    // Add the rows to the map
    data.forEach((row, i) => {
        let y;
        if (generated){
            y = (startIndex + i + 1) * tileSize ;
        } else {
            y = row.y;
        }
        if (row.type === "card") {
            const card = Card(row.card.x, y, row.card.cardWidth, row.card.cardHeight, row.card.icon, row.card.rightText, row.card.bottomLeftText);
            map.add(card);
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
    });
}

export function addRows(){
    const startIndex = metadata.length - otherObjects.length;
    const newRows = generateRows(40);
    for (let i = 0; i < newRows.length; i++) {
        newRows[i].y = (startIndex + i + 1) * tileSize; // Set the Y position based on the current length of metadata
    }
    metadata.push(...newRows);

    // Repopulate the rows
    populateRows(newRows, true, startIndex);
    console.log('Added new rows:', metadata.length);
}
