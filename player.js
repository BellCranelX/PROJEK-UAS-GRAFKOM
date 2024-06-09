import * as THREE from "three";
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

export class Player {
    constructor(camera, controller, scene, speed) {
        this.camera = camera;
        this.controller = controller;
        this.scene = scene;
        this.speed = speed;
        this.state = "idle";
        this.rotationVector = new THREE.Vector3(0, 0, 0);
        this.animations = {};

        this.camera.setup(new THREE.Vector3(0, 0, 0), this.rotationVector);

        this.loadModel();
    }

    loadModel() {
        var loader = new FBXLoader();
        loader.setPath('./resources/Remy/');
        loader.load('Sword And Shield Idle.fbx', (fbx) => {
            fbx.scale.setScalar(0.01);
            fbx.traverse(c => {
                c.castShadow = true;
            });
            this.mesh = fbx;
            this.scene.add(this.mesh);
            this.mesh.rotation.y += Math.PI / 2;

            this.mixer = new THREE.AnimationMixer(this.mesh);

            var onLoad = (animName, anim) => {
                const clip = anim.animations[0];
                const action = this.mixer.clipAction(clip);

                this.animations[animName] = {
                    clip: clip,
                    action: action,
                };
            };

            const loader = new FBXLoader();
            loader.setPath('./resources/Remy/');
            loader.load('Sword And Shield Idle.fbx', (fbx) => { onLoad('idle', fbx) });
            loader.load('Fast Run.fbx', (fbx) => { onLoad('run', fbx) });
        });
    }

    update(dt) {
        if (this.mesh && this.animations) {
            var direction = new THREE.Vector3(0, 0, 0);

            if (this.controller.keys['forward']) {
                direction.x = 1;
                this.mesh.rotation.y = Math.PI / 2;
            }
            if (this.controller.keys['backward']) {
                direction.x = -1;
                this.mesh.rotation.y = -Math.PI / 2;
            }
            if (this.controller.keys['left']) {
                direction.z = -1;
                this.mesh.rotation.y = Math.PI;
            }
            if (this.controller.keys['right']) {
                direction.z = 1;
                this.mesh.rotation.y = 0;
            }

            if (direction.length() == 0) {
                if (this.animations['idle']) {
                    if (this.state != 'idle') {
                        this.mixer.stopAllAction();
                        this.state = 'idle';
                    }
                    this.mixer.clipAction(this.animations['idle'].clip).play();
                    this.mixer.update(dt);
                }
            } else {
                if (this.animations['run']) {
                    if (this.state != 'run') {
                        this.mixer.stopAllAction();
                        this.state = 'run';
                    }
                    this.mixer.clipAction(this.animations['run'].clip).play();
                    this.mixer.update(dt);
                }
            }

            // Check for diagonal movement (W + D keys pressed)
            if (this.controller.keys['forward'] && this.controller.keys['right']) {
                direction.x = Math.sqrt(2) / 2; // Adjust speed for diagonal movement
                direction.z = Math.sqrt(2) / 2; // Adjust speed for diagonal movement
                this.mesh.rotation.y = Math.PI / 4; // Adjust rotation for diagonal movement
            }

            // Check for diagonal movement (W + A keys pressed)
            if (this.controller.keys['backward'] && this.controller.keys['right']) {
                direction.x = -Math.sqrt(2) / 2; // Adjust speed for diagonal movement
                direction.z = Math.sqrt(2) / 2; // Adjust speed for diagonal movement
                this.mesh.rotation.y = -Math.PI / 4; // Adjust rotation for diagonal movement
            }

            // Check for diagonal movement (S + D keys pressed)
            if (this.controller.keys['forward'] && this.controller.keys['left']) {
                direction.x = Math.sqrt(2) / 2; // Adjust speed for diagonal movement
                direction.z = -Math.sqrt(2) / 2; // Adjust speed for diagonal movement
                this.mesh.rotation.y = Math.PI * 3 / 4; // Adjust rotation for diagonal movement
            }

            // Check for diagonal movement (S + A keys pressed)
            if (this.controller.keys['backward'] && this.controller.keys['left']) {
                direction.x = -Math.sqrt(2) / 2; // Adjust speed for diagonal movement
                direction.z = -Math.sqrt(2) / 2; // Adjust speed for diagonal movement
                this.mesh.rotation.y = -Math.PI * 3 / 4; // Adjust rotation for diagonal movement
            }

            // Normalize the direction vector for consistent speed in all directions
            if (direction.length() > 0) {
                direction.normalize();
            }

            // Apply movement based on the calculated direction
            this.mesh.position.addScaledVector(direction, dt * this.speed);

            // Update camera rotation
            if (this.controller.mouseDown) {
                this.camera.updateRotation(this.controller.deltaMousePos);
            }

            // Update the camera position
            this.camera.update(this.mesh.position);

            // Rest of your update logic...
        }
    }
}

