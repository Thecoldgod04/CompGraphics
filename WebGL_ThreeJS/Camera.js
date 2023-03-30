import * as THREE from "./js/three.module.js"
import {scene} from "./Scene.js"

export let camera = null;

camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 3, 3);

scene.add(camera);