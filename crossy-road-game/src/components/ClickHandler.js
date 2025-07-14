import * as THREE from 'three';

export class ClickHandler {
    constructor(camera, scene, renderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.renderer.domElement.addEventListener('click', this.onClick.bind(this));
        this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    }
    
    onClick(event) {
        event.preventDefault();
        
        // Calculate mouse position in normalized device coordinates
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Update the raycaster with camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Calculate objects intersecting the ray
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        for (let intersect of intersects) {
            const object = intersect.object;
            
            // Check if object or its parent has clickable userData
            if (this.isClickable(object)) {
                const url = this.getClickableUrl(object);
                if (url) {
                    console.log('Opening URL:', url);
                    window.open(url, '_blank');
                    return; // Only handle the first clickable object
                }
            }
        }
    }
    
    onMouseMove(event) {
        // Optional: Change cursor when hovering over clickable objects
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        let isOverClickable = false;
        for (let intersect of intersects) {
            if (this.isClickable(intersect.object)) {
                isOverClickable = true;
                break;
            }
        }
        
        // Change cursor style
        this.renderer.domElement.style.cursor = isOverClickable ? 'pointer' : 'default';
    }
    
    isClickable(object) {
        // Check object itself
        if (object.userData?.clickable) return true;
        
        // Check parent objects up the hierarchy
        let parent = object.parent;
        while (parent) {
            if (parent.userData?.clickable) return true;
            parent = parent.parent;
        }
        
        return false;
    }
    
    getClickableUrl(object) {
        // Check object itself
        if (object.userData?.clickable && object.userData?.url) {
            return object.userData.url;
        }
        
        // Check parent objects up the hierarchy
        let parent = object.parent;
        while (parent) {
            if (parent.userData?.clickable && parent.userData?.url) {
                return parent.userData.url;
            }
            parent = parent.parent;
        }
        
        return null;
    }
}
