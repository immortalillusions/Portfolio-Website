import * as THREE from 'three';

export class ClickHandler {
    constructor(camera, scene, renderer, light) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.ambientLight = light;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
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
