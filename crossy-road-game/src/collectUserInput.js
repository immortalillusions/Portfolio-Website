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

// Button event handlers - Support both mouse and touch events
// Forward button
document.getElementById('forward').addEventListener('mousedown', () => {
    buttonsPressed.forward = true;
});
document.getElementById('forward').addEventListener('mouseup', () => {
    buttonsPressed.forward = false;
});
document.getElementById('forward').addEventListener('mouseleave', () => {
    buttonsPressed.forward = false;
});
// Touch events for mobile
document.getElementById('forward').addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent scrolling
    buttonsPressed.forward = true;
});
document.getElementById('forward').addEventListener('touchend', (e) => {
    e.preventDefault();
    buttonsPressed.forward = false;
});

// Backward button
document.getElementById('backward').addEventListener('mousedown', () => {
    buttonsPressed.backward = true;
});
document.getElementById('backward').addEventListener('mouseup', () => {
    buttonsPressed.backward = false;
});
document.getElementById('backward').addEventListener('mouseleave', () => {
    buttonsPressed.backward = false;
});
// Touch events for mobile
document.getElementById('backward').addEventListener('touchstart', (e) => {
    e.preventDefault();
    buttonsPressed.backward = true;
});
document.getElementById('backward').addEventListener('touchend', (e) => {
    e.preventDefault();
    buttonsPressed.backward = false;
});

// Left button
document.getElementById('left').addEventListener('mousedown', () => {
    buttonsPressed.left = true;
});
document.getElementById('left').addEventListener('mouseup', () => {
    buttonsPressed.left = false;
});
document.getElementById('left').addEventListener('mouseleave', () => {
    buttonsPressed.left = false;
});
// Touch events for mobile
document.getElementById('left').addEventListener('touchstart', (e) => {
    e.preventDefault();
    buttonsPressed.left = true;
});
document.getElementById('left').addEventListener('touchend', (e) => {
    e.preventDefault();
    buttonsPressed.left = false;
});

// Right button
document.getElementById('right').addEventListener('mousedown', () => {
    buttonsPressed.right = true;
});
document.getElementById('right').addEventListener('mouseup', () => {
    buttonsPressed.right = false;
});
document.getElementById('right').addEventListener('mouseleave', () => {
    buttonsPressed.right = false;
});
// Touch events for mobile
document.getElementById('right').addEventListener('touchstart', (e) => {
    e.preventDefault();
    buttonsPressed.right = true;
});
document.getElementById('right').addEventListener('touchend', (e) => {
    e.preventDefault();
    buttonsPressed.right = false;
});

// Keyboard event handlers
// MUST QUEUE immediately on keydown (this was causing a movement lag)
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            event.preventDefault();
            keysPressed.forward = true;
            queueMove("forward"); // Immediate queue on keydown
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            event.preventDefault();
            keysPressed.backward = true;
            queueMove("backward"); // Immediate queue on keydown
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            event.preventDefault();
            keysPressed.left = true;
            queueMove("left"); // Immediate queue on keydown
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            event.preventDefault();
            keysPressed.right = true;
            queueMove("right"); // Immediate queue on keydown
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

// Prevent default touch behaviors on control buttons to improve mobile experience
document.addEventListener('DOMContentLoaded', () => {
    const controlButtons = ['forward', 'backward', 'left', 'right'];
    controlButtons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            // Prevent context menu on long press
            button.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            });
            
            // Prevent text selection
            button.style.userSelect = 'none';
            button.style.webkitUserSelect = 'none';
            
            // Add touch-action to prevent scrolling
            button.style.touchAction = 'manipulation';
        }
    });
});

// Prevent page scrolling when touching control areas on mobile
document.addEventListener('touchmove', (e) => {
    // Only prevent if touching a control button
    if (e.target && ['forward', 'backward', 'left', 'right'].includes(e.target.id)) {
        e.preventDefault();
    }
}, { passive: false });