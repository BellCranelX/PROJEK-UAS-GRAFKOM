import * as THREE from 'three';
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';

export class Environment {
    constructor(scene, physics) {
        this.scene = scene;
        this.physics = physics; // Add reference to physics world
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
            this.scene.add(object); // Add the model to the scene
            this.loadedModel = object; // Store the loaded model

            // Create physics body for the model
            this.createPhysicsBody(object);
        }, undefined, (error) => {
            console.error('Error loading model:', error);
        });
    }
}