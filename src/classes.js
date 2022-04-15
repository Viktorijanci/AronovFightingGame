class Player {
  constructor(cube,attackBox,shieldBox) {
    //model
    this.cube=cube;
    this.attackBox=attackBox;
    this.shieldBox=shieldBox;

    //stats
    this.hp=100;
    this.meter=0;

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

export {Player}
