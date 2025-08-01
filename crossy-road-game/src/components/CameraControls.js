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
        
        // Mobile pinch zoom properties
        this.isPinching = false;
        this.previousPinchDistance = 0;
        this.pinchZoomSpeed = 0.5; // Sensitivity for pinch zoom
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Mouse events for PC
        this.canvas.addEventListener('mousedown', this.onPointerDown.bind(this)); // binds clicking to the onPointerDown method
        this.canvas.addEventListener('mousemove', this.onPointerMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onPointerUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.onPointerUp.bind(this));
        
        // Touch events for mobile
        // passive = false: prevent double tap zoom in
        this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        this.canvas.addEventListener('touchend', this.onPointerUp.bind(this), { passive: false });
        
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
        this.isPinching = false;
    }
    
    onTouchStart(event) {
        // Filter touches to only count those on the canvas (not on UI buttons)
        const canvasTouches = this.getCanvasTouches(event.touches);
        
        if (canvasTouches.length === 1) {
            // Single finger on canvas - rotation
            this.isRotating = true;
            this.isPinching = false;
            this.previousPointer = {
                x: canvasTouches[0].clientX,
                y: canvasTouches[0].clientY
            };
        } else if (canvasTouches.length === 2) {
            // Two fingers on canvas - pinch zoom
            this.isRotating = false;
            this.isPinching = true;
            this.previousPinchDistance = this.getTouchDistance(canvasTouches[0], canvasTouches[1]);
        } else {
            // No valid canvas touches or more than 2 - disable camera controls
            this.isRotating = false;
            this.isPinching = false;
        }
        
        // Only prevent default if touches are on canvas
        if (canvasTouches.length > 0) {
            event.preventDefault();
        }
    }

    onTouchMove(event) {
        // Filter touches to only count those on the canvas
        const canvasTouches = this.getCanvasTouches(event.touches);
        
        if (canvasTouches.length === 1 && this.isRotating && !this.isPinching) {
            // Single finger rotation on canvas
            const currentPointer = {
                x: canvasTouches[0].clientX,
                y: canvasTouches[0].clientY
            };
            this.updateRotation(currentPointer);
        } else if (canvasTouches.length === 2 && this.isPinching) {
            // Two finger pinch zoom on canvas
            const currentPinchDistance = this.getTouchDistance(canvasTouches[0], canvasTouches[1]);
            const pinchDelta = currentPinchDistance - this.previousPinchDistance;
            
            // Update camera distance based on pinch
            this.camera.userData.distance -= pinchDelta * this.pinchZoomSpeed;
            
            // Clamp distance to min/max values
            this.camera.userData.distance = Math.max(
                this.minDistance,
                Math.min(this.maxDistance, this.camera.userData.distance)
            );
            
            // Update camera position with new distance
            updateCameraPosition(this.camera);
            
            this.previousPinchDistance = currentPinchDistance;
        }
        
        // Only prevent default if touches are on canvas
        if (canvasTouches.length > 0) {
            event.preventDefault();
        }
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
    
    // Helper function to calculate distance between two touch points
    getTouchDistance(touch1, touch2) {
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // Helper function to filter touches that are on the canvas (not on UI buttons)
    getCanvasTouches(touches) {
        const canvasTouches = [];
        const controlButtonIds = ['forward', 'backward', 'left', 'right', 'greeting'];
        
        for (let touch of touches) {
            // Get the element at the touch position
            const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY);
            
            // Check if the touch is on a control button or its child elements
            const isOnControlButton = elementAtPoint && (
                controlButtonIds.includes(elementAtPoint.id) ||
                controlButtonIds.includes(elementAtPoint.parentElement?.id) ||
                elementAtPoint.closest('#controls') ||
                elementAtPoint.closest('#greeting')
            );
            
            // Only include touches that are NOT on control buttons
            if (!isOnControlButton) {
                canvasTouches.push(touch);
            }
        }
        
        return canvasTouches;
    }

}
