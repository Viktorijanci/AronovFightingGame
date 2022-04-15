function mapPlayer1(map,player){
  if(map.a){
    player.cube.position.x-=1;
    player.orient="left";
  }
  if(map.d){
    player.cube.position.x+=1;
    player.orient="right";
  }
  if(map.w){
    player.jump();
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
    player.cube.position.x-=1;
    player.orient="left";
  }
  if(map.l){
    player.cube.position.x+=1;
    player.orient="right";
  }
  if(map.i){
    player.jump();
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
      return;
    }
    if(item.cube.position.y===10){
      item.jumping=false;
      item.descending=true;
    }
    if(item.descending && item.cube.position.y>4){
      item.cube.position.y-=0.5;
    }
    if(item.cube.position.y===5){
      item.descending=false;
    }
  });
}

function resolveAttacking(playerArr,sides){
  playerArr.forEach((item, i) => {
    if(item.attacking && item.cooldown){
      const side = player.orient==="left" ? sides[0] : sides[1];
      const victim = i===0 ? 1 : 0;
      item.attackBox.set(item.cube.position,side);
      if(item.attackBox.intersectObject(playerArr[victim].cube).length!==0){
        let audio = new Audio("./Recording.m4a");
        audio.play();
        if(!playerArr[victim].shielding){
          playerArr[victim].hp-=5;
        }
      };
      item.attacking=false;
      item.cooldown=false;
    }else{
      console.log("rip");
    }
  });
}

function resolveShielding(playerArr){
  playerArr.forEach((item, i) => {
    if(item.shielding && cooldown){
      const victim = i===0 ? 1 : 0;
      if(playerArr[victim].attacking){
         playerArr[victim].stunned=true;
         playerArr[victim].attacking=false;
         playerArr[victim].cooldown=false;
      }
      item.shielding=false;
      item.cooldown=false;
    }else{
      console.log("rip");
    }
  });
}

class Player {
  constructor(cube,attackBox) {
    //model
    this.cube=cube;
    this.attackBox=attackBox;

    //status
    this.stunned=false;

    //movement
    this.jumping=false;
    this.descending=false;
    this.orient="right";

    //attacks
    this.attacking=false;
    this.attackType=null;
    this.cooldown=true;
    this.shielding=false;
  }
  jump(){
    if(!this.stunned && !(this.descending && !this.jumping)){
      this.jumping=true;
    }
  }
  attack(){
    if(!this.stunned && !this.attacking && !this.shielding){
      this.attacking=true;
    }
  }
  shield(){
    if(!this.stunned && !this.attacking && !this.shielding){
      this.shielding=true;
    }
  }
}

export {mapPlayer1,mapPlayer2,resolveGravity,resolveAttacking,resolveShielding,Player};
