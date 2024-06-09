import * as THREE from 'three';

export class FreeRoamCamera {
    constructor(camera, canvas) {
        this.camera = camera;
        this.canvas = canvas;

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.moveSpeed = 5;
        this.rotationSpeed = 0.002;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Add event listeners for keydown and keyup events on the document
        document.addEventListener('keydown', (event) => this.onKeyDown(event), false);
        document.addEventListener('keyup', (event) => this.onKeyUp(event), false);
    }

    onKeyDown(event) {
        switch (event.key) {
            case 'w':
                this.moveForward = true;
                break;
            case 's':
                this.moveBackward = true;
                break;
            case 'a':
                this.moveLeft = true;
                break;
            case 'd':
                this.moveRight = true;
                break;
        }
    }

    onKeyUp(event) {
        switch (event.key) {
            case 'w':
                this.moveForward = false;
                break;
            case 's':
                this.moveBackward = false;
                break;
            case 'a':
                this.moveLeft = false;
                break;
            case 'd':
                this.moveRight = false;
                break;
        }
    }

    update() {
        const delta = clock.getDelta();

        const direction = new THREE.Vector3();
        const cameraDirection = this.camera.getWorldDirection(direction);

        const velocity = new THREE.Vector3();

        if (this.moveForward) {
            velocity.add(cameraDirection);
        }
        if (this.moveBackward) {
            velocity.sub(cameraDirection);
        }
        if (this.moveLeft) {
            velocity.addScaledVector(cameraDirection.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2));
        }
        if (this.moveRight) {
            velocity.subScaledVector(cameraDirection.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2));
        }

        velocity.normalize().multiplyScalar(this.moveSpeed * delta);

        this.camera.position.add(velocity);
    }
}
