var ScreensEnum = Object.freeze({"menu":1, "game":2, "end":3});
var currentScreen;

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
            ctx.rect(this.pos[0], this.pos[1], this.width, this.height); 
            ctx.fillStyle = '#FFFFFF'; 
            ctx.strokeStyle = '#000000'; 
            ctx.lineWidth = 2;
            ctx.fill(); 
            ctx.stroke();
            
            writeOnCanvas(ctx, this.name, "32pt arial", "black", this.pos[0] + this.width/2, this.pos[1] + this.height/2, "center");
        }
    }
}

function Player(startLife)
{
    this.life = startLife;
    var idleimage = document.getElementById("playeridleimg");
    var leftimage = document.getElementById("playerleftimg");
    var rightimage = document.getElementById("playerrightimg");
    var currentImage = idleimage;
    var pos = [canvas.width/2 - idleimage.width/10 - 30, canvas.height/2];

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
        ctx.drawImage(currentImage, pos[0], pos[1], currentImage.width/5, currentImage.height/5); 
    }
}

function Enemy(posX, posY, width, height, speed)
{
    this.posX = posX;
    this.posY = posY;
    this.speed = speed;

    this.rect = 
    {
        x:posX,
        y:posY,
        width:width,
        height:height
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

    currentScreen = ScreensEnum.menu;
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
            break;
        case ScreensEnum.end:
            drawEnd();
            break;
        default:
            break;
    }
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
    }
}

function drawPlayer()
{
    player.draw();
}

function drawEnemies()
{
    
}

function drawEnd()
{
    writeOnCanvas(ctx, "Finish!", "32pt arial", "black", canvas.width/2, canvas.height/2, "center");
}