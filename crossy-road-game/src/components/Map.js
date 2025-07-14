import * as THREE from 'three';
import {Grass} from './Grass.js';
import {Tree} from './Tree.js';
import {Road} from './Road.js';
import {Car} from './Car.js';
import {Truck} from './Truck.js';
import {Card} from './Card.js';
import { tileSize } from '../constants.js';
import { Pokeball } from './Pokeball.js';

export const metadata = [
    {
        type: "truck",
        direction: true,
        speed: 50,
        vehicles: [{initialX: -3 * tileSize, color: 0xff0000}],
        y: 1 * tileSize
    },
    {
        type: "forest",
        trees: [
            {x: -3 * tileSize, height: 70},
            {x: 2 * tileSize, height: 20},
            {x: 1 * tileSize, height: 50}
        ],
        y: 2 * tileSize
    },
    {
        type: "car",
        // true: move right, false: move left
        direction: false,
        speed: 80,
        vehicles: [{initialX: -1 * tileSize, color: 0xff0000}],
        y: 3 * tileSize
    },
    {
        type: "truck",
        direction: true,
        speed: 100,
        vehicles: [{initialX: -4 * tileSize, color: 0x00ff00}],
        y: 4 * tileSize
    },
    {
        type: "card",
        card: {
            x: -2 * tileSize,
            icon: Pokeball(),
            rightText: "Guess and catch\nPokemon!\nMade with PokeAPI",
            bottomLeftText: "PokiGuess\n2020-2023\nFull-time"
        },
        y: -1 * tileSize
    }
];

export const map = new THREE.Group();

export function initializeMap(){
    // Create grass rows before player (negative Y values)
    for (let i = 0; i > -5; i--) {
        const grass = Grass(i * tileSize);
        map.add(grass);
    }
    // Add the content rows
    addRows();  
}

export function addRows(){
    metadata.forEach((row) => {
        if (row.type === "card") {
            const card = Card(row.card.x, row.y, row.card.icon, row.card.rightText, row.card.bottomLeftText);
            map.add(card);
        }

        // first row of the metadata is the second row, after the starting row (which is not included in the metadata)
        if (row.type === "forest") {
            // returns grass Group; represents the row
            const r = Grass(row.y);
            row.trees.forEach(({x, height}) => {
                const tree = Tree(x, 0, height); // y=0 since parent group handles positioning
                // add each tree to the grass Group
                r.add(tree);
            })
            // add the grass Group to the map
            map.add(r);
        }
        else if (row.type === "car") {
            const r = Road(row.y);
            row.vehicles.forEach(vehicle => {
                const car = Car(vehicle.initialX, 0, row.direction, vehicle.color);
                // store ref to car object for animation
                vehicle.ref = car;
                r.add(car);
            });
            map.add(r);
        }
        else if (row.type === "truck") {
            const r = Road(row.y);
            row.vehicles.forEach(vehicle => {
                const truck = Truck(vehicle.initialX, 0, row.direction, vehicle.color);
                vehicle.ref = truck;
                r.add(truck);
            });
            map.add(r);
        }
    });
    
}