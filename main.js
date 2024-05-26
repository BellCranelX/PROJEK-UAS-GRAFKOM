import * as THREE from 'three';
import {  Player, Environment, PlayerController, ThirdPersonCamera } from './player.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

class Main {
    static init() {
        var canvasReference = document.getElementById('canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const environment = new Environment(this.scene);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: canvasReference
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000);
        this.renderer.shadowMap.enabled = true;

        // Plane
        var plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.MeshPhongMaterial({ color: 0x555555, side: THREE.DoubleSide })
        );
        this.scene.add(plane);
        plane.rotation.x = -Math.PI / 2;
        plane.receiveShadow = true;
        plane.castShadow = true;

        // Directional Light
        var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(3, 10, 10);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Create player controller
        this.playerController = new PlayerController();

        

        // Create player with the loaded FBX model
        this.player = new Player(
            new ThirdPersonCamera(this.camera, new THREE.Vector3(-5, 5, 0), new THREE.Vector3(0, 0, 0)),
            this.playerController, // Pass player controller to Player
            this.scene,
            10
        );

        

        // Load the FBX model
        environment.loadModel('resource/haunted_house.fbx', new THREE.Vector3(5, 1.45, 0), 0.01);

        var thirdPersonCamera = new ThirdPersonCamera(this.camera, new THREE.Vector3(-5, 5, 0), new THREE.Vector3(0, 0, 0));
        thirdPersonCamera.setUp(new THREE.Vector3(0, 0, 0));

        // Initialize clock
        this.clock = new THREE.Clock();

        this.animate();
    }

    static render(dt) {
        if (this.mixer) {
            this.mixer.update(dt); // Update animations if mixer is defined
        }
        if (this.player) {
            this.player.update(dt); // Update player based on controller input
        }
        this.renderer.render(this.scene, this.camera);
    }

    static animate = () => {
        requestAnimationFrame(this.animate);
        this.render(this.clock.getDelta());
    }
}

Main.init();

