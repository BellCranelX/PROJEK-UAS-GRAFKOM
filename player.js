import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

export class Player {
    constructor(camera, controller, scene, speed) {
        this.camera = camera;
        this.controller = controller;
        this.scene = scene;
        this.speed = speed;

        // Load FBX model
        const loader1 = new FBXLoader();
        loader1.load('resource/Remy.fbx', (object) => {
            console.log('Model loaded successfully:', object); // Added console log
            this.model = object;
            this.model.castShadow = true;
            this.model.receiveShadow = true;
            this.scene.add(this.model);

            // Position and scale the model as needed
            this.model.position.set(0, 0, 0); // Set position
            this.model.scale.set(0.01, 0.01, 0.01); // Scale the model

            // Initialize animations if needed
            this.mixer = new THREE.AnimationMixer(this.model);
            const action = this.mixer.clipAction(this.model.animations[0]);
            action.play();
        }, undefined, (error) => {
            console.error('Error loading model:', error); // Added console log
        });
    }

    update(dt) {
        // Handle player movement based on controller input
        var direction = new THREE.Vector3(0, 0, 0);
        if (this.controller.keys['forward']) {
            direction.x = 1;
        }
        if (this.controller.keys['backward']) {
            direction.x = -1;
        }
        if (this.controller.keys['left']) {
            direction.z = -1;
        }
        if (this.controller.keys['right']) {
            direction.z = 1;
        }
        if (this.model) { // Check if model is defined before accessing properties
            this.model.position.add(direction.multiplyScalar(dt * this.speed));
            this.camera.setUp(this.model.position);
        }

        // Update animations if needed
        if (this.mixer) {
            this.mixer.update(dt);
        }
    }
}

export class Environment {
    constructor(scene) {
        this.scene = scene;
        this.loadedModel = null; // Track the loaded model
    }

    loadModel(modelPath, position, scale) {
        const loader = new FBXLoader();
        loader.load(modelPath, (object) => {
            console.log('Model loaded successfully:', object);
            object.castShadow = true;
            object.receiveShadow = true;
            object.position.copy(position); // Set position
            object.scale.set(scale, scale, scale); // Set scale
            this.scene.add(object);
            this.loadedModel = object; // Store the loaded model
        }, undefined, (error) => {
            console.error('Error loading model:', error);
        });
    }

    unloadModel() {
        if (this.loadedModel) {
            this.scene.remove(this.loadedModel); // Remove the model from the scene
            this.loadedModel = null; // Reset loaded model reference
            console.log('Model unloaded successfully.');
        } else {
            console.warn('No model loaded to unload.');
        }
    }
}

export class PlayerController {
    constructor() {
        this.keys = {
            "forward": false,
            "backward": false,
            "left": false,
            "right": false,
        };
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    }
    onKeyDown(event) {
        switch (event.key) {
            case 'w':
                this.keys.forward = true;
                break;
            case 's':
                this.keys.backward = true;
                break;
            case 'a':
                this.keys.left = true;
                break;
            case 'd':
                this.keys.right = true;
                break;
        }
    }
    onKeyUp(event) {
        switch (event.key) {
            case 'W':
            case 'w':
                this.keys.forward = false;
                break;
            case 'S':
            case 's':
                this.keys.backward = false;
                break;
            case 'A':
            case 'a':
                this.keys.left = false;
                break;
            case 'D':
            case 'd':
                this.keys.right = false;
                break;
        }
    }
}

export class ThirdPersonCamera {
    constructor(camera, positionOffset, targetOffset) {
        this.camera = camera;
        this.positionOffset = positionOffset;
        this.targetOffset = targetOffset;
    }
    setUp(target) {
        var temp = new THREE.Vector3();
        temp.addVectors(target, this.positionOffset);
        this.camera.position.copy(temp);
        temp = new THREE.Vector3();
        temp.addVectors(target, this.targetOffset);
        this.camera.lookAt(temp);
    }
}
