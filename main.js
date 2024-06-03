import * as THREE from 'three';
import {Player, PlayerController, ThirdPersonCamera} from './player.js';
import {Environment} from './environment.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class Main {
    static init() {
        var canvasReference = document.getElementById('canvas');
        this.scene = new THREE.Scene();
        const environment = new Environment(this.scene); // Move this line after initializing this.scene
        
        //Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
        
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: canvasReference
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000); // Change clearColor to setClearColor
        this.renderer.shadowMap.enabled = true;

        //Plane
        var Plane = new THREE.Mesh(
            new THREE.PlaneGeometry(40, 40),
            new THREE.MeshPhongMaterial({ color: 0x555555, side: THREE.DoubleSide }) // Change doubleSide to DoubleSide
        );
        this.scene.add(Plane);
        Plane.rotation.x = -Math.PI / 2;
        Plane.receiveShadow = true;
        Plane.castShadow = true;

        //Directional Light
        var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(3, 10, 10);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        this.player = new Player(
            new ThirdPersonCamera(this.camera, new THREE.Vector3(-5, 5, 0), new THREE.Vector3(0, 0, 0)),
            new PlayerController(),
            this.scene,
            10
        );

        var controller = new PlayerController();
        environment.loadModel('Environment/haunted_house/haunted_house.fbx', new THREE.Vector3(5, 1.45, 0), 0.02);
    }

    
    static render(dt) {
        this.player.update(dt);
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
//         }