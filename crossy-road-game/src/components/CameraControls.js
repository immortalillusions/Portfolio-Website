import { updateCameraPosition } from './Camera.js';

export class CameraControls {
    constructor(camera, canvas) {
        this.camera = camera;
        this.canvas = canvas;
        this.isRotating = false;
        this.previousPointer = { x: 0, y: 0 };
        this.rotationSpeed = 0.005;
        this.zoomSpeed = 30; // How much to zoom per scroll
        this.minDistance = 100; // Minimum zoom distance
        this.maxDistance = 300; // Maximum zoom distance
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Mouse events for PC
        this.canvas.addEventListener('mousedown', this.onPointerDown.bind(this)); // binds clicking to the onPointerDown method
        this.canvas.addEventListener('mousemove', this.onPointerMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onPointerUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.onPointerUp.bind(this));
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.onPointerUp.bind(this));
        
        // Mouse wheel for zooming
        this.canvas.addEventListener('wheel', this.onWheel.bind(this));
        
        // Prevent context menu on right click
        //this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    // click (left / right)
    onPointerDown(event) {
        this.isRotating = true;
        this.previousPointer = {
            x: event.clientX,
            y: event.clientY
        };
    }
    // if clicking right now, then rotate
    onPointerMove(event) {
        if (!this.isRotating) return;
        
        const currentPointer = {
            x: event.clientX,
            y: event.clientY
        };
        
        this.updateRotation(currentPointer);
        event.preventDefault();
    }
    // no longer rotating / clicking / touching (for mobile too)
    onPointerUp() {
        this.isRotating = false;
    }
    
    onTouchStart(event) {
        if (event.touches.length === 1) {
            this.isRotating = true;
            this.previousPointer = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            };
        }
        event.preventDefault();
    }

    onTouchMove(event) {
        if (!this.isRotating || event.touches.length !== 1) return;
        
        const currentPointer = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
        
        this.updateRotation(currentPointer);
        event.preventDefault();
    }
    
    onWheel(event) {
        event.preventDefault();
        
        // Determine zoom direction
        const zoomDirection = event.deltaY > 0 ? 1 : -1; // Positive = zoom out, negative = zoom in
        
        // Update camera distance
        this.camera.userData.distance += zoomDirection * this.zoomSpeed;
        
        // Clamp distance to min/max values
        this.camera.userData.distance = Math.max(
            this.minDistance,
            Math.min(this.maxDistance, this.camera.userData.distance)
        );
        
        // Update camera position with new distance
        updateCameraPosition(this.camera);
    }
    
    updateRotation(currentPointer) {
        const deltaX = currentPointer.x - this.previousPointer.x;
        const deltaY = currentPointer.y - this.previousPointer.y;
        
        // Update rotation angles (fixed directions)
        this.camera.userData.rotationX -= deltaX * this.rotationSpeed; // Inverted X for natural feel
        this.camera.userData.rotationY += deltaY * this.rotationSpeed; 
        
        // Clamp vertical rotation to prevent flipping
        this.camera.userData.rotationY = Math.max(
            0.1, // Minimum elevation (almost top-down view)
            Math.min(Math.PI * 0.45, this.camera.userData.rotationY) // Maximum elevation (45 degrees)
        );
        
        // Update camera position (target will be set by main animation loop)
        updateCameraPosition(this.camera);
        
        this.previousPointer = currentPointer;
    }
    

}
