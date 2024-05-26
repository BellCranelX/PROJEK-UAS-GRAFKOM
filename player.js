import * as THREE from 'three';
export class Player{
    constructor(camera, controller, scene, speed){
        this.camera = camera;
        this.controller = controller;
        this.scene = scene;
        this.speed = speed;
        
        this.camera.setUp(new THREE.Vector3(0,0,0));

        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshPhongMaterial({color: 0xff0000})
        );
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.scene.add(this.mesh);
    }
    update(dt){
        var direction = new THREE.Vector3(0,0,0);
        if (this.controller.keys['forward']){
            direction.x = 1;
        }
        if (this.controller.keys['backward']){
            direction.x = -1;
        }
        if (this.controller.keys['left']){
            direction.z = -1;
        }
        if (this.controller.keys['right']){
            direction.z = 1;
        }
        this.mesh.position.add(direction.multiplyScalar(dt*this.speed));
        this.camera.setUp(this.mesh.position);
    }
}

export class PlayerController{
    constructor(){
        this.keys = {
            "forward": false,
            "backward": false,
            "left": false,
            "right": false,
        };
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    }
    onKeyDown(event){
        switch(event.key){
            case 'w':
                this.keys.forward = true;
                break;
            case 's':
                this.keys.backward = true;
                break;
            case 'a':
                this.keys.left = true;
                break;
            case 'd':
                this.keys.right = true;
                break;
        }
    }
    onKeyUp(event){
        switch(event.key){
            case 'W':
            case 'w':
                this.keys.forward = false;
                break;
            case 'S':
            case 's':
                this.keys.backward = false;
                break;
            case 'A':
            case 'a':
                this.keys.left = false;
                break;
            case 'D':
            case 'd':
                this.keys.right = false;
                break;
        }
    }
}

export class ThirdPersonCamera{
    constructor(camera, positionOffset, targetOffset){
        this.camera = camera;
        this.positionOffset = positionOffset;
        this.targetOffset = targetOffset;
    }
    setUp(target){
        var temp = new THREE.Vector3();
        temp.addVectors(target, this.positionOffset);
        this.camera.position.copy(temp);
        temp = new THREE.Vector3();
        temp.addVectors(target, this.targetOffset);
        this.camera.lookAt(temp);
    }
}