import * as THREE from 'three';

export class ClickHandler {
    constructor(camera, scene, renderer, light) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.ambientLight = light;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Touch tracking for better mobile experience
        this.touchStartTime = 0;
        this.touchStartPosition = { x: 0, y: 0 };
        this.maxTapDuration = 300; // Max time for a tap (ms)
        this.maxTapDistance = 10; // Max movement for a tap (pixels)
        
        // Define available skybox sets
        this.skyboxSets = {
            day: [
                './Day_Left.png',
                './Day_Right.png', 
                './Day_Front.png',
                './Day_Back.png',
                './Day_Top.png',
                './Day_Bottom.png'
            ],
            night: [
                './Night_Left.png',
                './Night_Right.png', 
                './Night_Front.png',
                './Night_Back.png',
                './Night_Top.png',
                './Night_Bottom.png'
            ]
        };
        
        // Track current skybox state (starts with day since that's what main.js loads)
        this.currentSkybox = 'day';
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Mouse events for desktop
        this.renderer.domElement.addEventListener('click', this.onClick.bind(this));
        this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
        
        // Touch events for mobile
        this.renderer.domElement.addEventListener('touchstart', this.onTouchStart.bind(this));
        this.renderer.domElement.addEventListener('touchend', this.onTouchEnd.bind(this));
        this.renderer.domElement.addEventListener('touchmove', this.onTouchMove.bind(this));
    }
    
    onClick(event) {
        event.preventDefault();
        this.handlePointerEvent(event.clientX, event.clientY);
    }
    
    onTouchStart(event) {
        // Track touch start for tap detection
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            this.touchStartTime = Date.now();
            this.touchStartPosition.x = touch.clientX;
            this.touchStartPosition.y = touch.clientY;
        }
    }
    
    onTouchEnd(event) {
        // Only handle single finger taps that are quick and didn't move much
        if (event.changedTouches.length === 1) {
            const touch = event.changedTouches[0];
            const touchDuration = Date.now() - this.touchStartTime;
            const touchDistance = Math.sqrt(
                Math.pow(touch.clientX - this.touchStartPosition.x, 2) +
                Math.pow(touch.clientY - this.touchStartPosition.y, 2)
            );
            
            // Only register as tap if it was quick and didn't move much
            if (touchDuration <= this.maxTapDuration && touchDistance <= this.maxTapDistance) {
                event.preventDefault();
                this.handlePointerEvent(touch.clientX, touch.clientY);
            }
        }
    }
    
    handlePointerEvent(clientX, clientY) {
        // Calculate pointer position in normalized device coordinates
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
        
        // Update the raycaster with camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Calculate objects intersecting the ray
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        for (let intersect of intersects) {
            const object = intersect.object;
            
            // Check if object or its parent has clickable userData
            if (this.isClickable(object)) {
                const action = this.getClickableAction(object);
                
                if (action.type === 'url' && action.url) {
                    console.log('Opening URL:', action.url);
                    window.open(action.url, '_blank');
                    return;
                } else if (action.type === 'background' && action.skybox) {
                    console.log('Changing background to:', action.skybox);
                    this.changeSkybox(action.skybox);
                    return;
                } else if (action.type === 'toggle-skybox') {
                    console.log('Toggling skybox');
                    this.toggleSkybox();
                    return;
                }
            }
        }
    }
    
    onMouseMove(event) {
        this.handlePointerMove(event.clientX, event.clientY);
    }
    
    onTouchMove(event) {
        // Only handle single finger for hover effects
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            this.handlePointerMove(touch.clientX, touch.clientY);
        }
    }
    
    handlePointerMove(clientX, clientY) {
        // Optional: Change cursor when hovering over clickable objects
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
        
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
    
    getClickableAction(object) {
        // Check object itself
        if (object.userData?.clickable) {
            if (object.userData.url) {
                return { type: 'url', url: object.userData.url };
            } else if (object.userData.skybox) {
                return { type: 'background', skybox: object.userData.skybox };
            } else if (object.userData.toggleSkybox) {
                return { type: 'toggle-skybox' };
            }
        }
        
        // Check parent objects up the hierarchy
        let parent = object.parent;
        while (parent) {
            if (parent.userData?.clickable) {
                if (parent.userData.url) {
                    return { type: 'url', url: parent.userData.url };
                } else if (parent.userData.skybox) {
                    return { type: 'background', skybox: parent.userData.skybox };
                } else if (parent.userData.toggleSkybox) {
                    return { type: 'toggle-skybox' };
                }
            }
            parent = parent.parent;
        }
        
        return { type: null };
    }
    
    changeSkybox(skyboxName) {
        if (!this.skyboxSets[skyboxName]) {
            console.warn('Skybox set not found:', skyboxName);
            return;
        }
        
        const loader = new THREE.CubeTextureLoader();
        loader.load(this.skyboxSets[skyboxName], (texture) => {
            this.scene.background = texture;
            this.currentSkybox = skyboxName;
            console.log('Skybox changed to:', skyboxName);
        }, undefined, (error) => {
            console.error('Error loading skybox:', error);
        });
    }
    
    toggleSkybox() {
        const nextSkybox = this.currentSkybox === 'day' ? 'night' : 'day';
        if (nextSkybox === "day") {
            this.ambientLight.intensity = 1; 
        } else {
            this.ambientLight.intensity = 0.25; 
        }
        this.changeSkybox(nextSkybox);
    }

    getClickableUrl(object) {
        // Keep this method for backward compatibility
        const action = this.getClickableAction(object);
        return action.type === 'url' ? action.url : null;
    }
}
