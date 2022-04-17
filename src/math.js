import * as THREE from "three";

function mapPlayer1(map,player){
  if(map.a){
    if(player.cube.position.x-1>-38){
      player.cube.position.x-=1
      player.shieldBox.position.x-=1;
    }
    player.cube.rotation.y=Math.PI / 2;
    player.orient="left";
  }
  if(map.d){
    if(player.cube.position.x+1<38){
      player.cube.position.x+=1
      player.shieldBox.position.x+=1;
    }
    player.cube.rotation.y=Math.PI * 3 / 2;
    player.orient="right";
  }
  if(map.w){
    player.jump();
  }
  if(map.q){
    player.shield();
    player.shieldBox.material.opacity=0.3;
  }
  if(map.e){
    player.attack();
    player.attackType="light";
  }
  if(map.r){
    player.attack();
    player.attackType="heavy";
  }
}

function mapPlayer2(map,player){
  if(map.j){
    if(player.cube.position.x-1>-38){
      player.cube.position.x-=1
      player.shieldBox.position.x-=1;
    }
    player.orient="left";
  }
  if(map.l){
    if(player.cube.position.x+1<38){
      player.cube.position.x+=1
      player.shieldBox.position.x+=1;
    }
    player.orient="right";
  }
  if(map.i){
    player.jump();
  }
  if(map.u){
    player.shield();
    player.shieldBox.material.opacity=0.3;
  }
  if(map.o){
    player.attack();
    player.attackType="light";
  }
  if(map.p){
    player.attack();
    player.attackType="heavy";
  }
}

function resolveGravity(playerArr){
  playerArr.forEach((item, i) => {
    if(item.jumping && item.cube.position.y<10){
      item.cube.position.y+=0.5;
      item.shieldBox.position.y+=0,5;
      return;
    }
    if(item.cube.position.y===10){
      item.jumping=false;
      item.descending=true;
    }
    if(item.descending && item.cube.position.y>4){
      item.cube.position.y-=0.5;
      item.shieldBox.position.y-=0,5;
      return;
    }
    if(item.cube.position.y===4){
      item.descending=false;
    }
  });
}

function resolveAttacking(playerArr,sides,counterArr,animationArr){
  playerArr.forEach((item, i) => {
    if(item.attacking && item.cooldown){
      const side = item.orient==="left" ? sides[0] : sides[1];
      const victim = i===0 ? 1 : 0;
      if(item.cube.rotation.y!==0){
        console.log(animationArr);
        animationArr[1].setLoop(THREE.LoopOnce);
        animationArr[1].setEffectiveTimeScale(8);
        animationArr[1].play();
      };
      item.attackBox.set(item.cube.position,side);
      if(item.attackBox.intersectObject(playerArr[victim].cube).length!==0){
        if(!playerArr[victim].shielding){
          if(item.attackType==="light"){
            playerArr[victim].hp-=5;
          }else{
            playerArr[victim].hp-=10;
            playerArr[victim].stunned=true;
            playerArr[victim].material.color = new THREE.Color(0x800080);
            counterArr[2].start();
          }
        }
      };
      item.attacking=false;
      item.cooldown=true;
      counterArr[i].start();
    }
  });
}

function resolveShielding(playerArr,counterArr){
  playerArr.forEach((item, i) => {
    if(item.shielding && item.cooldown){
      const victim = i===0 ? 1 : 0;
      if(playerArr[victim].attacking && playerArr[victim].attackBox.intersectObject(item.cube).length!==0){
         playerArr[victim].stunned=true;
         playerArr[victim].attacking=false;
         playerArr[victim].cooldown=false;
         playerArr[victim].material.color = new THREE.Color(0x800080);
         counterArr[victim].start();
         counterArr[2].start();
      }
      item.shielding=false;
      item.cooldown=true;
      item.shieldBox.material.opacity=0;
      counterArr[i].start();
    }
  });
}

function resolveStatus(playerArr,counterArr){
  playerArr.forEach((item, i) => {
    if(item.stunned && counterArr[2].elapsedTime>=1 && counterArr[2].running){
      item.stunned=false;
      counterArr[2].stop();
    }
    if(item.cooldown && counterArr[i].elapsedTime>=1 && counterArr[i].running){
      item.cooldown=false;
      counterArr[i].stop();
    }
  })
}

export {mapPlayer1,mapPlayer2,resolveGravity,resolveAttacking,resolveShielding,resolveStatus};