export class PlayerController {
    constructor() {
        this.keys = {
            "forward": false,
            "backward": false,
            "left": false,
            "right": false
        }
        this.mousePos = new THREE.Vector2();
        this.mouseDown = false;
        this.deltaMousePos = new THREE.Vector2();
        document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
        document.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
        document.addEventListener('mousedown', (e) => this.onMouseDown(e), false);
        document.addEventListener('mouseup', (e) => this.onMouseUp(e), false);
    }
    onMouseDown(event) {
        this.mouseDown = true;
    }
    onMouseUp(event) {
        this.mouseDown = false;
    }
    onMouseMove(event) {
        var currentMousePos = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
        if (this.mouseDown) {
            this.deltaMousePos.subVectors(currentMousePos, this.mousePos);
        }
        this.mousePos.copy(currentMousePos);
    }
    onKeyDown(event) {
        switch (event.keyCode) {
            case "W".charCodeAt(0):
            case "w".charCodeAt(0):
                this.keys['forward'] = true;
                break;
            case "S".charCodeAt(0):
            case "s".charCodeAt(0):
                this.keys['backward'] = true;
                break;
            case "A".charCodeAt(0):
            case "a".charCodeAt(0):
                this.keys['left'] = true;
                break;
            case "D".charCodeAt(0):
            case "d".charCodeAt(0):
                this.keys['right'] = true;
                break;
        }
    }
    onKeyUp(event) {
        switch (event.keyCode) {
            case "W".charCodeAt(0):
            case "w".charCodeAt(0):
                this.keys['forward'] = false;
                break;
            case "S".charCodeAt(0):
            case "s".charCodeAt(0):
                this.keys['backward'] = false;
                break;
            case "A".charCodeAt(0):
            case "a".charCodeAt(0):
                this.keys['left'] = false;
                break;
            case "D".charCodeAt(0):
            case "d".charCodeAt(0):
                this.keys['right'] = false;
                break;
        }
    }
}

export class ThirdPersonCamera {
    constructor(camera, positionOffset, targetOffset) {
        this.camera = camera;
        this.positionOffset = positionOffset;
        this.targetOffset = targetOffset;
        this.rotation = new THREE.Vector2();
    }
    setup(target, angle) {
        this.rotation.set(0, 0);
        this.update(target);
    }
    updateRotation(deltaMousePos) {
        this.rotation.x -= deltaMousePos.x * 10; // Adjust sensitivity as needed
        this.rotation.y -= deltaMousePos.y * 10; // Adjust sensitivity as needed
        this.rotation.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.rotation.y)); // Limit vertical rotation
        console.log(`Rotation updated: ${this.rotation.x}, ${this.rotation.y}`);
    }
    update(target) {
        var temp = new THREE.Vector3(0, 0, 0);
        temp.copy(this.positionOffset);
        temp.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation.x); // Horizontal rotation
        temp.applyAxisAngle(new THREE.Vector3(1, 0, 0), this.rotation.y); // Vertical rotation
        temp.addVectors(target, temp);
        this.camera.position.copy(temp);
        temp = new THREE.Vector3(0, 0, 0);
        temp.addVectors(target, this.targetOffset);
        this.camera.lookAt(temp);
    }
}



export class FreeRoamCamera {
    constructor(camera, canvas) {
        this.camera = camera;
        this.canvas = canvas;
  
        this.moveSpeed = 0.1;
        this.rotationSpeed = 0.002;
  
        this.keys = {};
        this.mouseDown = false;
        this.deltaMousePos = new THREE.Vector2();
  
        this.initEventListeners();
    }
  
    initEventListeners() {
        document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e), false);
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e), false);
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
    }
  
    onKeyDown(event) {
        this.keys[event.code] = true;
    }
  
    onKeyUp(event) {
        this.keys[event.code] = false;
    }
  
    onMouseDown(event) {
        this.mouseDown = true;
        // Lock the pointer to the canvas
        this.canvas.requestPointerLock();
    }
  
    onMouseUp(event) {
        this.mouseDown = false;
        // Exit pointer lock when the mouse is released
        document.exitPointerLock();
    }
  
    onMouseMove(event) {
        if (this.mouseDown) {
            this.deltaMousePos.x += event.movementX * this.rotationSpeed;
            this.deltaMousePos.y += event.movementY * this.rotationSpeed;
        }
    }
  
    update() {
        if (this.mouseDown) {
            this.camera.rotation.y -= this.deltaMousePos.x;
            this.camera.rotation.x -= this.deltaMousePos.y;
            this.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.camera.rotation.x));
            this.deltaMousePos.set(0, 0);
        }
  
        let direction = new THREE.Vector3();
        let forward = new THREE.Vector3();
        let right = new THREE.Vector3();
  
        this.camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();
  
        right.crossVectors(this.camera.up, forward).normalize();
  
        if (this.keys['KeyW']) {
            direction.add(forward);
        }
        if (this.keys['KeyS']) {
            direction.sub(forward);
        }
        if (this.keys['KeyD']) {
            direction.sub(right);
        }
        if (this.keys['KeyA']) {
            direction.add(right);
        }
  
        if (direction.length() > 0) {
            direction.normalize();
            this.camera.position.addScaledVector(direction, this.moveSpeed);
        }
    }
  }
  
  