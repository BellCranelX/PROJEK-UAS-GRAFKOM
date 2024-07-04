import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class Environment {
    constructor(scene, position = { x: 0, y: 0, z: 0 }) {
        this.scene = scene;
        this.position = position;
        this.loadModel();
    }

    loadModel() {
        const loader = new GLTFLoader();
        loader.setPath('./Environment/');
        loader.load(
            'env.gltf',
            (gltf) => {
                gltf.scene.traverse((child) => {
                    child.castShadow = true;
                    child.receiveShadow = true;
                });
                gltf.scene.position.set(this.position.x, this.position.y, this.position.z);
                this.scene.add(gltf.scene);
            },
            undefined,
            (error) => {
                console.error(error);
            }
        );
    }
}
