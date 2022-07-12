canvas = document.querySelector('canvas');
c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
c.fillRect(0, 0, canvas.width, canvas.height);
gravity = 1;
speed = 5;
jumpspeed = 20;
time = 60;

playerSprites = {
  'idle': {
    'imageSrc': './img/samuraiMack/Idle.png',
    'frameMax': 8,
  },
  'run': {
    'imageSrc': './img/samuraiMack/Run.png',
    'frameMax': 8,
  },
  'jump': {
    'imageSrc': './img/samuraiMack/Jump.png',
    'frameMax': 2,
  },
  'fall': {
    'imageSrc': './img/samuraiMack/Fall.png',
    'frameMax': 2,
  },
  'attack': {
    'imageSrc': './img/samuraiMack/Attack1.png',
    'frameMax': 6,
  },
  'injured': {
    'imageSrc': './img/samuraiMack/Take Hit - white silhouette.png',
    'frameMax': 4,
  },
  'dead': {
    'imageSrc': './img/samuraiMack/Death.png',
    'frameMax': 6,
  },
};

kenjiSprites = {
  'idle': {
    'imageSrc': './img/kenji/Idle.png',
    'frameMax': 4,
  },
  'run': {
    'imageSrc': './img/kenji/Run.png',
    'frameMax': 8,
  },
  'jump': {
    'imageSrc': './img/kenji/Jump.png',
    'frameMax': 2,
  },
  'fall': {
    'imageSrc': './img/kenji/Fall.png',
    'frameMax': 2,
  },
  'attack': {
    'imageSrc': './img/kenji/Attack1.png',
    'frameMax': 4,
  },
  'injured': {
    'imageSrc': './img/kenji/Take hit.png',
    'frameMax': 3,
  },
  'dead': {
    'imageSrc': './img/kenji/Death.png',
    'frameMax': 7,
  },
};

background = new Sprite({
  position: {x: 0, y: 0},
  imageSrc: './img/background.png',

});

shop = new Sprite({
  position: {x: 650, y: 290},
  imageSrc: './img/shop.png',
  scale: 1.5,
  frameMax: 6,
});


player = new Fighter({
  position: {x: 0, y: 0},
  imageSrc: './img/samuraiMack/Idle.png',
  movements: {left: 'a'},
  frameMax: 8,
  scale: 2,
  offset: {x: 100, y: 50},
  sprites: playerSprites,
  attackBox: {
    offset: {x: 120, y: 100},
    attackStartFrame: 4,
    width: 130,
    height: 50},
});

enemy = new Fighter({
  position: {x: 300, y: 0},
  imageSrc: './img/kenji/Idle.png',
  movements: {left: 'ArrowLeft'},
  frameMax: 4,
  scale: 2,
  offset: {x: 100, y: 60},
  sprites: kenjiSprites,
  attackBox: {
    offset: {x: -50, y: 100},
    attackStartFrame: 1,
    width: 130,
    height: 50,
  }});

const keys = {
  Enter: {pressed: false},
  a: {pressed: false},
  d: {pressed: false},
  w: {pressed: false},
  s: {pressed: false},
  f: {pressed: false},
  ArrowUp: {pressed: false},
  ArrowDown: {pressed: false},
  ArrowLeft: {pressed: false},
  ArrowRight: {pressed: false},

};

function timer() {
  setTimeout(timer, 1000);
  if (time > 0 ) {
    time --;
  }
  document.querySelector('#timer').innerHTML = time;
}

function isGameover() {
  return time == 0 || player.HP <= 0 || enemy.HP <= 0;
}

function determineWinner() {
  if (player.HP > enemy.HP) {
    document.querySelector('#gameResult').innerHTML = 'player1 win';
  } else if (player.HP < enemy.HP) {
    document.querySelector('#gameResult').innerHTML = 'player2 win';
  } else {
    document.querySelector('#gameResult').innerHTML = 'Tie';
  }
  document.querySelector('#gameResult').style.display = 'flex';
}

