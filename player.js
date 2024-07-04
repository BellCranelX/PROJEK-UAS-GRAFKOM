// player.js
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import * as CANNON from 'https://unpkg.com/cannon-es@0.19.0/dist/cannon-es.js'

export class Player {
    constructor(camera, controller, scene, speed, world) {
        this.camera = camera;
        this.controller = controller;
        this.scene = scene;
        this.speed = speed;
        this.rotationVector = new THREE.Vector3(0, 0, 0);
        this.animations = {};
        this.mesh = null;
        this.mixer = null;
        this.world = world;
        this.physicsBody = null;
        this.boxMesh = null;

        this.camera.setup(new THREE.Vector3(0, 0, 0), this.rotationVector);
        this.loadModel();
        this.isVisible = true;
        this.isUpdating = true;
    }

    setOrientation(direction) {
        // Adjust the rotation so the character faces the correct direction
        this.mesh.rotation.y = Math.atan2(direction.x, direction.z);
    }

    loadModel() {
        const loader = new FBXLoader();
        loader.setPath('./resources/Remy/');
        loader.load('Sword And Shield Idle.fbx', (fbx) => {
            fbx.scale.setScalar(0.00205);
            fbx.traverse(c => {
                c.castShadow = true;
            });
            this.mesh = fbx;
            this.scene.add(this.mesh);
            // Adjust initial rotation if necessary
            this.mesh.rotation.y = Math.PI;
            this.mesh.position.set(-3.5, 0, -4.5);
            this.mixer = new THREE.AnimationMixer(this.mesh);

            const onLoad = (animName, anim) => {
                const clip = anim.animations[0];
                const action = this.mixer.clipAction(clip);

                this.animations[animName] = {
                    clip: clip,
                    action: action,
                };
            };

            const idleLoader = new FBXLoader();
            idleLoader.setPath('./resources/Remy/');
            idleLoader.load('Sword And Shield Idle.fbx', (fbx) => { onLoad('idle', fbx) });

            const runLoader = new FBXLoader();
            runLoader.setPath('./resources/Remy/');
            runLoader.load('Fast Run.fbx', (fbx) => { onLoad('run', fbx) });

            // Create the physics box after the model is loaded
            this.createPlayerBox();
        });
    }

    createPlayerBox() {
        const boxGeo = new THREE.BoxGeometry(0.5, 0.65, 0.2); // Adjust size to match player's mesh size
        const boxMat = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0
        });
        this.boxMesh = new THREE.Mesh(boxGeo, boxMat);
        this.scene.add(this.boxMesh);
    
        const boxShape = new CANNON.Box(new CANNON.Vec3(0.25, 0.325, 0.1)); // Adjust dimensions to match player's mesh
        const boxPhysMat = new CANNON.Material();
        this.physicsBody = new CANNON.Body({
            mass: 1,
            shape: boxShape,
            position: this.mesh.position.clone(), // Set initial position based on mesh position
            material: boxPhysMat
        });
        this.physicsBody.angularDamping = 0.5;
    
 this.physicsBody.fixedRotation = true; // Lock rotation around X and Z axes    
        this.physicsBody.updateMassProperties();
    
        // Add the physics body to the world
        this.world.addBody(this.physicsBody);
    }
    
    
    
    updatePhysicsBodies() {
        if (this.physicsBody && this.mesh && this.boxMesh) {
            // Sync the mesh position with the physics body
            this.mesh.position.copy(this.physicsBody.position);
            this.mesh.position.y -= 0.325; // Adjust for the height of the box
            this.boxMesh.position.copy(this.physicsBody.position);
        }
    }

    update(dt) {
        if (this.mesh && this.mixer && this.animations) {
            let direction = new THREE.Vector3(0, 0, 0);
            let moving = false;

            const forward = new THREE.Vector3();
            const right = new THREE.Vector3();
            this.camera.camera.getWorldDirection(forward);
            forward.y = 0;
            forward.normalize();
            right.crossVectors(this.camera.camera.up, forward).normalize();

            if (this.controller.keys['forward']) {
                direction.add(forward);
                moving = true;
            }
            if (this.controller.keys['backward']) {
                direction.sub(forward);
                moving = true;
            }
            if (this.controller.keys['left']) {
                direction.add(right);
                moving = true;
            }
            if (this.controller.keys['right']) {
                direction.sub(right);
                moving = true;
            }

            if (direction.length() > 0) {
                direction.normalize();
                const velocity = new CANNON.Vec3(direction.x, 0, direction.z).scale(this.speed);
                this.physicsBody.velocity.copy(velocity); // Apply velocity to the physics body
                this.setOrientation(direction); // Set the orientation of the mesh

                if (this.animations['run'] && this.state !== 'run') {
                    this.mixer.stopAllAction();
                    this.state = 'run';
                    this.mixer.clipAction(this.animations['run'].clip).play();
                }
            } else {
                this.physicsBody.velocity.set(0, this.physicsBody.velocity.y, 0); // Stop the physics body when not moving

                if (this.animations['idle'] && this.state !== 'idle') {
                    this.mixer.stopAllAction();
                    this.state = 'idle';
                    this.mixer.clipAction(this.animations['idle'].clip).play();
                }
            }

            this.camera.update(this.mesh.position);
            this.mixer.update(dt);
            this.updatePhysicsBodies(); // Update the physics bodies here
        }
    }

    stopUpdate() {
        this.isUpdating = false;
    }

    resumeUpdate() {
        this.isUpdating = true;
    }

    toggleVisibility(isVisible) {
        this.isVisible = isVisible;
        this.mesh.visible = this.isVisible;
        console.log(`Player visibility: ${this.isVisible}`);
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
        if (this.mouseDown) {
            this.deltaMousePos.x = event.movementX;
            this.deltaMousePos.y = event.movementY;
        }
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
        this.positionOffset = positionOffset.clone();
        this.targetOffset = targetOffset.clone();
        this.rotation = new THREE.Vector2();
    }

    setup(target, angle) {
        this.rotation.set(0, 0);
        this.update(target);
    }

    updateRotation(deltaMousePos) {
        this.rotation.x -= deltaMousePos.x * 0.02; // Adjust sensitivity as needed for horizontal rotation

        // Limit vertical rotation to avoid flipping the camera
        const verticalLimit = Math.PI / 2;
        this.rotation.y = Math.max(-verticalLimit, Math.min(verticalLimit, this.rotation.y));

        console.log(`Rotation updated: ${this.rotation.x}, ${this.rotation.y}`);
    }

    update(target) {
        const position = new THREE.Vector3().copy(this.positionOffset);
    
        // Apply horizontal rotation around the target's Y-axis
        const horizontalQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation.x);
        position.applyQuaternion(horizontalQuat);
    
        // Apply vertical rotation around the local X-axis
        const verticalQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.rotation.y);
        position.applyQuaternion(verticalQuat);
    
        // Move the camera to the new position relative to the target
        position.add(target);
        this.camera.position.copy(position);
    
        // Update the camera to look at the target
        const lookAtPosition = new THREE.Vector3().copy(target).add(this.targetOffset);
        this.camera.lookAt(lookAtPosition);
    }
    
}

