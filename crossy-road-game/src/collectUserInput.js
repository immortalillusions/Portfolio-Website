import {queueMove} from './components/Player.js';

// Track which keys are currently pressed
const keysPressed = {
    forward: false,
    backward: false,
    left: false,
    right: false
};

// Track which buttons are currently pressed
const buttonsPressed = {
    forward: false,
    backward: false,
    left: false,
    right: false
};

// Function to continuously queue moves based on current input state
function handleContinuousInput() {
    if (keysPressed.forward || buttonsPressed.forward) {
        queueMove("forward");
    } else if (keysPressed.backward || buttonsPressed.backward) {
        queueMove("backward");
    } else if (keysPressed.left || buttonsPressed.left) {
        queueMove("left");
    } else if (keysPressed.right || buttonsPressed.right) {
        queueMove("right");
    }
}

// Call handleContinuousInput every frame
setInterval(handleContinuousInput, 16); // ~60fps

// Button event handlers
document.getElementById('forward').addEventListener('mousedown', () => {
    buttonsPressed.forward = true;
});
document.getElementById('forward').addEventListener('mouseup', () => {
    buttonsPressed.forward = false;
});
document.getElementById('forward').addEventListener('mouseleave', () => {
    buttonsPressed.forward = false;
});

document.getElementById('backward').addEventListener('mousedown', () => {
    buttonsPressed.backward = true;
});
document.getElementById('backward').addEventListener('mouseup', () => {
    buttonsPressed.backward = false;
});
document.getElementById('backward').addEventListener('mouseleave', () => {
    buttonsPressed.backward = false;
});

document.getElementById('left').addEventListener('mousedown', () => {
    buttonsPressed.left = true;
});
document.getElementById('left').addEventListener('mouseup', () => {
    buttonsPressed.left = false;
});
document.getElementById('left').addEventListener('mouseleave', () => {
    buttonsPressed.left = false;
});

document.getElementById('right').addEventListener('mousedown', () => {
    buttonsPressed.right = true;
});
document.getElementById('right').addEventListener('mouseup', () => {
    buttonsPressed.right = false;
});
document.getElementById('right').addEventListener('mouseleave', () => {
    buttonsPressed.right = false;
});

// Keyboard event handlers
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            event.preventDefault();
            keysPressed.forward = true;
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            event.preventDefault();
            keysPressed.backward = true;
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            event.preventDefault();
            keysPressed.left = true;
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            event.preventDefault();
            keysPressed.right = true;
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            event.preventDefault();
            keysPressed.forward = false;
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            event.preventDefault();
            keysPressed.backward = false;
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            event.preventDefault();
            keysPressed.left = false;
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            event.preventDefault();
            keysPressed.right = false;
            break;
    }
});

// Handle window focus loss to reset all keys
window.addEventListener('blur', () => {
    Object.keys(keysPressed).forEach(key => keysPressed[key] = false);
    Object.keys(buttonsPressed).forEach(key => buttonsPressed[key] = false);
});