function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  if (player.alive) {
    if (keys.d.pressed && player.lastKey == 'd') {
      player.velocity.x = speed;
      player.switchMovement('run');
    } else if (keys.a.pressed && player.lastKey == 'a') {
      player.velocity.x = -speed;
      player.switchMovement('run');
    } else if (keys.w.pressed && player.lastKey == 'w') {
      player.velocity.y = -jumpspeed;
    } else {
      player.velocity.x = 0;
      player.switchMovement('idle');
    }
    if (player.velocity.y < 0) {
      player.switchMovement('jump');
    } else if (player.velocity.y >0) {
      player.switchMovement('fall');
    }
  }

  if (enemy.alive) {
    if (keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight') {
      enemy.velocity.x = speed;
      enemy.switchMovement('run');
    } else if (keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft') {
      enemy.velocity.x = -speed;
      enemy.switchMovement('run');
    } else if (keys.ArrowUp.pressed && enemy.lastKey == 'ArrowUp') {
      enemy.velocity.y = -jumpspeed;
    } else {
      enemy.velocity.x = 0;
      enemy.switchMovement('idle');
    }

    if (enemy.velocity.y < 0) {
      enemy.switchMovement('jump');
    } else if (enemy.velocity.y >0) {
      enemy.switchMovement('fall');
    }
  }

  if (player.alive && player.hits(enemy)) {
    enemy.HP -= 20;
    enemy.switchMovement('injured');
    gsap.to('#enemyHP', {
      width: enemy.HP + '%',
    });
    console.log('player scored');
  }

  if ( enemy.HP <= 0 ) {
    enemy.switchMovement('dead');
    enemy.alive = false;
    if (enemy.currentFrame >= enemy.frameMax - 1) {
      enemy.stopAnimate = true;
    }
  }

  if (enemy.alive && enemy.hits(player)) {
    player.HP -= 20;
    player.switchMovement('injured');
    gsap.to('#playerHP', {
      width: player.HP + '%',
    });
    console.log('enemy scored');
  }

  if (player.HP <= 0 ) {
    player.switchMovement('dead');
    player.alive = false;
    if (player.currentFrame >= player.frameMax - 1) {
      player.stopAnimate = true;
    }
  }

  if (isGameover()) {
    determineWinner();
  }

  background.update();
  shop.update();

  enemy.update();
  player.update();

  window.requestAnimationFrame(animate);
}
timer();
animate();

window.addEventListener('keydown', (e)=>{
  console.log(e.key);
  switch (e.key) {
    case 'f':
      player.attack();
      player.switchMovement('attack');
      break;
    case 'Enter':
      enemy.attack();
      enemy.switchMovement('attack');
      break;
    case 'a':
      player.lastKey = 'a';
      keys.a.pressed = true;
      break;
    case 'd':
      player.lastKey = 'd';
      keys.d.pressed = true;
      break;
    case 'w':
      player.lastKey = 'w';
      keys.w.pressed = true;
      break;
    case 's':
      player.lastKey = 's';
      keys.s.pressed = true;
      break;

    case 'ArrowLeft':
      enemy.lastKey = 'ArrowLeft';
      keys.ArrowLeft.pressed = true;
      break;
    case 'ArrowRight':
      enemy.lastKey = 'ArrowRight';
      keys.ArrowRight.pressed = true;
      break;
    case 'ArrowUp':
      enemy.lastKey = 'ArrowUp';
      keys.ArrowUp.pressed = true;
      break;
    case 'ArrowDown':
      enemy.lastKey = 'ArrowDown';
      keys.ArrowDown.pressed = true;
      break;
  }
});


window.addEventListener('keyup', (e)=>{
  switch (e.key) {
    case 'f':
      keys.f.pressed = false;
      break;
    case 'Enter':
      keys.Enter.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 'd':
      keys.d.pressed = false;
      break;
    case 'w':
      keys.w.pressed = false;
      break;
    case 's':
      keys.s.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowUp':
      keys.ArrowUp.pressed = false;
      break;
    case 'ArrowDown':
      keys.ArrowDown.pressed = false;
      break;
  }
});
