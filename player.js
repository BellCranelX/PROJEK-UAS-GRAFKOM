import * as THREE from 'three';
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
            var forward = new THREE.Vector3();
            var right = new THREE.Vector3();

            this.camera.camera.getWorldDirection(forward);
            forward.y = 0;
            forward.normalize();

            right.crossVectors(this.camera.camera.up, forward).normalize();

            if (this.controller.keys['forward']) {
                direction.add(forward);
            }
            if (this.controller.keys['backward']) {
                direction.add(forward.clone().negate());
            }
            if (this.controller.keys['left']) {
                direction.add(right.clone().negate());
            }
            if (this.controller.keys['right']) {
                direction.add(right);
            }

            // Normalize the direction vector for consistent speed in all directions
            if (direction.length() > 0) {
                direction.normalize();
            }

            // Apply movement based on the calculated direction
            this.mesh.position.addScaledVector(direction, dt * this.speed);

            // Determine the rotation of the character based on the movement direction
            if (direction.length() > 0) {
                this.mesh.rotation.y = Math.atan2(direction.x, direction.z);
            }

            // Play the appropriate animation
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

            // Update camera rotation
            if (this.controller.mouseDown) {
                this.camera.updateRotation(this.controller.deltaMousePos);
                this.controller.deltaMousePos.set(0, 0); // Reset deltaMousePos after applying rotation
            }

            // Update the camera position
            this.camera.update(this.mesh.position);
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
        };
        this.mousePos = new THREE.Vector2();
        this.mouseDown = false;
        this.deltaMousePos = new THREE.Vector2();
        this.switchCamera = false;
        
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
            case "D".charCodeAt(0):
            case "d".charCodeAt(0):
                this.keys['left'] = true;
                break;
            case "A".charCodeAt(0):
            case "a".charCodeAt(0):
                this.keys['right'] = true;
                break;
            case "T".charCodeAt(0):
            case "t".charCodeAt(0):
                this.switchCamera = !this.switchCamera;
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
            case "D".charCodeAt(0):
            case "d".charCodeAt(0):
                this.keys['left'] = false;
                break;
            case "A".charCodeAt(0):
            case "a".charCodeAt(0):
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
        this.rotation.x -= deltaMousePos.x * 0.005; // Adjust sensitivity as needed
        this.rotation.y -= deltaMousePos.y * 0.005; // Adjust sensitivity as needed
        this.rotation.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.rotation.y)); // Limit vertical rotation
        console.log(`Rotation updated: ${this.rotation.x}, ${this.rotation.y}`);
    }
    update(target) {
        var offset = new THREE.Vector3();
        offset.copy(this.positionOffset);
        offset.applyEuler(new THREE.Euler(this.rotation.y, this.rotation.x, 0, 'YXZ'));
        offset.add(target);

        this.camera.position.copy(offset);

        var targetPosition = new THREE.Vector3();
        targetPosition.copy(target);
        targetPosition.add(this.targetOffset);

        this.camera.lookAt(targetPosition);
    }
}
