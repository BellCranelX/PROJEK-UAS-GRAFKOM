import * as THREE from 'three';

export class FreeRoamCamera {
  constructor(camera, canvas) {
      this.camera = camera;
      this.canvas = canvas;

      this.moveSpeed = 0.1;
      this.rotationSpeed = 0.005;

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
          this.deltaMousePos.x -= event.movementX * this.rotationSpeed;
          this.deltaMousePos.y -= event.movementY * this.rotationSpeed;
      }
  }

  update() {
      if (this.mouseDown) {
          this.camera.rotation.y += this.deltaMousePos.x;
          this.camera.rotation.x += this.deltaMousePos.y;
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
