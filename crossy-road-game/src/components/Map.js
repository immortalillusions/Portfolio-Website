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
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ModelIcon } from './ModelIcon.js';
const gloader = new GLTFLoader(); // create loader

// load the icons


// initial metadata: need to add cards / initial items to a metadata
// also because we need to calculate hit bounds

// CONVERT METADATA TO MAP FOR THE FUNCTION ENDSUPINVALIDPOSITION
// SO WE ONLY HAVE TO CHECK ROWS WITH THE SAME INDEX
// AND NOT ITERATE THROUGH ALL ROWS WHICH CAN GROW A LOT IF USER PLAYS FOR A LONG TIME
// note: this only works if y is in discrete increments of tileSize

export const metadata = new Map();

export const otherObjects = new Map([
    [-11 * tileSize, [{
        type: "forest",
        trees: [
            {x: -3 * tileSize, height: 70},
            {x: 3 * tileSize, height: 20},
        ],
        y: -11 * tileSize
    }]],
    
    [-5 * tileSize, [{
        type: "forest",
        trees: [
            {x: 2 * tileSize, height: 40},
            {x: 0 * tileSize, height: 20}
        ],
        y: -5 * tileSize
    }]],
    [-20 * tileSize, [{
        type: "forest",
        trees: [
            {x: -2 * tileSize, height: 60},
            {x: 1 * tileSize, height: 30}
        ],
        y: -20 * tileSize
    }]],
    [-13*tileSize, [{
        type: "model",
        path: '/models/Rayquaza/scene.gltf',
        x: -3*tileSize, 
        z: 0,
        rx: Math.PI/2,
        ry: Math.PI/4,
        rz: 0,
        scale: 20,
        animationIndex: 0, 
        // width, height useful for checking for bounds
        width: 50,
        height: 50,
        y: -13*tileSize
    }]],
    [-7 * tileSize, [
        {
            type: "card",
            card: {
                x: 8 * tileSize,
                cardWidth: 200,
                cardHeight: 150,
                icon: ModelIcon(gloader,'/icons/ghost_w_tophat/scene.gltf', 15, 20, Math.PI/2),
                url_link: "https://devpost.com/software/lil-ghost",
                frontText: "LIL GHOST\nSmart Home\nSystem",
                rightText: "Implemented an\nArduino\nprototype and\nwebsite that\nuses gestures\nto control\ndevices from a\ndistance,\nsuch as turning\non lights (LED)\nand adjusting\ntemperature\n(LCD) with the\nflick of a\nwrist ",
                bottomLeftText: "Arduino\nESP32\nIMU\nRedis\nReact.js\nC++",
                rotation: [0,0, -Math.PI/2]
            },
            y: -7 * tileSize
        },
        {
            type: "card",
            card: {
                x: -8 * tileSize,
                cardWidth: 200,
                cardHeight: 150,
                icon: ModelIcon(gloader,'/icons/coins_and_money/scene.gltf', 15, 20, Math.PI/2, Math.PI),
                url_link: "https://www.altas.com/",
                frontText: "Altas Partners\n($10B Private\nEquity Fund)",
                rightText: "Analyze multi\nbillion-dollar\ncompanies,\nattend board\nmeetings, &\ncommunicate\nwith management\nas an investor\n\nUse Selenium to\nautomate\nextracting 10K+\ndata points\nand LLM models\nto add insights",
                bottomLeftText: "Private Equity\nAnd Data\nAnalyst Intern",
                rotation: [0,0, Math.PI/2]
            },
            y: -7 * tileSize
        }
    ]],    
    [-14 * tileSize, [
        {
            type: "card",
            card: {
                x: 8 * tileSize,
                cardWidth: 200,
                cardHeight: 150,
                icon: ModelIcon(gloader,'/icons/brain_hologram/scene.gltf', 5, 5, Math.PI/2),
                url_link: "https://www.kaggle.com/code/qwertycake/brain-tumour-classifier",
                frontText: "BRAIN TUMOUR\nDETECTION\nRESEARCH\nUnder Head of \nAI of Western",
                rightText: "Optimized\nconvolutional\nneural network\nin detecting\ntumours with\naccuracy of 92%\nby analyzing 3 \nhyperparameters\nusing a grid\nsearch",
                bottomLeftText: "PyTorch\nTensorFlow\nPandas\nKaggle",
                rotation: [0,0, -Math.PI/2]
            },
            y: -14 * tileSize
        },
        {
            type: "card",
            card: {
                x: -8 * tileSize,
                cardWidth: 200,
                cardHeight: 150,
                icon: ModelIcon(gloader,'/icons/robot/scene.gltf', 30, 100, Math.PI/2, Math.PI),
                url_link: "https://devfortress.com/",
                frontText: "DevFortress",
                rightText: "Automated asset\ngeneration\nfor Google Meet\nextension\nwith 600K+\nusers using\nGemini &\nNode.js,\nsaving 90% time ",
                bottomLeftText: "Backend\nSoftware\nEngineer\Intern",
                rotation: [0,0, Math.PI/2]
            },
            y: -14 * tileSize
        }
    ]],

    [-21 * tileSize, [
        {
            type: "card",
            card: {
                x: 8 * tileSize,
                cardWidth: 200,
                cardHeight: 150,
                icon: Pokeball(),
                url_link: "https://pokiguess.vercel.app/login",
                frontText: "POKIGUESS\nGuess and catch\nPokemon!",
                rightText: "Built a\nguessing game\nwhere users\nidentify\nsilhouettes\nto catch\nPokemon,\nfeaturing fun\nfacts and\nofficial\nin-game sounds",
                bottomLeftText: "Next.js\nHTML\nTailwind CSS\nFramer Motion\nPostgreSQL",
                rotation: [0,0, -Math.PI/2]
            },
            y: -21 * tileSize
        },
        {
            type: "card",
            card: {
                x: -8 * tileSize,
                cardWidth: 200,
                cardHeight: 150,
                icon: ModelIcon(gloader,'/icons/graph/scene.gltf', 15, 10, Math.PI/2, Math.PI),
                url_link: "https://www.cppinvestments.com/",
                frontText: "Canadian\nPension Plan\nInvestment\nBoard\n($632B Fund)",
                rightText: "Developed\nanalytics\npipelines to\noptimize\nportfolio\nconstruction\n\nAutomated 150+\nrisk analytics\nusing Pandas\nand Matplotlib",
                bottomLeftText: "Quantitative\nDeveloper\nIntern\n(Portfolio\nDesign and\nConstruction)",
                rotation: [0,0, Math.PI/2]
            },
            y: -21 * tileSize
        }
    ]],
    [-22 * tileSize, [{
        type: "sign",
        sign: {
            x: 1 * tileSize,
            width: 150,
            height: 50,
            text: "Welcome :D\nLet's start by \nmoving your camera down\nHold and drag!",
            color: 0xf8e8e8,
            vertical: 10,
            horizontal: -60,
        },
        y: -22 * tileSize
    }]],
    [-10 * tileSize, [{
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
        y: -10 * tileSize
    },
    {
        type: "model",
        path: '/models/roblox/Roblox.gltf',
        x: 70, 
        z: 0,
        rx: Math.PI/2,
        ry: -Math.PI/4,
        rz: 0,
        scale: 50,
        animationIndex: 14, // there's 16 animations in total
        // width, height useful for checking for bounds
        width: 50,
        height: 50,
        y: -10*tileSize
    },
    {
        type: "model",
        path: '/models/roblox/Roblox.gltf',
        x: 20, 
        z: 0,
        rx: Math.PI/2,
        ry: Math.PI/4,
        rz: 0,
        scale: 50,
        animationIndex: 13, // there's 16 animations in total
        // width, height useful for checking for bounds
        width: 50,
        height: 50,
        y: -10*tileSize
    }]],
    [-23*tileSize, [{
        type: "model",
        path: '/models/Regigigas.gltf',
        x: -70, 
        z: 0,
        rx: Math.PI/2,
        ry: Math.PI,
        rz: 0,
        scale: 10,
        animationIndex: 0, 
        // width, height useful for checking for bounds
        width: 50,
        height: 50,
        y: -23*tileSize
    },
    {
        type: "model",
        path: '/models/roblox/Roblox.gltf',
        x: 130, 
        z: 0,
        rx: Math.PI/2,
        ry: -Math.PI/4,
        rz: 0,
        scale: 50,
        animationIndex: 15, // there's 16 animations in total
        // width, height useful for checking for bounds
        width: 50,
        height: 50,
        y: -23*tileSize
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

// Export array of mixers for animation updates
export let modelMixers = [];

// Array of references to models
export let models = [];

export function initializeMap(){
    // Clear the map completely (allows completely newly regenerated random map)
    map.clear();
    // Clear metadata
    metadata.clear();
    // Reset mixers array
    modelMixers = [];
    models = [];
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
    // play with models
    
   // loadModel(gloader, '/models/Regigigas.gltf', -50, -43*tileSize, 0, Math.PI/2, Math.PI, 0, 10);
    // Items that I can walk through
    addText("Nice! Now you can\nmove your camera.\nUse WASD/buttons to explore!"+
        "\n<- Experiences"+
        "\n-> Projects"+
        "\nOr go forward to find\nthe hidden game!", map, -23.5*tileSize)

    addText("<---------\nExperiences\nClick the icons\nfor more info!", map, -24*tileSize, -150)
    addText("--------->\nProjects\nClick the icons\nfor more info!", map, -24*tileSize, 150)
}


function loadModel(loader, path, x, y, z, rx, ry, rz, scale, animationIndex = 0){
    // Load a glTF resource
    // happens asynchronously so can't edit position outside of this function
    loader.load(
        // resource URL
        path,
        // called when the resource is loaded
        function ( gltf ) {
        const ref = gltf.scene
        const animation = gltf.animations;
        const mixer = new THREE.AnimationMixer(gltf.scene);
        modelMixers.push(mixer); // Add to mixers array
        
        // Use specified animation index, or default to 0 if out of bounds
        const selectedAnimationIndex = Math.min(animationIndex, animation.length - 1);
        const action = mixer.clipAction(animation[selectedAnimationIndex]); // play the specified animation
        
        ref.position.set(x, y, z); // set position
        ref.scale.set(scale, scale, scale); // Scale the model up
        ref.rotation.x = rx; 
        ref.rotation.y = ry;
        ref.rotation.z = rz;
        
        // Add light and helper to the scene in world coordinates
        // Point light is measured in candles so need a very big number
        const light = new THREE.PointLight(0xffffff, 7500, 2000);         
        light.position.set(x, y, z + 70); // World position: above the model in Z
        
        // const helper = new THREE.PointLightHelper(light, 50, 0xff0000); // Red helper for visibility
        
        // Add to the map (scene) instead of the model (bc when i scale model, that messes with the coordinates for its children too)
        map.add(light);
        // map.add(helper);

        map.add( gltf.scene );
        models.push(ref);
        action.play();
    },);
}

export function populateRows(data) {
    // Add the rows to the map
    for (const [y, objectsAtY] of data) {
        for (const object of objectsAtY) {
            const y = object.y
            if (object.type === "card") {
                const card = Card(object.card.x, y, object.card.cardWidth, object.card.cardHeight, object.card.icon, object.card.url_link, object.card.frontText, object.card.rightText, object.card.bottomLeftText, object.card.rotation);
                map.add(card);
                object.ref = card;
            }
            else if (object.type === "sign") {
                const sign = Sign(object.sign.x, y, object.sign.width, object.sign.height, object.sign.text, object.sign.color, object.sign.vertical, object.sign.horizontal, object.sign.skybox, object.sign.toggleSkybox);
                map.add(sign);
                object.ref = sign;
            } else if (object.type === "model") {
                loadModel(gloader, object.path, object.x, object.y, object.z, object.rx, object.ry, object.rz, object.scale, object.animationIndex || 0);
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
