//import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import * as THREE from "./js/three.module.js";
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
//import {GLTFLoader} from 'https://cdn.skypack.dev/three@0.118.0/examples/jsm/loaders/GLTFLoader.js';
import {GLTFLoader} from "./js/GLTFLoader.js";


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x00CCFF);
scene.fog = new THREE.Fog(0x00CCFF, 1, 20);

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.x = 0;
camera.position.y = -5;
camera.position.z = 2.5;

camera.rotation.x = 0.3;
camera.rotation.y = 0;
camera.rotation.z = 0;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Camera Orbit Control

var controls = new OrbitControls(camera, renderer.domElement);

//Cube(Player)
const cubeTexture = new THREE.TextureLoader().load('./assets/cube_texture.jpg');

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshStandardMaterial({ 
    //color: "gold" 
    map: cubeTexture
});
const cube = new THREE.Mesh( geometry, material );

cube.position.x = 0;
cube.position.y = -2;
cube.position.z = 0.5;
cube.castShadow = true;
cube.receiveShadow = true;

//Cube hitbox
let cubeHitBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
cubeHitBox.setFromObject(cube);

scene.add( cube, cubeHitBox );


//Barrier
const barierGeometry = new THREE.BoxGeometry( 7, 1, 1 );
const barierMaterial = new THREE.MeshStandardMaterial( { color: "grey" } );
const barrier = new THREE.Mesh( barierGeometry, barierMaterial);

barrier.position.x = 0;
barrier.position.y = -7;
barrier.position.z = 1;

//Cube hitbox
let barierHitBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
barierHitBox.setFromObject(barrier);

scene.add( barrier, barierHitBox );

//Lighting
let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
light.position.set(0, -5, 10);
light.target.position.set(0, 0, 0);
light.castShadow = true;
light.shadow.bias = -0.001;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 500.0;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 500.0;
light.shadow.camera.left = 100;
light.shadow.camera.right = -100;
light.shadow.camera.top = 100;
light.shadow.camera.bottom = -100;
scene.add(light);

let lightt = new THREE.AmbientLight(0x101010);
scene.add(lightt);

//Ground
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 25, 1, 1),
    new THREE.MeshStandardMaterial({color : "white"})
);
plane.position.y = 7;
plane.castShadow = false;
plane.receiveShadow = true;

scene.add(plane);


//Input hander
let moveLeft = false;
let moveRight = false;
const onKeyDown = function ( event ) {

    switch ( event.code ) {

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
    }

};

const onKeyUp = function ( event ) {

    switch ( event.code ) {

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;

    }
};

document.addEventListener( 'keydown', onKeyDown );
document.addEventListener( 'keyup', onKeyUp );


let score = 0;
function playerCollisionCheck()
{
    for(let i = 0; i < obstacleList.length; i++)
    {
        if(cubeHitBox.intersectsBox(obstacleList[i].hitbox))
        {
            cube.position.x = 0;
            cube.position.y = -2;
            cube.position.z = 0.5;
            cubeHitBox.copy(cube.geometry.boundingBox).applyMatrix4(cube.matrixWorld);
            moveLeft = false;
            moveRight = false;
            alert("Game Over With Score: " + score);
        }
    }

    // if(cubeHitBox.intersectsBox(collision))
    // {
    //     cube.position.x = 0;
    //     cube.position.y = -2;
    //     cube.position.z = 0.5;
    //     cubeHitBox.copy(cube.geometry.boundingBox).applyMatrix4(cube.matrixWorld);
    //     moveLeft = false;
    //     moveRight = false;
    //     alert("Game Over With Score: " + score);
    // }
}

let obstacleList = [];
//let obstacleHitBoxList = [];

