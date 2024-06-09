import * as THREE from 'three';
import { Player, PlayerController, ThirdPersonCamera, FreeRoamCamera } from './player.js';
import { Environment } from './environment.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/controls/OrbitControls.js';
 // Ubah path impor OrbitControls

class Main {
    static init() {
        var canvasReference = document.getElementById('canvas');
        this.scene = new THREE.Scene();
        const environment = new Environment(this.scene); // Pindahkan baris ini setelah menginisialisasi this.scene

        // Kamera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        // Tambahkan OrbitControls
        this.controls = new OrbitControls(this.camera, canvasReference);
        this.controls.target.set(0, 0, 0); // Atur titik target agar kamera menghadap ke pusat scene
        this.controls.update(); // Update kontrol

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: canvasReference
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000);
        this.renderer.shadowMap.enabled = true;

        // Bidang
        var plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.MeshPhongMaterial({ color: 0x555555, side: THREE.DoubleSide })
        );
        this.scene.add(plane);
        plane.rotation.x = -Math.PI / 2;
        plane.receiveShadow = true;
        plane.castShadow = true;

        // Cahaya Direksional
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

        this.isFreeRoam = false;
        // Hapus event listener untuk 'keydown'

        // Tambahkan event listener untuk mendeteksi scroll mouse
        window.addEventListener('wheel', (event) => this.onMouseScroll(event), false);
    }

    static onMouseScroll(event) {
        // Mengatur perubahan sudut pandang kamera berdasarkan scroll mouse
        const delta = event.deltaY * 0.01; // Nilai delta dapat disesuaikan sesuai kebutuhan
        this.camera.position.z += delta;

        // Memastikan kamera tidak terlalu dekat atau terlalu jauh dari karakter
        const minDistance = 5;
        const maxDistance = 20;
        this.camera.position.z = THREE.MathUtils.clamp(this.camera.position.z, minDistance, maxDistance);

        // Mengatur arah pandang karakter untuk selalu menghadap ke arah kamera
        this.player.character.lookAt(this.camera.position);
    }

    static toggleCamera() {
        this.isFreeRoam = !this.isFreeRoam;
        if (this.isFreeRoam) {
            // Switch to free roam camera
            this.camera.position.set(0, 5, 10);
            this.camera.lookAt(0, 0, 0);
        } else {
            // Switch back to third-person camera
            this.player.camera.setup(new THREE.Vector3(-5, 5, 0), new THREE.Vector3(0, 0, 0));

            // Set character rotation to match camera rotation
            this.player.character.rotation.y = this.camera.rotation.y;
        }
    }

    static render(dt) {
        if (!this.isFreeRoam) {
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
