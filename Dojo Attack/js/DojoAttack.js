var ScreensEnum = Object.freeze({"menu":1, "game":2, "end":3});
var currentScreen;
var ModeEnum = Object.freeze({"easy":1, "normal":2, "hard":3});
var currentMode;

//********************************Classes******************************************
function Button(name, screen, pos, width, height, onClick)
{
    this.pos = pos;
    this.width = width;
    this.height = height;
    this.name = name;

    this.click = function (click) 
    {
        if(screen == currentScreen)
        {
            if(click.x > this.pos[0] && click.x < this.pos[0] + this.width 
                && click.y < this.pos[1] + this.height && click.y > this.pos[1])
            {
                onClick();
            }
        }
    };

    this.draw = function()
    {
        if(screen == currentScreen)
        {
            ctx.beginPath();
            ctx.rect(this.pos[0], this.pos[1], this.width, this.height); 
            ctx.fillStyle = '#FFFFFF'; 
            ctx.strokeStyle = '#000000'; 
            ctx.lineWidth = 2;
            ctx.fill(); 
            ctx.stroke();
            /* ctx.endPath(); */
            
            writeOnCanvas(ctx, this.name, "32pt arial", "black", this.pos[0] + this.width/2, this.pos[1] + this.height/2, "center");
        }
    }
}

function Player(startLife)
{
    this.life = startLife;
    this.points = 0;

    var idleimage = document.getElementById("playeridleimg");
    var leftimage = document.getElementById("playerleftimg");
    var rightimage = document.getElementById("playerrightimg");
    var currentImage = idleimage;
    var pos = [canvas.width/2 - idleimage.width/10 - 30, canvas.height/2];
    var StateEnum = Object.freeze({"left":1, "idle":2, "right":3});
    var currentState = StateEnum.idle;
    var canAttack = true;
    var attacked = false;

    this.leftRect = 
    {
        x:pos[0] - 80,
        y:pos[1],
        width:30,
        height:20
    }

    this.rightRect = 
    {
        x:pos[0] + 330,
        y:pos[1],
        width:30,
        height:20
    }

    this.damage = function()
    {
        this.life--;
        if(this.life <= 0)
        {
            currentScreen = ScreensEnum.end;
        }
    }

    this.checkHit = function(hitRect, obj)
    {
        if((hitRect.x > this.pos[0] && hitRect.x < this.pos[0] + this.width) ||
            (hitRect.x + hitRect.width > this.pos[0] && hitRect.x + hitRect.width < this.pos[0] + this.width))
        {
            var index = Enemies.indexOf(obj);
            if(index >= 0)
            {
                Enemies.splice(index, 1 );
                damage();
            }
        }
    }

    this.draw = function()
    {        
        if(currentMode == ModeEnum.easy)
        {
            ctx.beginPath();
            ctx.rect(this.leftRect.x, this.leftRect.y, this.leftRect.width, this.leftRect.height); 
            ctx.fillStyle = '#FFFFFF'; 
            ctx.strokeStyle = '#000000'; 
            ctx.lineWidth = 2;
            ctx.fill(); 
            ctx.stroke();   
                 
            ctx.rect(this.rightRect.x, this.rightRect.y, this.rightRect.width, this.rightRect.height); 
            ctx.fillStyle = '#FFFFFF'; 
            ctx.strokeStyle = '#000000'; 
            ctx.lineWidth = 2;
            ctx.fill(); 
            ctx.stroke();
        }

        switch(currentState) {
            case StateEnum.idle:
                currentImage = idleimage;
                ctx.drawImage(currentImage, pos[0], pos[1], currentImage.width/5, currentImage.height/5); 
                break;
            case StateEnum.left:
                currentImage = leftimage;
                ctx.drawImage(currentImage, pos[0]-70, pos[1], currentImage.width/5, currentImage.height/5); 
                break;
            case StateEnum.right:
                currentImage = rightimage;
                ctx.drawImage(currentImage, pos[0], pos[1], currentImage.width/5, currentImage.height/5); 
                break;
            default:
                break;
        }
    }

    this.AttackLeft = function()
    {
        if(canAttack)
        {
            canAttack = false;
            attacked = true;
            currentState = StateEnum.left;
            this.checkAttack(this.leftRect);
    
            setTimeout(function () {
                currentState = StateEnum.idle;
            }, 500);
        }
    }

    this.AttackRight = function()
    {
        if(canAttack)
        {
            canAttack = false;
            attacked = true;
            currentState = StateEnum.right;
            this.checkAttack(this.rightRect);
    
            setTimeout(function () {
                currentState = StateEnum.idle;
            }, 500);
        }
    }

    this.Stop = function()
    {
        if(attacked)
        {
            attacked = false;
            currentState = StateEnum.idle;
            setTimeout(function () {
                canAttack = true;
            }, 500);
        }
    }

    this.checkAttack = function(rect) 
    {        
        /* for (var i = 0; i < Enemies.length; i++) 
        {
            var item = Enemies[i];
            if((item.rect.x > rect.x && item.rect.x < rect.x + rect.width) ||
                (item.rect.x + item.rect.width > rect.x && item.rect.x + item.rect.width < rect.x + rect.width))
            {
                Enemies[i].die();
            }
        } */
        Enemies.forEach(function(item, index){
            if((item.rect.x > rect.x && item.rect.x < rect.x + rect.width) ||
                (item.rect.x + item.rect.width > rect.x && item.rect.x + item.rect.width < rect.x + rect.width))
            {
                if(index >= 0)
                {
                    Enemies[index].die();
                    this.points++;
                }
            }
        });
    }
}

