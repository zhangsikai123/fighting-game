canvas = document.querySelector('canvas')
c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576
c.fillRect(0, 0, canvas.width, canvas.height)
gravity = 1
speed = 5
jumpspeed = 20
time = 60
class Sprite{
    constructor({position, movements}){
        this.lastKey = ''
        this.position = position
        this.velocity = {x:0, y:0}
        this.width = 50
        this.height = 150
        this.attacking = false
        this.HP = 100
        this.movements = movements
    }
    attackBox(){
        var width = 2 * this.width
        var height = this.height / 4
        if(keys[this.movements.left].pressed){
            return { x:this.position.x + this.width - width , y:this.position.y, width:width, height:height}
        } else {
            return { x:this.position.x, y:this.position.y, width:width, height:height}
        }
    }
    attack(){
        this.attacking = true
        setTimeout(()=>{
            this.attacking = false
        }, 100)
    }
    hits(enemy){
        var ab = this.attackBox()
        var epos = enemy.position
        if ( this.attacking && ab.x + ab.width >= epos.x && ab.x <= epos.x + enemy.width  && ab.y >= epos.y && ab.y <= epos.y + enemy.height ){
            this.attacking = false
            return true
        }
    }
    draw(){
        var x = this.position.x
        var y = this.position.y
        var width = this.width
        var height = this.height
        c.fillStyle = 'Red'
        c.fillRect(x, y, width, height)
        c.fillStyle = 'Green'
        var ab = this.attackBox()
        if (this.attacking){
            c.fillRect(ab.x, ab.y, ab.width, ab.height)
        }
    }
    update(){
        this.draw()
        if(
            this.position.y + this.height + this.velocity.y >= canvas.height || this.position.y + this.height + this.velocity.y <= -this.height
        ){
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity
        }
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
    }
}

player = new Sprite({position:{x:0,y:0}, movements:{left:'a'}})
enemy = new Sprite({position:{x:300,y:0},movements:{left:'ArrowLeft'}})

const keys = {
    a:{pressed:false},
    d:{pressed:false},
    w:{pressed:false},
    s:{pressed:false},
    f:{pressed:false},
    ArrowUp:{pressed:false},    
    ArrowDown:{pressed:false},    
    ArrowLeft:{pressed:false},
    ArrowRight:{pressed:false},
    
}

function timer(){
    setTimeout(timer, 1000)
    if (time > 0 ){
        time --
    }
    document.querySelector('#timer').innerHTML = time
}

function isGameover(){
    return time == 0 || player.HP <= 0 || enemy.HP <= 0
}

function determineWinner(){
    if(player.HP > enemy.HP){
        document.querySelector('#gameResult').innerHTML = 'player1 win'
    }
    else if (player.HP < enemy.HP){
        document.querySelector('#gameResult').innerHTML = 'player2 win'
    } else {
        document.querySelector('#gameResult').innerHTML = 'Tie'
    }
    document.querySelector('#gameResult').style.display = 'flex'    
}

function animate(){
    c.clearRect(0, 0, canvas.width, canvas.height)

    if(keys.d.pressed && player.lastKey == 'd'){
        player.velocity.x = speed
    } else if (keys.a.pressed && player.lastKey == 'a'){
        player.velocity.x = -speed
    } else if (keys.w.pressed && player.lastKey == 'w'){     
        player.velocity.y = -jumpspeed
    } else {
        player.velocity.x = 0
    }

    if (keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight'){
        enemy.velocity.x = speed
    } else if (keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft'){
        enemy.velocity.x = -speed
    } else if (keys.ArrowUp.pressed && enemy.lastKey == 'ArrowUp'){     
        enemy.velocity.y = -jumpspeed
    } else {
        enemy.velocity.x = 0
    }

    enemy.update()
    player.update()
    
    if (player.hits(enemy)){
        enemy.HP -= 20
        document.querySelector('#enemyHP').style.width = enemy.HP + '%'
        console.log('player scored')
    }
    if (enemy.hits(player)){
        player.HP -= 20
        document.querySelector('#playerHP').style.width = player.HP + '%'        
        console.log('enemy scored')
    }    
    if(isGameover()){
        determineWinner()
    }
    window.requestAnimationFrame(animate)    
}
timer()
animate()

window.addEventListener('keydown', (e)=>{
    console.log(e.key)
    switch (e.key) {
    case 'f':
        player.attack()
        break
    case 'Enter':
        enemy.attack()
        break
    case 'a':
        player.lastKey = 'a'
        keys.a.pressed = true
        break;
    case 'd':
        player.lastKey = 'd'        
        keys.d.pressed = true
        break;
    case 'w':
        player.lastKey = 'w'        
        keys.w.pressed = true
        break;
    case 's':
        player.lastKey = 's'        
        keys.s.pressed = true
        break;
        
    case 'ArrowLeft':
        enemy.lastKey = 'ArrowLeft'
        keys.ArrowLeft.pressed = true
        break;
    case 'ArrowRight':
        enemy.lastKey = 'ArrowRight'        
        keys.ArrowRight.pressed = true
        break;
    case 'ArrowUp':
        enemy.lastKey = 'ArrowUp'        
        keys.ArrowUp.pressed = true
        break;
    case 'ArrowDown':
        enemy.lastKey = 'ArrowDown'        
        keys.ArrowDown.pressed = true
        break;        
    }    
})


window.addEventListener('keyup', (e)=>{
    switch (e.key) {
    case 'a':
        keys.a.pressed = false
        break;
    case 'd':
        keys.d.pressed = false
        break;
    case 'w':
        keys.w.pressed = false
        break;
    case 's':
        keys.s.pressed = false
        break;        
    case 'ArrowLeft':
        keys.ArrowLeft.pressed = false
        break;
    case 'ArrowRight':
        keys.ArrowRight.pressed = false
        break;
    case 'ArrowUp':
        keys.ArrowUp.pressed = false
        break;
    case 'ArrowDown':
        keys.ArrowDown.pressed = false
        break;        
    }            
})

