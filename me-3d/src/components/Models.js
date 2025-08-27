import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader(); // create loader
// Load a glTF resource
// happens asynchronously so can't edit position outside of this function
loader.load(
	// resource URL
	'/models/model.gltf',
	// called when the resource is loaded
	function ( gltf ) {
    pottedPlant = gltf.scene; // set potted plant to gltf scene
		pottedPlant.position.set(-5, -25, 2); // set position of potted plant
    pottedPlant.scale.set(4, 4, 4); // Scale the model to 2x its original size
    scene.add( gltf.scene );
	},
);