function Enemy(pos, width, height, speed, src)
{
    this.pos = pos;
    this.speed = speed;
    this.image = new Image();
    this.posY = canvas.height/2;
    var dead = false;

    this.rect = 
    {
        x:this.pos,
        y:this.posY,
        width:width,
        height:height
    }

    this.update = function()
    {
        if(!dead)
        {
            ctx.drawImage(this.image, pos, this.posY, this.image.width/5, this.image.height/5); 
            this.pos += speed;
            player.checkHit(this.rect, this);
        }
        else
        {
            this.pos = 10000;
        }
    }

    this.die = function()
    {
        dead = true;
    }
}
//**********************************************************************************

onload = function () {
    
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    initialLife = 3;
    player = new Player(initialLife);

    Buttons = new Array();
    Buttons.push(new Button("Start", ScreensEnum.menu, [canvas.width/2 - 50, canvas.height/2 - 20], 100, 60, function()
    {
        player.life = initialLife;
        currentScreen = ScreensEnum.game;
    }));
    Buttons.push(new Button("Menu", ScreensEnum.end, [canvas.width/2 - 50, canvas.height/2 - 20], 100, 60, function()
    {
        currentScreen = ScreensEnum.menu;
    }));

    Enemies = new Array();

    GameStarted = false;
    GameRunning = false;

    canvas.addEventListener('click', function(evt)
    {
        ClickHandler(evt);
    }, false);

    window.addEventListener("keydown", function(evt)
    {
        KeyDownHandler(evt);
    }, false);

    window.addEventListener("keyup", function(evt)
    {
        player.Stop();
    }, false);

    currentScreen = ScreensEnum.menu;
    currentMode = ModeEnum.easy;
    setInterval(update,30);
}

function getMousePos(canvas, event) 
{
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function writeOnCanvas(c, texto, fonte, corfonte, posX, posY, align)
{
	c.font = fonte;
    c.textAlign = align;
    c.textBaseline = "middle";

    c.fillStyle = corfonte;
    c.fillText(texto, posX, posY);
}

function ClickHandler(event)
{
    var mousePos = getMousePos(canvas, event);
    
    Buttons.forEach(function(item, index){
        item.click(mousePos);
    });
}

function KeyDownHandler(event)
{
    switch(event.keyCode)
    {
        case 37:
            player.AttackLeft();
            break;
        case 39:
            player.AttackRight();
            break;
        default:
            break;
    }
}

function update()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    Buttons.forEach(function(item, index){
        item.draw();
    });
    
    switch(currentScreen) {
        case ScreensEnum.menu:
            drawMenu();
            break;
        case ScreensEnum.game:
            drawGame();
            game();
            break;
        case ScreensEnum.end:
            drawEnd();
            break;
        default:
            break;
    }
}

function game()
{
    spawnEnemies();

}

function drawBackground()
{
    var image = document.getElementById("bgimg");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height); 
}

function drawMenu()
{
    writeOnCanvas(ctx, "Dojo Attack", "32pt arial", "black", canvas.width/2, 70, "center");
}

function drawGame()
{
    if(!GameRunning)
    {
        writeOnCanvas(ctx, "Game On!", "32pt arial", "black", canvas.width/2, canvas.height/2, "center");
        if(!GameStarted)
        {
            GameStarted = true; 
            setTimeout(function () {
                GameRunning = true; 
            }, 1000);
        }
    }
    else
    {
        drawPlayer();
        drawEnemies();
        drawScore();
    }
}

function drawPlayer()
{
    player.draw();
}

function drawEnemies()
{
    Enemies.forEach(function(item, index){
        item.update();
    });
}

function drawScore()
{
    writeOnCanvas(ctx, player.points, "32pt arial", "black", canvas.width - 100, 70, "center");
}

function drawEnd()
{
    writeOnCanvas(ctx, "Finish!", "32pt arial", "black", canvas.width/2, canvas.height/2, "center");
}