function generateObstacle(posX, posY, posZ)
{
    const loader = new GLTFLoader();
    loader.load('./assets/barrier.glb', function(glb)
    {
        //Obstacle
        const obstacle = glb.scene;
        obstacle.position.x = posX;    //2
        obstacle.position.y = posY;    //3
        obstacle.position.z = posZ;    //1
        obstacle.scale.set(0.7, 0.7, 0.7);
        obstacle.castShadow = true;
        obstacle.rotation.x = 1.5;
        obstacle.receiveShadow = true;

        //Obstacle hitbox
        let obstacleHitBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        obstacleHitBox.setFromObject(obstacle);
        obstacle.hitbox = obstacleHitBox;

        // geometry = glb.children[0].children[0].geometry;  // substitute the path to your geometry
        // geometry.computeBoundingBox();  // otherwise geometry.boundingBox will be undefined
        // var boundingBox = geometry.boundingBox.clone();

        //var helper = new THREE.Box3Helper(obstacleHitBox, 0xffff00 );

        //var helper2 = new THREE.Box3Helper(cubeHitBox, 0xffff00 );

        scene.add(obstacle, obstacleHitBox);

        obstacleList.push(obstacle);
        //obstacleHitBoxList.push(obstacleHitBox);
    });

    // const geometry = new THREE.BoxGeometry(1.5, 1, 1);
    // const material = new THREE.MeshStandardMaterial( { color: "red" } );
    // const obstacle = new THREE.Mesh( geometry, material );

    // obstacle.position.x = posX;    //2
    // obstacle.position.y = posY;    //3
    // obstacle.position.z = posZ;    //1
    // obstacle.castShadow = true;
    // obstacle.receiveShadow = true;

    //Obstacle hitbox
    // let obstacleHitBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    // obstacleHitBox.setFromObject(obstacle);

    // scene.add( obstacle, obstacleHitBox );

    // obstacleList.push(obstacle);
    // obstacleHitBoxList.push(obstacleHitBox);
}

function arrangeObstacle()
{
    //if(Math.floor(Math.random() * 2) + 1 == 1)
    for(let i = 0; i < Math.floor(Math.random() * 2) + 1; i++)
    {
        var rand = Math.floor(Math.random() * 3) + 1;
        if(rand == 1)
        {
            generateObstacle(-2, 10, 0);
        }
        else if(rand == 2)
        {
            generateObstacle(0, 10, 0);
        }
        else if(rand == 3)
        {
            generateObstacle(2, 10, 0);
        }
    }
}

let speed = 7;
function obstacleMove(object)
{
    object.position.y -= 0.01 * speed;
    //object._referenceHitBox.setFromObject(object);
}

function obstacleHitBoxUpdate()
{
    for(let i = 0; i < obstacleList.length; i++)
    {
        obstacleList[i].hitbox.setFromObject(obstacleList[i]);
        //obstacleHitBoxList[i].copy(obstacleList[i]._referenceHitBox).applyMatrix4(obstacleList[i].matrixWorld);
        //obstacleHitBoxList[i].copy(obstacleList[i]._referenceHitBox).applyMatrix4(obstacleList[i].matrixWorld);
    }
}

function obstacleCollisionCheck()
{
    for(let i = 0; i < obstacleList.length; i++)
    {
        if(obstacleList[i].hitbox.intersectsBox(barierHitBox))
        {
            scene.remove(obstacleList[i]);
            //scene.remove(obstacleHitBoxList[i]);
            obstacleList.shift();
            //obstacleHitBoxList.shift();
            //alert(obstacleList.length);
        }
    }
}


let time = 0;
let timer = 2;
function animate() 
{
    requestAnimationFrame( animate );

    //Move on input
    if(moveLeft == true && cube.position.x >= -2)
        {
            cube.position.x -= 0.1;
        }
        else if(moveRight == true && cube.position.x <= 2)
        {
            cube.position.x += 0.1;
        }

    //Player hitbox update
    cubeHitBox.copy(cube.geometry.boundingBox).applyMatrix4(cube.matrixWorld);

    //camera.lookAt(cube.position);
    camera.position.x = lerp(camera.position.x, cube.position.x, 0.1);

    //Obstacle move (and hitbox update)
    obstacleList.forEach(obstacleMove);
    obstacleHitBoxUpdate();

    //Collision check
    //obstacleHitBoxList.forEach(playerCollisionCheck);
    playerCollisionCheck();
    obstacleCollisionCheck();

    //Score update
    score += 0.1;
    document.getElementById("score").innerHTML = "Score: " + score;

    if(score >= 350)
    {
        speed = 18;
        timer = 0.4;
    }
    else if(score >= 300)
    {
        speed = 14;
        timer = 0.7;
    }
    else if(score >= 200)
    {
        speed = 11;
        timer = 1;
    }
    else if(score >= 100)
    {
        speed = 9;
    }

    time += 0.01;
    if(time >= timer)
    {
        arrangeObstacle();
        time = 0;
    }

    renderer.render( scene, camera );
}

function lerp (start, end, amt)
{
    return (1-amt)*start+amt*end
}
alert("Start game");
//arrangeObstacle();
//generateObstacle(2, 4, 0);
animate();