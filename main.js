import * as THREE from 'three';
import { Player, PlayerController, ThirdPersonCamera, FreeRoamCamera, FPPCamera} from './player.js';
import { Environment } from './environment.js';
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js';

class Main {
    static init() {
        const canvasReference = document.getElementById('canvas');
        this.scene = new THREE.Scene();
        

        // Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 3, 10);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: canvasReference
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000);
        this.renderer.shadowMap.enabled = true;

        this.Environment = new Environment(this.scene, {x: 0 , y: -1.75, z: -5});


        // // Directional Light
        // const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        // directionalLight.position.set(0, 10, 0);
        // directionalLight.castShadow = true;
        // this.scene.add(directionalLight);

        const houseLight1 = new THREE.PointLight(0xD3D3D3, 1);
        houseLight1.position.set(-3.7, 1.05, -4.38);
        houseLight1.castShadow = true;
        this.scene.add(houseLight1);

        const houseLight2 = new THREE.PointLight(0xD3D3D3, 0.3);
        houseLight2.position.set(-3.65, 1.05, -4.73);
        houseLight2.castShadow = true;
        this.scene.add(houseLight2);

        const gateLight1 = new THREE.PointLight(0xFFFFE0, 0.7);
        gateLight1.position.set(4.24, 1.4, -3.415);
        gateLight1.castShadow = true;
        this.scene.add(gateLight1);

        const gateLight2 = new THREE.PointLight(0xFFFFE0, 0.7);
        gateLight2.position.set(4.24, 1.4, -5.875);
        gateLight2.castShadow = true;
        this.scene.add(gateLight2);

        //Lightning bulan
        var moonLight = new THREE.DirectionalLight(0xb0c4de, 0.3);
        moonLight.position.set(2, 7.8, -8.7);
        this.scene.add(moonLight);

        moonLight.castShadow = true;
        moonLight.shadow.mapSize.width = 2048;
        moonLight.shadow.mapSize.height = 2048;
        moonLight.shadow.camera.left = -50;
        moonLight.shadow.camera.right = 50;
        moonLight.shadow.bias = -0.0001;

