class Sprite {
  constructor({position, imageSrc, frameMax=1, scale = 1, movements={}, offset={x: 0, y: 0}}) {
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.currentFrame = 0;
    this.frameMax = frameMax;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset=offset;
    this.stopAnimate = false;
    this.active = false;
  }
  activate() {
    this.active = true;
  }
  draw() {
    const cropWidth = this.image.width / this.frameMax;
    c.drawImage(
        this.image,
        this.currentFrame * cropWidth,
        0,
        cropWidth,
        this.image.height,
        this.position.x - this.offset.x,
        this.position.y - this.offset.y,
        cropWidth * this.scale,
        this.image.height * this.scale);
  }
  animateFrame() {
    if (this.stopAnimate) {
      return;
    }
    this.framesElapsed += 1;
    if (this.framesElapsed % this.framesHold != 0) {
      return;
    }
    if (this.currentFrame < this.frameMax - 1) {
      this.currentFrame += 1;
    } else {
      this.currentFrame = 0;
    }
  }
  update() {
    this.draw();
    this.animateFrame();
  }
}

class Fighter extends Sprite {
  constructor({attackBox, sprites, position, imageSrc='', frameMax=1, scale = 1, movements={}, offset={x: 0, y: 0}}) {
    super({
      position: position,
      imageSrc: imageSrc,
      frameMax: frameMax,
      scale: scale,
      movements: movements,
      offset: offset,
    });
    this.lastKey = '';
    this.velocity = {x: 0, y: 0};
    this.attacking = false;
    this.HP = 100;
    this.movements = movements;
    this.sprites = sprites;
    this.attackBox = attackBox;
    this.currentMovement = 'idle';
    this.alive = true;
    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  switchMovement(key) {
    if (this.currentMovement == 'dead') {
      return;
    }
    if ((this.currentMovement === 'attack'|| this.currentMovement === 'injured') &&
       this.currentFrame < this.frameMax - 1) {
      return;
    }
    if ( this.currentMovement != key ) {
      this.image = this.sprites[key].image;
      this.frameMax = this.sprites[key].frameMax;
      this.currentFrame = 0;
      this.currentMovement = key;
    }
  }
  _attackBox() {
    const width = this.attackBox.width;
    const height = this.attackBox.height;
    const attackStartFrame = this.attackBox.attackStartFrame;
    return {x: this.position.x + this.attackBox.offset.x, y: this.position.y + this.attackBox.offset.y, width: width, height: height, attackStartFrame: attackStartFrame};
  }

  attack() {
    this.attacking = true;
  }

  hits(enemy) {
    const cropWidth = enemy.image.width / enemy.frameMax;
    const enemyCrop = {
      position: {
        x: enemy.position.x + 55,
        y: enemy.position.y + 90,
      },
      width: cropWidth * 0.4,
      height: enemy.image.height * 0.5,
    };

    const ab = this._attackBox();
    const epos = enemyCrop.position;
    const enemyWidth = enemyCrop.width;
    const enemyHeight = enemyCrop.height;
    if (
      this.attacking &&
        this.currentFrame === ab.attackStartFrame &&
        ab.x + ab.width >= epos.x &&
        ab.x <= epos.x + enemyWidth &&
        ab.y >= epos.y &&
        ab.y <= epos.y + enemyHeight
    ) {
      this.attacking = false;
      console.log('hits');
      return true;
    } else if (this.attacking && this.currentFrame == ab.attackStartFrame) {
      // MISSED!
      this.attacking = false;
    }
    return false;
  }

  onTheGround() {
    const groundHeight = 90;
    const currentY = this.position.y + this.image.height + this.velocity.y;
    return currentY + groundHeight >= canvas.height;
  }

  update() {
    this.animateFrame();
    this.draw();
    // draw the attack box
    // const ab = this._attackBox();
    if (
      this.onTheGround()
    ) {
      this.velocity.y = 0;
      this.position.y = 290; // y of the ground
    } else {
      this.velocity.y += gravity;
    }
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
  }
}
