import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';
import * as Game from './math.js';

document.getElementById("startGame").addEventListener("click", function onEvent(event){
  document.getElementById("startGame").style.display="none";
  start();
});

class GameState {
  constructor(players,map){
    this.players=players;
    this.map=map;
  }
}

function start(){
  //Create the scene
  let scene = new THREE.Scene();

  //Create the camera
  let camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 1000 );
  let renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  document.getElementById("gameRender").appendChild( renderer.domElement );

  //Create the plane and add it to the scene
  let geometry = new THREE.BoxGeometry(80,1,10);
  const material = new THREE.MeshToonMaterial( {color: 0x00ff00} );
  let cube = new THREE.Mesh( geometry, material );
  scene.add(cube);

  // White directional light at half intensity shining from the top.
  let directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  scene.add(directionalLight);

  //vectors
  const left = new THREE.Vector3(-1,0,0);
  const right = new THREE.Vector3(1,0,0);

  //Player models
  let player1box = new THREE.BoxGeometry(5,3,1);
  const player1material = new THREE.MeshToonMaterial({color:0xff0000});
  let player1cube = new THREE.Mesh(player1box,player1material);
  scene.add(player1cube);

  let player2box = new THREE.BoxGeometry(5,3,1);
  const player2material = new THREE.MeshToonMaterial({color:0x0000ff});
  let player2cube = new THREE.Mesh(player2box,player2material);
  scene.add(player2cube);

  //attack direction
  const attack1 = new THREE.Raycaster();
  const attack2 = new THREE.Raycaster();
  attack1.far=5;
  attack2.far=5;

  //scene setup
  camera.position.y = 10;

  cube.position.y = 3;
  cube.position.z = -30;

  player1cube.position.y =5;
  player1cube.position.z=-30;
  player1cube.position.x = -30;

  player2cube.position.y =5;
  player2cube.position.z =-30;
  player2cube.position.x =30;

  let player1 = new Game.Player(player1cube,attack1);
  let player2 = new Game.Player(player2cube,attack2);
  let playerArr = [player1,player2];
  let gameState = new GameState(playerArr,"test");

  let num = 0, map={};
  document.addEventListener("keyup", event => {
    map[event.key]=false;
  });
  document.addEventListener("keydown", event => {
    map[event.key]=true;
  });

  let counter1 = 0;
  let counter2 = 0;

  function animate() {
    requestAnimationFrame(animate);
    Game.mapPlayer1(map,player1);
    Game.mapPlayer2(map,player2);
    if(player1.attacking===true){
      player1.cooldown=true;
      counter1=23;
    }
    if(player2.attacking===true){
      player2.cooldown=true;
      counter2=23;
    }
    Game.resolveGravity(playerArr);
    Game.resolveAttacking(playerArr,[left,right],cooldown);
    // counter = counter<23 ? counter+=1 : 0;
    // console.log(counter);
    // cooldown = counter===23 ? true : false;
    // console.log(cooldown);
    renderer.render(scene, camera);
  } animate();
}