        var ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);

        // Initialize physics
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 10;
        
        this.physicsBodies = [];

        // Create the ground/platform
        this.createPlatform();

        // Initialize player and cameras
        this.player = new Player(
            new ThirdPersonCamera(this.camera, new THREE.Vector3(-1, 1, 0), new THREE.Vector3(0, 0.5, 0)),
            new PlayerController(),
            this.scene,
            13,
            this.world
        );
        

        this.createBox1();
        this.createBox2();
        this.createBox3();
        this.createBox4();
        this.createBox5();
        this.createBox6();
        this.createBox7();
        this.createBox8();
        this.createBox9();
        this.createBox10();
        this.createBox11();
        this.createBox12();
        this.createBox13();
        this.createBox14();
        this.createBox15();
        this.createBox16();
        this.createBox17();
        this.createBox18();
        this.createBox19();
        this.createBox20();
        this.createBox21();
        this.createBox22();
        this.createBox23();
        this.createBox24();
        this.createBox25();
        this.createBox26();
        this.createBox27();
        this.createBox28();

        this.freeRoamCamera = new FreeRoamCamera(this.camera, canvasReference);
        this.fppCamera = new FPPCamera(this.camera, this.player);
        this.isFreeRoam = false;
        this.isFPP = false;
        this.setupEventListeners();
    }

    static createPlatform() {
        // Create a large static plane for the ground
        const platformGeo = new THREE.PlaneGeometry(100, 100);
        const platformMat = new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide });
        const platformMesh = new THREE.Mesh(platformGeo, platformMat);
        platformMesh.rotation.x = -Math.PI / 2;
        this.scene.add(platformMesh);

        const platformPhysMat = new CANNON.Material();
        const platformBody = new CANNON.Body({
            mass: 0,  // Static body
            shape: new CANNON.Plane(),
            position: new CANNON.Vec3(0, 0, 0),
            material: platformPhysMat
        });
        platformBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.world.addBody(platformBody);

        this.physicsBodies.push({ mesh: platformMesh, body: platformBody });
    }

    // //gerbang depan
    static createBox1() {
        // Create the visual representation of the box
        const boxGeo = new THREE.BoxGeometry(2.8, 3, 3);
        const boxMat = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00,
            transparent: true,
            opacity: 0 });
        const boxMesh = new THREE.Mesh(boxGeo, boxMat);
        this.scene.add(boxMesh);
    
        // Create the physical representation of the box
        const boxPhysMat = new CANNON.Material();
        const boxBody = new CANNON.Body({
            mass: 0,  // Set mass to 0 for a static object
            shape: new CANNON.Box(new CANNON.Vec3(1.4, 1.5, 1.5)),  // Half extents
            position: new CANNON.Vec3(6, 0, -4.7),  // Set initial position (centered height 1 for a 2x2x2 box)
            material: boxPhysMat
        });
        boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
        this.world.addBody(boxBody);
    
        // Optionally, adjust material properties
        boxPhysMat.friction = 1.0;  // Increase friction to resist movement
        boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
    
        this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
    }

    // //tembok depan kanan
    static createBox2() {
        // Create the visual representation of the box
        const boxGeo = new THREE.BoxGeometry(2, 1, 6);
        const boxMat = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00,
            transparent: true,
            opacity: 0 });
        const boxMesh = new THREE.Mesh(boxGeo, boxMat);
        this.scene.add(boxMesh);
    
        // Create the physical representation of the box
        const boxPhysMat = new CANNON.Material();
        const boxBody = new CANNON.Body({
            mass: 0,  // Set mass to 0 for a static object
            shape: new CANNON.Box(new CANNON.Vec3(1 ,0.5, 3 )),  // Half extents
            position: new CANNON.Vec3(7.5, 0, -0.5),  // Set initial position (centered height 1 for a 2x2x2 box)
            material: boxPhysMat
        });
        boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
        this.world.addBody(boxBody);
    
        // Optionally, adjust material properties
        boxPhysMat.friction = 1.0;  // Increase friction to resist movement
        boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
    
        this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
    }

    // //tembok depan kiri
    static createBox3() {
        // Create the visual representation of the box
        const boxGeo = new THREE.BoxGeometry(2, 1, 6);
        const boxMat = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00,
            transparent: true,
            opacity: 0 });
        const boxMesh = new THREE.Mesh(boxGeo, boxMat);
        this.scene.add(boxMesh);
    
        // Create the physical representation of the box
        const boxPhysMat = new CANNON.Material();
        const boxBody = new CANNON.Body({
            mass: 0,  // Set mass to 0 for a static object
            shape: new CANNON.Box(new CANNON.Vec3(1 ,0.5, 3 )),  // Half extents
            position: new CANNON.Vec3(7.5, 0, -8.3),  // Set initial position (centered height 1 for a 2x2x2 box)
            material: boxPhysMat
        });
        boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
        this.world.addBody(boxBody);
    
        // Optionally, adjust material properties
        boxPhysMat.friction = 1.0;  // Increase friction to resist movement
        boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
    
        this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
    }

    //tembok belakang
    static createBox4() {
        // Create the visual representation of the box
        const boxGeo = new THREE.BoxGeometry(2, 1, 16);
        const boxMat = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00,
            transparent: true,
            opacity: 0 });
        const boxMesh = new THREE.Mesh(boxGeo, boxMat);
        this.scene.add(boxMesh);
    
        // Create the physical representation of the box
        const boxPhysMat = new CANNON.Material();
        const boxBody = new CANNON.Body({
            mass: 0,  // Set mass to 0 for a static object
            shape: new CANNON.Box(new CANNON.Vec3(1 ,0.5, 8 )),  // Half extents
            position: new CANNON.Vec3(-8.2, 0, -4),  // Set initial position (centered height 1 for a 2x2x2 box)
            material: boxPhysMat
        });
        boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
        this.world.addBody(boxBody);
    
        // Optionally, adjust material properties
        boxPhysMat.friction = 1.0;  // Increase friction to resist movement
        boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
    
        this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
    }

    //tembok samping kanan
    static createBox5() {
        // Create the visual representation of the box
        const boxGeo = new THREE.BoxGeometry(16, 1, 2);
        const boxMat = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00,
            transparent: true,
            opacity: 0 });
        const boxMesh = new THREE.Mesh(boxGeo, boxMat);
        this.scene.add(boxMesh);
    
        // Create the physical representation of the box
        const boxPhysMat = new CANNON.Material();
        const boxBody = new CANNON.Body({
            mass: 0,  // Set mass to 0 for a static object
            shape: new CANNON.Box(new CANNON.Vec3(8 ,0.5, 1 )),  // Half extents
            position: new CANNON.Vec3(0.5, 0, 3.25),  // Set initial position (centered height 1 for a 2x2x2 box)
            material: boxPhysMat
        });
        boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
        this.world.addBody(boxBody);
    
        // Optionally, adjust material properties
        boxPhysMat.friction = 1.0;  // Increase friction to resist movement
        boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
    
        this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
    }

    //tembok samping kanan
    static createBox6() {
        // Create the visual representation of the box
        const boxGeo = new THREE.BoxGeometry(16, 1, 2);
        const boxMat = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00,
            transparent: true,
            opacity: 0 });
        const boxMesh = new THREE.Mesh(boxGeo, boxMat);
        this.scene.add(boxMesh);
    
        // Create the physical representation of the box
        const boxPhysMat = new CANNON.Material();
        const boxBody = new CANNON.Body({
            mass: 0,  // Set mass to 0 for a static object
            shape: new CANNON.Box(new CANNON.Vec3(8 ,0.5, 1 )),  // Half extents
            position: new CANNON.Vec3(0.5, 0, -12.3),  // Set initial position (centered height 1 for a 2x2x2 box)
            material: boxPhysMat
        });
        boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
        this.world.addBody(boxBody);
    
        // Optionally, adjust material properties
        boxPhysMat.friction = 1.0;  // Increase friction to resist movement
        boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
    
        this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
    }

    //pohon1
    static createBox7() {
            // Create the visual representation of the box
            const boxGeo = new THREE.BoxGeometry(0.5, 1, 0.5);
            const boxMat = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,
                transparent: true,
                opacity: 0});
            const boxMesh = new THREE.Mesh(boxGeo, boxMat);
            this.scene.add(boxMesh);
        
            // Create the physical representation of the box
            const boxPhysMat = new CANNON.Material();
            const boxBody = new CANNON.Body({
                mass: 0,  // Set mass to 0 for a static object
                shape: new CANNON.Box(new CANNON.Vec3(0.25 ,0.5, 0.25)),  // Half extents
                position: new CANNON.Vec3(4.2, 0, -8.7),  // Set initial position (centered height 1 for a 2x2x2 box)
                material: boxPhysMat
            });
            boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
            this.world.addBody(boxBody);
        
            // Optionally, adjust material properties
            boxPhysMat.friction = 1.0;  // Increase friction to resist movement
            boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
        
            this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
        }

        //pohon2
        static createBox8() {
            // Create the visual representation of the box
            const boxGeo = new THREE.BoxGeometry(0.6, 1, 0.6);
            const boxMat = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,
                transparent: true,
                opacity: 0});
            const boxMesh = new THREE.Mesh(boxGeo, boxMat);
            this.scene.add(boxMesh);
        
            // Create the physical representation of the box
            const boxPhysMat = new CANNON.Material();
            const boxBody = new CANNON.Body({
                mass: 0,  // Set mass to 0 for a static object
                shape: new CANNON.Box(new CANNON.Vec3(0.3 ,0.5, 0.3)),  // Half extents
                position: new CANNON.Vec3(3.3, 0, -6.7),  // Set initial position (centered height 1 for a 2x2x2 box)
                material: boxPhysMat
            });
            boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
            this.world.addBody(boxBody);
        
            // Optionally, adjust material properties
            boxPhysMat.friction = 1.0;  // Increase friction to resist movement
            boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
        
            this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
        }

        //pohon3
        static createBox9() {
            // Create the visual representation of the box
            const boxGeo = new THREE.BoxGeometry(0.6, 1, 1);
            const boxMat = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,
                transparent: true,
                opacity: 0 });
            const boxMesh = new THREE.Mesh(boxGeo, boxMat);
            this.scene.add(boxMesh);
        
            // Create the physical representation of the box
            const boxPhysMat = new CANNON.Material();
            const boxBody = new CANNON.Body({
                mass: 0,  // Set mass to 0 for a static object
                shape: new CANNON.Box(new CANNON.Vec3(0.3 ,0.5, 0.5)),  // Half extents
                position: new CANNON.Vec3(4.3, 0, -1.78),  // Set initial position (centered height 1 for a 2x2x2 box)
                material: boxPhysMat
            });
            boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
            this.world.addBody(boxBody);
        
            // Optionally, adjust material properties
            boxPhysMat.friction = 1.0;  // Increase friction to resist movement
            boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
        
            this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
        }

        //pohon4
        static createBox10() {
            // Create the visual representation of the box
            const boxGeo = new THREE.BoxGeometry(0.7, 1, 1);
            const boxMat = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,
                transparent: true,
                opacity: 0});
            const boxMesh = new THREE.Mesh(boxGeo, boxMat);
            this.scene.add(boxMesh);
        
            // Create the physical representation of the box
            const boxPhysMat = new CANNON.Material();
            const boxBody = new CANNON.Body({
                mass: 0,  // Set mass to 0 for a static object
                shape: new CANNON.Box(new CANNON.Vec3(0.35 ,0.5, 0.5)),  // Half extents
                position: new CANNON.Vec3(-2.1, 0, -0.8),  // Set initial position (centered height 1 for a 2x2x2 box)
                material: boxPhysMat
            });
            boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
            this.world.addBody(boxBody);
        
            // Optionally, adjust material properties
            boxPhysMat.friction = 1.0;  // Increase friction to resist movement
            boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
        
            this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
        }

        //pohon5
        static createBox11() {
            // Create the visual representation of the box
            const boxGeo = new THREE.BoxGeometry(0.6, 1, 1);
            const boxMat = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,
                transparent: true,
                opacity: 0});
            const boxMesh = new THREE.Mesh(boxGeo, boxMat);
            this.scene.add(boxMesh);
        
            // Create the physical representation of the box
            const boxPhysMat = new CANNON.Material();
            const boxBody = new CANNON.Body({
                mass: 0,  // Set mass to 0 for a static object
                shape: new CANNON.Box(new CANNON.Vec3(0.3,0.5, 0.5)),  // Half extents
                position: new CANNON.Vec3(-0.7, 0, -8),  // Set initial position (centered height 1 for a 2x2x2 box)
                material: boxPhysMat
            });
            boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
            this.world.addBody(boxBody);
        
            // Optionally, adjust material properties
            boxPhysMat.friction = 1.0;  // Increase friction to resist movement
            boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
        
            this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
        }

        //pohon6
        static createBox12() {
            // Create the visual representation of the box
            const boxGeo = new THREE.BoxGeometry(0.5, 1, 1);
            const boxMat = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,
                transparent: true,
                opacity: 0});
            const boxMesh = new THREE.Mesh(boxGeo, boxMat);
            this.scene.add(boxMesh);
        
            // Create the physical representation of the box
            const boxPhysMat = new CANNON.Material();
            const boxBody = new CANNON.Body({
                mass: 0,  // Set mass to 0 for a static object
                shape: new CANNON.Box(new CANNON.Vec3(0.25,0.5, 0.5)),  // Half extents
                position: new CANNON.Vec3(-4.1, 0, -9.5),  // Set initial position (centered height 1 for a 2x2x2 box)
                material: boxPhysMat
            });
            boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
            this.world.addBody(boxBody);
        
            // Optionally, adjust material properties
            boxPhysMat.friction = 1.0;  // Increase friction to resist movement
            boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
        
            this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
        }

        //garage kiri
        static createBox13() {
            // Create the visual representation of the box
            const boxGeo = new THREE.BoxGeometry(0.1, 1, 3);
            const boxMat = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,
                transparent: true,
                opacity: 0});
            const boxMesh = new THREE.Mesh(boxGeo, boxMat);
            this.scene.add(boxMesh);
        
            // Create the physical representation of the box
            const boxPhysMat = new CANNON.Material();
            const boxBody = new CANNON.Body({
                mass: 0,  // Set mass to 0 for a static object
                shape: new CANNON.Box(new CANNON.Vec3(0.05,0.5, 1.5)),  // Half extents
                position: new CANNON.Vec3(2.8, 0, 0.35),  // Set initial position (centered height 1 for a 2x2x2 box)
                material: boxPhysMat
            });
            boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
            this.world.addBody(boxBody);
        
            // Optionally, adjust material properties
            boxPhysMat.friction = 1.0;  // Increase friction to resist movement
            boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
        
            this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
        }

        //garage kanan
        static createBox14() {
            // Create the visual representation of the box
            const boxGeo = new THREE.BoxGeometry(0.1, 1, 3);
            const boxMat = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,
                transparent: true,
                opacity: 0});
            const boxMesh = new THREE.Mesh(boxGeo, boxMat);
            this.scene.add(boxMesh);
        
            // Create the physical representation of the box
            const boxPhysMat = new CANNON.Material();
            const boxBody = new CANNON.Body({
                mass: 0,  // Set mass to 0 for a static object
                shape: new CANNON.Box(new CANNON.Vec3(0.05,0.5, 1.5)),  // Half extents
                position: new CANNON.Vec3(0.82, 0, 0.32),  // Set initial position (centered height 1 for a 2x2x2 box)
                material: boxPhysMat
            });
            boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
            this.world.addBody(boxBody);
        
            // Optionally, adjust material properties
            boxPhysMat.friction = 1.0;  // Increase friction to resist movement
            boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
        
            this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
        }

        //garage belakang
        static createBox15() {
            // Create the visual representation of the box
            const boxGeo = new THREE.BoxGeometry(2, 1, 0.1);
            const boxMat = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,
                transparent: true,
                opacity: 0});
            const boxMesh = new THREE.Mesh(boxGeo, boxMat);
            this.scene.add(boxMesh);
        
            // Create the physical representation of the box
            const boxPhysMat = new CANNON.Material();
            const boxBody = new CANNON.Body({
                mass: 0,  // Set mass to 0 for a static object
                shape: new CANNON.Box(new CANNON.Vec3(1,0.5, 0.05)),  // Half extents
                position: new CANNON.Vec3(1.75, 0, 1.75),  // Set initial position (centered height 1 for a 2x2x2 box)
                material: boxPhysMat
            });
            boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
            this.world.addBody(boxBody);
        
            // Optionally, adjust material properties
            boxPhysMat.friction = 1.0;  // Increase friction to resist movement
            boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
        
            this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
        }

        //rumah samping kanan
        static createBox16() {
            // Create the visual representation of the box
            const boxGeo = new THREE.BoxGeometry(3.5, 1, 0.2);
            const boxMat = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,
                transparent: true,
                opacity: 0});
            const boxMesh = new THREE.Mesh(boxGeo, boxMat);
            this.scene.add(boxMesh);
        
            // Create the physical representation of the box
            const boxPhysMat = new CANNON.Material();
            const boxBody = new CANNON.Body({
                mass: 0,  // Set mass to 0 for a static object
                shape: new CANNON.Box(new CANNON.Vec3(1.75,0.5, 0.1)),  // Half extents
                position: new CANNON.Vec3(-3.8, 0, -2.6),  // Set initial position (centered height 1 for a 2x2x2 box)
                material: boxPhysMat
            });
            boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
            this.world.addBody(boxBody);
        
            // Optionally, adjust material properties
            boxPhysMat.friction = 1.0;  // Increase friction to resist movement
            boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
        
            this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
        }

        //rumah samping kiri
        static createBox17() {
            // Create the visual representation of the box
            const boxGeo = new THREE.BoxGeometry(3.5, 1, 0.2);
            const boxMat = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,
                transparent: true,
                opacity: 0});
            const boxMesh = new THREE.Mesh(boxGeo, boxMat);
            this.scene.add(boxMesh);
        
            // Create the physical representation of the box
            const boxPhysMat = new CANNON.Material();
            const boxBody = new CANNON.Body({
                mass: 0,  // Set mass to 0 for a static object
                shape: new CANNON.Box(new CANNON.Vec3(1.75,0.5, 0.1)),  // Half extents
                position: new CANNON.Vec3(-3.8, 0, -6.65),  // Set initial position (centered height 1 for a 2x2x2 box)
                material: boxPhysMat
            });
            boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
            this.world.addBody(boxBody);
        
            // Optionally, adjust material properties
            boxPhysMat.friction = 1.0;  // Increase friction to resist movement
            boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
        
            this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
        }

        //rumah belakang
        static createBox18() {
            // Create the visual representation of the box
            const boxGeo = new THREE.BoxGeometry(0.2, 1, 3.5);
            const boxMat = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,
                transparent: true,
                opacity: 0});
            const boxMesh = new THREE.Mesh(boxGeo, boxMat);
            this.scene.add(boxMesh);
        
            // Create the physical representation of the box
            const boxPhysMat = new CANNON.Material();
            const boxBody = new CANNON.Body({
                mass: 0,  // Set mass to 0 for a static object
                shape: new CANNON.Box(new CANNON.Vec3(0.05,0.5, 1.75)),  // Half extents
                position: new CANNON.Vec3(-5.55, 0, -4.3),  // Set initial position (centered height 1 for a 2x2x2 box)
                material: boxPhysMat
            });
            boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
            this.world.addBody(boxBody);
        
            // Optionally, adjust material properties
            boxPhysMat.friction = 1.0;  // Increase friction to resist movement
            boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
        
            this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
        }

        //lemari
        static createBox19() {
            // Create the visual representation of the box
            const boxGeo = new THREE.BoxGeometry(0.5, 1, 0.8);
            const boxMat = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,
                transparent: true,
                opacity: 0});
            const boxMesh = new THREE.Mesh(boxGeo, boxMat);
            this.scene.add(boxMesh);
        
            // Create the physical representation of the box
            const boxPhysMat = new CANNON.Material();
            const boxBody = new CANNON.Body({
                mass: 0,  // Set mass to 0 for a static object
                shape: new CANNON.Box(new CANNON.Vec3(0.25,0.5, 0.4)),  // Half extents
                position: new CANNON.Vec3(-5.2, 0, -4.6),  // Set initial position (centered height 1 for a 2x2x2 box)
                material: boxPhysMat
            });
            boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
            this.world.addBody(boxBody);
        
            // Optionally, adjust material properties
            boxPhysMat.friction = 1.0;  // Increase friction to resist movement
            boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
        
            this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
        }

        //sofa
        static createBox20() {
            // Create the visual representation of the box
            const boxGeo = new THREE.BoxGeometry(1.1, 0.8, 0.8);
            const boxMat = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,
                transparent: true,
                opacity: 0});
            const boxMesh = new THREE.Mesh(boxGeo, boxMat);
            this.scene.add(boxMesh);
        
            // Create the physical representation of the box
            const boxPhysMat = new CANNON.Material();
            const boxBody = new CANNON.Body({
                mass: 0,  // Set mass to 0 for a static object
                shape: new CANNON.Box(new CANNON.Vec3(0.55,0.4, 0.4)),  // Half extents
                position: new CANNON.Vec3(-4.85, 0, -6),  // Set initial position (centered height 1 for a 2x2x2 box)
                material: boxPhysMat
            });
            boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
            this.world.addBody(boxBody);
        
            // Optionally, adjust material properties
            boxPhysMat.friction = 1.0;  // Increase friction to resist movement
            boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
        
            this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
        }

        //meja
        static createBox21() {
            // Create the visual representation of the box
            const boxGeo = new THREE.BoxGeometry(0.4, 0.5, 0.6);
            const boxMat = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,
                transparent: true,
                opacity: 0});
            const boxMesh = new THREE.Mesh(boxGeo, boxMat);
            this.scene.add(boxMesh);
        
            // Create the physical representation of the box
            const boxPhysMat = new CANNON.Material();
            const boxBody = new CANNON.Body({
                mass: 0,  // Set mass to 0 for a static object
                shape: new CANNON.Box(new CANNON.Vec3(0.2,0.25, 0.3)),  // Half extents
                position: new CANNON.Vec3(-5.3, 0, -3.6),  // Set initial position (centered height 1 for a 2x2x2 box)
                material: boxPhysMat
            });
            boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
            this.world.addBody(boxBody);
        
            // Optionally, adjust material properties
            boxPhysMat.friction = 1.0;  // Increase friction to resist movement
            boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
        
            this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
        }

        //rak
        static createBox22() {
            // Create the visual representation of the box
            const boxGeo = new THREE.BoxGeometry(0.3, 0.5, 0.3);
            const boxMat = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,
                transparent: true,
                opacity: 0});
            const boxMesh = new THREE.Mesh(boxGeo, boxMat);
            this.scene.add(boxMesh);
        
            // Create the physical representation of the box
            const boxPhysMat = new CANNON.Material();
            const boxBody = new CANNON.Body({
                mass: 0,  // Set mass to 0 for a static object
                shape: new CANNON.Box(new CANNON.Vec3(0.15,0.25, 0.15)),  // Half extents
                position: new CANNON.Vec3(-3.4, 0, -2.8),  // Set initial position (centered height 1 for a 2x2x2 box)
                material: boxPhysMat
            });
            boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
            this.world.addBody(boxBody);
        
            // Optionally, adjust material properties
            boxPhysMat.friction = 1.0;  // Increase friction to resist movement
            boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
        
            this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
        }

        //tiang kanan
        static createBox23() {
            // Create the visual representation of the box
            const boxGeo = new THREE.BoxGeometry(0.1, 0.2, 0.1);
            const boxMat = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,
                transparent: true,
                opacity: 0});
            const boxMesh = new THREE.Mesh(boxGeo, boxMat);
            this.scene.add(boxMesh);
        
            // Create the physical representation of the box
            const boxPhysMat = new CANNON.Material();
            const boxBody = new CANNON.Body({
                mass: 0,  // Set mass to 0 for a static object
                shape: new CANNON.Box(new CANNON.Vec3(0.05,0.1, 0.05)),  // Half extents
                position: new CANNON.Vec3(-2.95, 0, -4.15),  // Set initial position (centered height 1 for a 2x2x2 box)
                material: boxPhysMat
            });
            boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
            this.world.addBody(boxBody);
        
            // Optionally, adjust material properties
            boxPhysMat.friction = 1.0;  // Increase friction to resist movement
            boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
        
            this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
        }

        //tiang kiri
        static createBox24() {
            // Create the visual representation of the box
            const boxGeo = new THREE.BoxGeometry(0.1, 0.2, 0.1);
            const boxMat = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,
                transparent: true,
                opacity: 0});
            const boxMesh = new THREE.Mesh(boxGeo, boxMat);
            this.scene.add(boxMesh);
        
            // Create the physical representation of the box
            const boxPhysMat = new CANNON.Material();
            const boxBody = new CANNON.Body({
                mass: 0,  // Set mass to 0 for a static object
                shape: new CANNON.Box(new CANNON.Vec3(0.05,0.1, 0.05)),  // Half extents
                position: new CANNON.Vec3(-2.95, 0, -5.15),  // Set initial position (centered height 1 for a 2x2x2 box)
                material: boxPhysMat
            });
            boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
            this.world.addBody(boxBody);
        
            // Optionally, adjust material properties
            boxPhysMat.friction = 1.0;  // Increase friction to resist movement
            boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
        
            this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
        }

        //rumah depan kiri
        static createBox25() {
            // Create the visual representation of the box
            const boxGeo = new THREE.BoxGeometry(0.7,0.5,1.6);
            const boxMat = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,
                transparent: true,
                opacity: 0});
            const boxMesh = new THREE.Mesh(boxGeo, boxMat);
            this.scene.add(boxMesh);
        
            // Create the physical representation of the box
            const boxPhysMat = new CANNON.Material();
            const boxBody = new CANNON.Body({
                mass: 0,  // Set mass to 0 for a static object
                shape: new CANNON.Box(new CANNON.Vec3(0.35,0.25, 0.8)),  // Half extents
                position: new CANNON.Vec3(-2, 0, -5.8),  // Set initial position (centered height 1 for a 2x2x2 box)
                material: boxPhysMat
            });
            boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
            this.world.addBody(boxBody);
        
            // Optionally, adjust material properties
            boxPhysMat.friction = 1.0;  // Increase friction to resist movement
            boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
        
            this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
        }

        //rumah depan kanan
        static createBox26() {
            // Create the visual representation of the box
            const boxGeo = new THREE.BoxGeometry(0.7,0.5,1.6);
            const boxMat = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,
                transparent: true,
                opacity: 0});
            const boxMesh = new THREE.Mesh(boxGeo, boxMat);
            this.scene.add(boxMesh);
        
            // Create the physical representation of the box
            const boxPhysMat = new CANNON.Material();
            const boxBody = new CANNON.Body({
                mass: 0,  // Set mass to 0 for a static object
                shape: new CANNON.Box(new CANNON.Vec3(0.35,0.25, 0.8)),  // Half extents
                position: new CANNON.Vec3(-2, 0, -3.53),  // Set initial position (centered height 1 for a 2x2x2 box)
                material: boxPhysMat
            });
            boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
            this.world.addBody(boxBody);
        
            // Optionally, adjust material properties
            boxPhysMat.friction = 1.0;  // Increase friction to resist movement
            boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
        
            this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
        }

        //tiang depan kanan
        static createBox27() {
            // Create the visual representation of the box
            const boxGeo = new THREE.BoxGeometry(0.8, 0.2, 0.4);
            const boxMat = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,
                transparent: true,
                opacity: 0});
            const boxMesh = new THREE.Mesh(boxGeo, boxMat);
            this.scene.add(boxMesh);
        
            // Create the physical representation of the box
            const boxPhysMat = new CANNON.Material();
            const boxBody = new CANNON.Body({
                mass: 0,  // Set mass to 0 for a static object
                shape: new CANNON.Box(new CANNON.Vec3(0.4, 0.1, 0.2)),  // Half extents
                position: new CANNON.Vec3(-1.55, 0, -4.08),  // Set initial position (centered height 1 for a 2x2x2 box)
                material: boxPhysMat
            });
            boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
            this.world.addBody(boxBody);
        
            // Optionally, adjust material properties
            boxPhysMat.friction = 1.0;  // Increase friction to resist movement
            boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
        
            this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
        }

        //tiang depan kiri
        static createBox28() {
            // Create the visual representation of the box
            const boxGeo = new THREE.BoxGeometry(0.8, 0.2, 0.1);
            const boxMat = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,
                transparent: true,
                opacity: 0});
            const boxMesh = new THREE.Mesh(boxGeo, boxMat);
            this.scene.add(boxMesh);
        
            // Create the physical representation of the box
            const boxPhysMat = new CANNON.Material();
            const boxBody = new CANNON.Body({
                mass: 0,  // Set mass to 0 for a static object
                shape: new CANNON.Box(new CANNON.Vec3(0.4, 0.1, 0.05)),  // Half extents
                position: new CANNON.Vec3(-1.6, 0, -5.38),  // Set initial position (centered height 1 for a 2x2x2 box)
                material: boxPhysMat
            });
            boxBody.type = CANNON.Body.STATIC;  // Explicitly set the body type to static
            this.world.addBody(boxBody);
        
            // Optionally, adjust material properties
            boxPhysMat.friction = 1.0;  // Increase friction to resist movement
            boxPhysMat.restitution = 0.1;  // Reduce restitution for less bouncing
        
            this.physicsBodies.push({ mesh: boxMesh, body: boxBody });
        }

    static setupEventListeners() {
        document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
        document.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
    }

    static onKeyDown(event) {
        if (event.key === 't' || event.key === 'T') {
            this.toggleFreeRoamCamera();
        }
        if (event.key === 'f' || event.key === 'F') {
            this.toggleFPPCamera();
        }
    }

    static onMouseMove(event) {
        if (this.isFreeRoam) {
            const deltaMousePos = new THREE.Vector2(event.movementX, event.movementY);
            this.freeRoamCamera.updateRotation(deltaMousePos);
        } else if (!this.isFPP) {
            const deltaMousePos = new THREE.Vector2(event.movementX, event.movementY);
            this.player.camera.updateRotation(deltaMousePos);
        }
    }

    static toggleFreeRoamCamera() {
        console.log("Toggling Free Roam Camera");
        this.isFreeRoam = !this.isFreeRoam;
        this.isFPP = false;

        if (this.isFreeRoam) {
            this.previousPlayerPosition = this.player.mesh.position.clone();

            const distance = 2;
            const angle = Math.PI;

            const offsetX = distance * Math.cos(angle);
            const offsetY = 2;
            const offsetZ = distance * Math.sin(angle);

            this.camera.position.copy(this.previousPlayerPosition).add(new THREE.Vector3(offsetX, offsetY, offsetZ));
            this.camera.lookAt(this.previousPlayerPosition);

            this.player.stopUpdate();
        } else {
            this.player.resumeUpdate();
            this.player.camera.setup(this.player.mesh.position, Math.PI);
            this.camera.lookAt(this.player.mesh.position);
        }
    }

    static toggleFPPCamera() {
        console.log("Toggling FPP Camera");
        this.isFPP = !this.isFPP;
        this.isFreeRoam = false;

        if (this.isFPP) {
            this.fppCamera.update();
            this.player.toggleVisibility(false);
        } else {
            this.player.resumeUpdate();
            this.player.toggleVisibility(true);
            this.player.camera.setup(this.player.mesh.position, Math.PI);
            this.camera.lookAt(this.player.mesh.position);
        }
    }

    static render(dt) {
        // Update physics world
        this.world.step(1 / 60, dt);

        // Update physics bodies
        this.physicsBodies.forEach(obj => {
            obj.mesh.position.copy(obj.body.position);
            obj.mesh.quaternion.copy(obj.body.quaternion);
        });

        if (this.isFPP) {
            this.fppCamera.update(dt);
        } else if (this.isFreeRoam) {
            this.freeRoamCamera.update(dt);
        } else {
            this.player.update(dt);
        }


        this.renderer.render(this.scene, this.camera);
    }
}


const clock = new THREE.Clock();
Main.init();

function animate() {
    Main.render(clock.getDelta());
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
