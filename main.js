import * as THREE from 'three';
import { Player, PlayerController, ThirdPersonCamera } from './player.js';
import { Environment } from './environment.js';
import { FreeRoamCamera } from './camera.js';

class Main {
    static init() {
        var canvasReference = document.getElementById('canvas');
        this.scene = new THREE.Scene();
        const environment = new Environment(this.scene);

        // Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.freeRoamCamera = new FreeRoamCamera(this.camera, canvasReference);

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: canvasReference
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000);
        this.renderer.shadowMap.enabled = true;

        // Plane
        var Plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
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

        this.controller = new PlayerController();
        this.thirdPersonCamera = new ThirdPersonCamera(this.camera, new THREE.Vector3(-5, 5, 0), new THREE.Vector3(0, 0, 0));
        this.player = new Player(this.thirdPersonCamera, this.controller, this.scene, 10);

        environment.loadModel('Environment/haunted_house/haunted_house.fbx', new THREE.Vector3(5, 1.45, 0), 0.02);

        this.isFreeRoam = false;
    }

    static render(dt) {
        if (this.controller.switchCamera) {
            this.isFreeRoam = !this.isFreeRoam;
            this.controller.switchCamera = false;
        }

        if (this.isFreeRoam) {
            this.freeRoamCamera.update();
        } else {
            this.player.update(dt);
        }

        this.renderer.render(this.scene, this.camera);
    }
}

var clock = new THREE.Clock();
Main.init();

function animate() {
    Main.render(clock.getDelta());
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
