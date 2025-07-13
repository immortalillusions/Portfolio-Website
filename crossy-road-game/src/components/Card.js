import * as THREE from 'three';
import { setShadowsRecursively } from '../constants';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

export function Card(x, y, rightText = "Main Experience", bottomLeftText = "Additional Info") {
    const card = new THREE.Group();
    card.position.x = x;
    card.position.y = y;

    const cardWidth = 200;
    const cardHeight = 150;
    const cardThickness = 2;
    const borderThickness = 10;

    // Main card base (slightly below ground for layering)
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(cardWidth, cardHeight, cardThickness),
        new THREE.MeshLambertMaterial({
            color: 0xf5f5f5, // light gray background
            flatShading: true
        })
    );
    base.position.z = cardThickness / 2;
    card.add(base);

    // Right section border (add border first, then section on top)
    const rightBorder = new THREE.Mesh(
        new THREE.BoxGeometry(cardWidth / 2, cardHeight, cardThickness + 1),
        new THREE.MeshLambertMaterial({
            color: 0x2c3e50, // dark border
            flatShading: true
        })
    );
    rightBorder.position.x = cardWidth / 4;
    rightBorder.position.z = cardThickness;
    card.add(rightBorder);

    // Right section (text area) - takes up right half
    const rightSection = new THREE.Mesh(
        new THREE.BoxGeometry(cardWidth / 2 - borderThickness, cardHeight - borderThickness * 2, cardThickness + 1.5),
        new THREE.MeshLambertMaterial({
            color: 0xe8f4f8, // light blue
            flatShading: true
        })
    );
    rightSection.position.x = cardWidth / 4;
    rightSection.position.z = cardThickness + 0.75;
    card.add(rightSection);

    // Top-left section border (add border first)
    const topLeftBorder = new THREE.Mesh(
        new THREE.BoxGeometry(cardWidth / 2, cardHeight / 2, cardThickness + 1),
        new THREE.MeshLambertMaterial({
            color: 0x8e44ad, // purple border
            flatShading: true
        })
    );
    topLeftBorder.position.x = -cardWidth / 4;
    topLeftBorder.position.y = cardHeight / 4;
    topLeftBorder.position.z = cardThickness;
    card.add(topLeftBorder);

    // Top-left section (object area) - takes up top-left quarter
    const topLeftSection = new THREE.Mesh(
        new THREE.BoxGeometry(cardWidth / 2 - borderThickness, cardHeight / 2 - borderThickness, cardThickness + 1.5),
        new THREE.MeshLambertMaterial({
            color: 0xf8e8e8, // light pink
            flatShading: true
        })
    );
    topLeftSection.position.x = -cardWidth / 4;
    topLeftSection.position.y = cardHeight / 4;
    topLeftSection.position.z = cardThickness + 0.75;
    card.add(topLeftSection);

    // Bottom-left section border (add border first)
    const bottomLeftBorder = new THREE.Mesh(
        new THREE.BoxGeometry(cardWidth / 2, cardHeight / 2, cardThickness + 1),
        new THREE.MeshLambertMaterial({
            color: 0x27ae60, // green border
            flatShading: true
        })
    );
    bottomLeftBorder.position.x = -cardWidth / 4;
    bottomLeftBorder.position.y = -cardHeight / 4;
    bottomLeftBorder.position.z = cardThickness;
    card.add(bottomLeftBorder);

    // Bottom-left section (text area) - takes up bottom-left quarter
    const bottomLeftSection = new THREE.Mesh(
        new THREE.BoxGeometry(cardWidth / 2 - borderThickness, cardHeight / 2 - borderThickness, cardThickness + 1.5),
        new THREE.MeshLambertMaterial({
            color: 0xe8f8e8, // light green
            flatShading: true
        })
    );
    bottomLeftSection.position.x = -cardWidth / 4;
    bottomLeftSection.position.y = -cardHeight / 4;
    bottomLeftSection.position.z = cardThickness + 0.75;
    card.add(bottomLeftSection);

    // Add text placeholders to sections
    addText(bottomLeftText, bottomLeftSection);
    addText(rightText, rightSection);

    // Store metadata for text content
    card.userData = {
        type: 'experience-card',
        rightText: rightText,
        bottomLeftText: bottomLeftText,
        sections: {
            right: rightSection,
            topLeft: topLeftSection,
            bottomLeft: bottomLeftSection
        }
    };

    setShadowsRecursively(card, true, true);
    return card;
}

// Helper function to create text using TextGeometry
function addText(text, section) {
    const fontLoader = new FontLoader();
    fontLoader.load(
      'node_modules/three/examples/fonts/droid/droid_serif_regular.typeface.json',
      (droidFont) => {
        const textGeometry = new TextGeometry(text, {
          size: 10,
          height: 4,
          font: droidFont,
        });
        const textMaterial = new THREE.MeshNormalMaterial();
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.x = -45;
        textMesh.position.y = 0;
        section.add(textMesh);
      }
    );
    
}
