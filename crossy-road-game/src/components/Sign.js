import * as THREE from 'three';
import { setShadowsRecursively } from '../constants.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

export function Sign(x, y, width, height, text, color, vertical = 5, horizontal = -15, skybox = null, toggleSkybox = false) {
    const sign = new THREE.Group();
    sign.position.y = y;
    sign.position.x = x;
    sign.position.z = 10;

    // Set up clickable userData
    if (toggleSkybox) {
        sign.userData = {
            clickable: true,
            toggleSkybox: true
        };
    // not used right now: but if i want to specify the skybox to change into
    } else if (skybox) {
        sign.userData = {
            clickable: true,
            skybox: skybox
        };
    }

    const post = new THREE.Mesh(
        new THREE.BoxGeometry(25, 5, 10), // width, length, height
        new THREE.MeshLambertMaterial({
            color: color,
        })
    );
    post.position.z = -5;
    sign.add(post);
    const foundation = new THREE.Mesh(
        new THREE.BoxGeometry(width, 5, height), // width, length, depth/height
        new THREE.MeshLambertMaterial({
            color: color,
        })
    );
    foundation.position.z = height/2;
    sign.add(foundation);

    const section = new THREE.Mesh(
        new THREE.BoxGeometry(width - 10, 5, height - 10),
        new THREE.MeshLambertMaterial({
            color: "white", 
            flatShading: true
        })
    );
    section.position.y = -0.75;
    foundation.add(section);

    const fontLoader = new FontLoader();
        fontLoader.load(
          './Press Start 2P_Regular.json',
          (droidFont) => {
            const textGeometry = new TextGeometry(text, {
              size: 4,
              depth: 2,
              font: droidFont,
            });
            const textMaterial = new THREE.MeshLambertMaterial({
                color: 0x333333, // dark gray text
                flatShading: true
            });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.x = horizontal;
            textMesh.position.y = -2; // middle of section
            textMesh.position.z = vertical; 
            textMesh.rotation.x = Math.PI / 2; // Rotate 90 degrees to face forward along Y-axis
            section.add(textMesh);
          }
    );

    setShadowsRecursively(sign, true, true);
    return sign;
}