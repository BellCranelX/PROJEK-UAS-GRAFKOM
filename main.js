import * as THREE from 'three';
import { Player, PlayerController, ThirdPersonCamera } from './player.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

let mixer;

class Main {
    static init() {
        var canvasReference = document.getElementById('canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: canvasReference
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000);
        this.renderer.shadowMap.enabled = true;

        // Plane
        var Plane = new THREE.Mesh(
            new THREE.PlaneGeometry(40, 40),
            new THREE.MeshPhongMaterial({ color: 0x555555, side: THREE.DoubleSide })
        );
        this.scene.add(Plane);
        Plane.rotation.x = -Math.PI / 2;
        Plane.receiveShadow = true;
        Plane.castShadow = true;

        // Directional Light
        var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(3, 10, 10);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Create player controller
        this.playerController = new PlayerController();

        // Load FBX Model
        const loader = new FBXLoader();
        loader.load('Remy.fbx', (object) => {
            mixer = new THREE.AnimationMixer(object);

            const action = mixer.clipAction(object.animations[0]);
            action.play();

            object.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            object.scale.set(0.01, 0.01, 0.01);

            this.scene.add(object);
            this.player = new Player(
                new ThirdPersonCamera(this.camera, new THREE.Vector3(-5, 5, 0), new THREE.Vector3(0, 0, 0)),
                this.playerController, // Pass player controller to Player
                this.scene,
                10
            );
        }, undefined, (error) => {
            console.error(error);
        });

        var thirdPersonCamera = new ThirdPersonCamera(this.camera, new THREE.Vector3(-5, 5, 0), new THREE.Vector3(0, 0, 0));
        thirdPersonCamera.setUp(new THREE.Vector3(0, 0, 0));

        // Initialize clock
        this.clock = new THREE.Clock();

        this.animate();
    }

    static render(dt) {
        if (this.player) {
            this.player.update(dt); // Update player based on controller input
        }
        this.renderer.render(this.scene, this.camera);
    }

    static animate = () => {
        requestAnimationFrame(this.animate);
        this.render(this.clock.getDelta());
    }

    static unloadModel() {
        if (this.loadedObject) {
            // Traverse and dispose of all geometries and materials
            this.loadedObject.traverse((child) => {
                if (child.isMesh) {
                    child.geometry.dispose();

                    if (Array.isArray(child.material)) {
                        child.material.forEach((material) => material.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });

            // Remove the object from the scene
            this.scene.remove(this.loadedObject);
            this.loadedObject = null;
        }
    }
}

Main.init();

// Call this function to unload the model
function unloadModel() {
    Main.unloadModel();
}

