import * as THREE from 'three';
import {Player, PlayerController, ThirdPersonCamera, FreeRoamCamera} from './player.js';
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
            new THREE.PlaneGeometry(100, 100),
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
        
        this.freeRoamCamera = new FreeRoamCamera(this.camera, canvasReference);

        var controller = new PlayerController();
        environment.loadModel('Environment/haunted_house/haunted_house.fbx', new THREE.Vector3(5, 1.45, 0), 0.02);

        this.isFreeRoam = false;
        this.setupEventListeners();
    }

    static setupEventListeners() {
        document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
    }

    static onKeyDown(event) {
        if (event.key === 't' || event.key === 'T') {
            this.toggleCamera();
        }
    }

    static toggleCamera() {
        this.isFreeRoam = !this.isFreeRoam;
        if (this.isFreeRoam) {
            // Simpan posisi karakter saat ini
            this.previousPlayerPosition = this.player.mesh.position.clone();
    
            // Setel kamera untuk memulai dari sekitar karakter
            const distance = 10; // Jarak dari karakter
            const angle = Math.PI / 4; // Sudut rotasi
    
            const offsetX = distance * Math.cos(angle);
            const offsetY = 5;
            const offsetZ = distance * Math.sin(angle);
    
            this.camera.position.copy(this.previousPlayerPosition).add(new THREE.Vector3(offsetX, offsetY, offsetZ));
            this.camera.lookAt(this.previousPlayerPosition); // Look at the character
    
            // Hentikan pembaruan pemain saat ini
            this.player.stopUpdate();
        } else {
            // Hidupkan pembaruan pemain kembali
            this.player.resumeUpdate();
    
            // Kembalikan kamera ke posisi dan orientasi awalnya
            this.player.camera.setup(new THREE.Vector3(-5, 5, 0), new THREE.Vector3(0, 0, 0));
    
            // Atur ulang orientasi kamera
            this.camera.lookAt(this.player.mesh.position);
        }
    }

    static render(dt) {
        if (!this.isFreeRoam) {
            this.player.update(dt);
        }

        // Jika mode free roam aktif dan pemain telah bergerak, update posisi kamera
        if (this.isFreeRoam && this.previousPlayerPosition && !this.player.mesh.position.equals(this.previousPlayerPosition)) {
            this.camera.position.copy(this.player.mesh.position).add(new THREE.Vector3(0, 5, 10)); // Adjust position as needed
            this.camera.lookAt(this.player.mesh.position); // Look at the character
            this.previousPlayerPosition.copy(this.player.mesh.position); // Update previous player position
        }

        this.renderer.render(this.scene, this.camera);
    }
}

var clock = new THREE.Clock();
Main.init();

function animate() {
    Main.render(clock.getDelta());
    // Panggil fungsi update dari kamera free roam
    Main.freeRoamCamera.update();
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