export class FreeRoamCamera {
    constructor(camera, domElement) {
        this.camera = camera;
        this.controls = new FirstPersonControls(this.camera, domElement);
        this.controls.movementSpeed = 10;
        this.controls.lookSpeed = 0.2;
        this.controls.lookVertical = true;

        this.zoomSpeed = 0.1;
        this.elevationSpeed = 0.1;

        this.addEventListeners();
    }

    addEventListeners() {
        window.addEventListener('wheel', (event) => this.onMouseWheel(event));
        window.addEventListener('keydown', (event) => this.onKeyDown(event));
    }

    onMouseWheel(event) {
        if (event.deltaY < 0) {
            this.camera.fov = Math.max(10, this.camera.fov - this.zoomSpeed * 10);
        } else if (event.deltaY > 0) {
            this.camera.fov = Math.min(75, this.camera.fov + this.zoomSpeed * 10);
        }
        this.camera.updateProjectionMatrix();
    }

    onKeyDown(event) {
        if (event.code === 'Space') {
            this.camera.position.y += this.elevationSpeed;
        }
    }

    update(deltaTime) {
        this.controls.update(deltaTime);
    }

    updateRotation(deltaMousePos) {
        this.controls.lon += deltaMousePos.x * this.controls.lookSpeed;
        this.controls.lat -= deltaMousePos.y * this.controls.lookSpeed;
        this.controls.update(0); // Force an update
    }
}


export class FPPCamera {
    constructor(camera, player) {
        this.camera = camera;
        this.player = player;
        this.rotationSpeed = 0.009;
        this.moveSpeed = 12; // Higher value for Cannon.js physics
        this.rollSpeed = Math.PI / 100; // 5 degrees in radians
        this.keys = {};
        this.yaw = 0;
        this.pitch = 0;
        this.initEventListeners();
    }

    initEventListeners() {
        document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
        document.addEventListener('mousemove', (e) => this.onMouseMove(e), false);

        // Optionally, request pointer lock immediately
        document.body.requestPointerLock();
    }

    onKeyDown(event) {
        this.keys[event.code] = true;
    }

    onKeyUp(event) {
        this.keys[event.code] = false;
    }

    onMouseMove(event) {
        this.yaw -= event.movementX * this.rotationSpeed;
        this.pitch -= event.movementY * this.rotationSpeed;
        this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch)); // Clamp pitch

        this.camera.rotation.order = "YXZ"; // Ensure the rotation order is Yaw, Pitch, Roll
        this.camera.rotation.y = this.yaw;
        this.camera.rotation.x = this.pitch;
    }

    update(deltaTime) {
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
        if (this.keys['KeyQ']) {
            this.camera.rotation.z += this.rollSpeed;
        }
        if (this.keys['KeyE']) {
            this.camera.rotation.z -= this.rollSpeed;
        }

        if (direction.length() > 0) {
            direction.normalize();
            const velocity = new CANNON.Vec3(direction.x * this.moveSpeed, 0, direction.z * this.moveSpeed);

            // Update the physics body velocity
            this.player.physicsBody.velocity.x = velocity.x;
            this.player.physicsBody.velocity.z = velocity.z;

            // Update box position to follow the player
            this.updateBoxPosition();
        } else {
            // If no direction key is pressed, stop the player
            this.player.physicsBody.velocity.x = 0;
            this.player.physicsBody.velocity.z = 0;
        }

        // Update the camera position
        const cameraOffset = new THREE.Vector3(0, 0.3, 0); // Adjust the Y offset to match the player's scale
        this.camera.position.copy(this.player.physicsBody.position).add(cameraOffset);
    }

    updateBoxPosition() {
        if (this.player.boxMesh) {
            this.player.boxMesh.position.copy(this.player.physicsBody.position);
        }
    }
}




