import * as THREE from "three";
import * as Logic from './math.js';
import * as Classes from './classes.js';
import {GLTFLoader} from './GLTFLoader.js';
import Stats from "stats.js";

let stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
stats.dom.style.left="";
stats.dom.style.right="0px";
document.body.appendChild(stats.dom);

document.getElementById("startGame").addEventListener("click", function onEvent(event){
  document.getElementById("startGame").style.display="none";
  start();
});

class GameState {
  constructor(players,map,counters){
    this.players=players;
    this.map=map;
    this.counters=counters;
  }
}

function updateBars(playerArr){
  let one = document.getElementById('one');
  let two = document.getElementById('two');
  let original1 = one.style.background.split(",");
  let original2 = two.style.background.split(",");
  original1[2]=playerArr[0].hp/100;
  original2[2]=playerArr[1].hp/100;
  original1[2] = (original1[2]*100).toString()+"%";
  original2[2] = (original2[2]*100).toString()+"%";
  one.style.background=original1.join(",");
  two.style.background=original2.join(",");
  one.innerHTML=original1[2];
  two.innerHTML=original2[2];
}

async function start(){
  let one = document.getElementById('one');
  let two = document.getElementById('two');
  one.style.display="inherit";
  two.style.display="inherit";

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

  // svetlooooo
  let light = new THREE.AmbientLight(0xffffff);
  scene.add(light);

  //vectors
  const left = new THREE.Vector3(-1,0,0);
  const right = new THREE.Vector3(1,0,0);

  //Player models (primitive)
  // let player1box = new THREE.BoxGeometry(5,3,1);
  // const player1material = new THREE.MeshToonMaterial({color:0xff0000});
  // let player1cube = new THREE.Mesh(player1box,player1material);
  // scene.add(player1cube);

  let player2box = new THREE.BoxGeometry(5,3,1);
  const player2material = new THREE.MeshToonMaterial({color:0x0000ff});
  let player2cube = new THREE.Mesh(player2box,player2material);
  scene.add(player2cube);

  // Player models (v1, waiting for new model)
  let trajanje = new THREE.Clock();
  let mixer;
  let ucitavac = new GLTFLoader();
  let igrac1 = await ucitavac.loadAsync("./Fighter.gltf", xhr => {
    console.log(( xhr.loaded / xhr.total * 100 ) + '% loaded');
  })
  console.log(igrac1);

  scene.add(igrac1.scene);
  igrac1.scene.position.x=-30;
  igrac1.scene.position.y=3;
  igrac1.scene.position.z=-30;
  igrac1.scene.rotation.y=Math.PI * 3 / 2;
  igrac1.scene.scale.set(3,3,3);
  console.log(igrac1.animations); // Array<THREE.AnimationClip>
	console.log(igrac1.scene); // THREE.Group
	console.log(igrac1.scenes); // Array<THREE.Group>
	console.log(igrac1.cameras); // Array<THREE.Camera>
	console.log(igrac1.asset); // Object
  mixer = new THREE.AnimationMixer(igrac1.scene);
  let clips = igrac1.animations;
  let idle = mixer.clipAction(clips[0]);
  idle.play();

  //attack direction
  const attack1 = new THREE.Raycaster();
  const attack2 = new THREE.Raycaster();
  attack1.far=5;
  attack2.far=5;

  //shield auras
  const shield1Circle = new THREE.SphereGeometry(4);
  const shield1Material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
  shield1Material.transparent=true;
  shield1Material.opacity=0;
  const shield1Mesh = new THREE.Mesh(shield1Circle,shield1Material);
  scene.add(shield1Mesh);

  const shield2Circle = new THREE.SphereGeometry(4);
  const shield2Material = new THREE.MeshBasicMaterial( { color: 0x0000ff} );
  shield2Material.transparent=true;
  shield2Material.opacity=0;
  const shield2Mesh = new THREE.Mesh(shield2Circle, shield2Material);
  scene.add(shield2Mesh);

  //scene setup
  camera.position.y = 10;

  cube.position.y = 3;
  cube.position.z = -30;

  const a = new THREE.Vector3(-30,5,-30);
  const b = new THREE.Vector3(30,5,-30);

  // player1cube.position.y =5;
  // player1cube.position.z=-30;
  // player1cube.position.x = -30;

  shield1Mesh.position.x=-30;
  shield1Mesh.position.y=5;
  shield1Mesh.position.z=-30;

  player2cube.position.y =5;
  player2cube.position.z =-30;
  player2cube.position.x =30;

  shield2Mesh.position.x=30;
  shield2Mesh.position.y=5;
  shield2Mesh.position.z=-30;

  let player1 = new Classes.Player(igrac1.scene,attack1,shield1Mesh);
  let player2 = new Classes.Player(player2cube,attack2,shield2Mesh);
  let playerArr = [player1,player2];

  let counter1 = new THREE.Clock(false);
  let counter2 = new THREE.Clock(false);
  let counter3 = new THREE.Clock(false);

  let gameState = new GameState(playerArr,"test");

  let num = 0, map={};
  document.addEventListener("keyup", event => {
    map[event.key]=false;
  });
  document.addEventListener("keydown", event => {
    map[event.key]=true;
  });

  function animate() {
    stats.begin();
    let delta = trajanje.getDelta();
    mixer.update(delta);
    Logic.mapPlayer1(map,player1);
    Logic.mapPlayer2(map,player2);
    if(player1.attacking || player1.shielding){
      player1.cooldown=true;
      counter1=23;
    }
    if(player2.attacking || player2.shielding){
      player2.cooldown=true;
      counter2=23;
    }
    Logic.resolveStatus(playerArr,[counter1,counter2,counter3]);
    Logic.resolveGravity(playerArr);
    Logic.resolveShielding(playerArr,[counter1,counter2,counter3]);
    Logic.resolveAttacking(playerArr,[left,right],[counter1,counter2,counter3]);
    player1.cooldown = counter1.getDelta()>=1 ? true : false;
    player2.cooldown = counter2.getDelta()>=1 ? true : false;
    renderer.render(scene, camera);
    updateBars(playerArr);
    stats.end();
    requestAnimationFrame(animate);
  } animate();
}
