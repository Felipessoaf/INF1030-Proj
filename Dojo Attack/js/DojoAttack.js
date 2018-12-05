onload = function () {
    (function ()
    {
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
                height:100
            }

            this.rightRect = 
            {
                x:pos[0] + 330,
                y:pos[1],
                width:30,
                height:100
            }

            this.centerRect = 
            {
                x:pos[0] + 70,
                y:pos[1] + 20,
                width:(idleimage.width/5) - 90,
                height:idleimage.height/5 - 20
            }

            this.damage = function()
            {
                this.life--;
                if(this.life <= 0)
                {
                    currentScreen = ScreensEnum.end;
                    GameStarted = false;
                    GameRunning = false;
                }
            }

            this.checkHit = function(hitRect, obj)
            {
                if(!(hitRect.x > (this.centerRect.x + this.centerRect.width) || 
                    (hitRect.x + hitRect.width) < this.centerRect.x))
                {
                    var index = Enemies.indexOf(obj);
                    if(index >= 0)
                    {
                        Enemies[index].die();
                        this.damage();
                    }
                }
            }

            this.draw = function()
            {        
                if(currentMode == ModeEnum.Facil)
                {
                    drawRect(this.leftRect.x, this.leftRect.y, this.leftRect.width, this.leftRect.height); 
                    drawRect(this.rightRect.x, this.rightRect.y, this.rightRect.width, this.rightRect.height); 
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


            this.Attack = function(left)
            {
                if(canAttack)
                {
                    canAttack = false;
                    attacked = true;
                    if(left)
                    {
                        currentState = StateEnum.left;
                        this.checkAttack(this.leftRect);
                    }
                    else
                    {
                        currentState = StateEnum.right;
                        this.checkAttack(this.rightRect);
                    }
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
                    }, 300);
                }
            }

            this.checkAttack = function(rect) 
            {        
                var point = false;
                var middle = rect.x + rect.width/2;
                Enemies.forEach(function(item, index){
                    if((middle > item.rect.x && middle < item.rect.x + item.rect.width))
                    {
                        if(index >= 0 && !item.dead)
                        {
                            item.die();
                            point = true;
                        }
                    }
                });

                if(point)
                {
                    this.points++;
                }
            }
        }

        function Enemy(speed, left)
        {
            var pos;

            this.speed = speed;
            this.dead = false;
            this.canUpdate = true;

            var smokeimage = new Image();
            var leftimage = new Image();
            var rightimage = new Image();
            var currentImage;

            leftimage.src = "../imagens/inimigo/enemyleft.png";
            rightimage.src = "../imagens/inimigo/enemyright.png";
            smokeimage.src = "../imagens/inimigo/smoke.png";

            if(left)
            {
                pos = [-350,canvas.height/2];
                currentImage = leftimage;
            }
            else
            {
                pos = [canvas.width,canvas.height/2];
                currentImage = rightimage;
            }

            this.rect = 
            {
                x:pos[0],
                y:pos[1],
                width:currentImage.width/5,
                height:currentImage.height/5
            }

            this.update = function()
            {
                if(this.canUpdate)
                {
                    if(!this.dead)
                    {
                        ctx.drawImage(currentImage, pos[0], pos[1], currentImage.width/5, currentImage.height/5); 
                        pos[0] += speed;
                        this.rect.x += speed;
                        player.checkHit(this.rect, this);
                    }
                    else
                    {
                        currentImage = smokeimage;
                        ctx.drawImage(currentImage, pos[0], pos[1], currentImage.width/5, currentImage.height/5); 
                        setTimeout(function () {
                            currentImage.style.display = "none";
                            pos = [10000,10000];
                            this.canUpdate = false;
                        }, 1000);
                    }
                }
            }

            this.die = function()
            {
                this.dead = true;
            }
        }

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
                    drawRect(this.pos[0], this.pos[1], this.width, this.height); 
                    
                    writeOnCanvas(ctx, this.name, "32pt arial", "black", this.pos[0] + this.width/2, this.pos[1] + this.height/2, "center");
                }
            }
        }

        var ScreensEnum = Object.freeze({"menu":1, "game":2, "end":3});
        var currentScreen;
        var ModeEnum = Object.freeze({"Facil":1, "Medio":2, "Dificil":3});
        var currentMode;

        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");

        var initialLife = 3;
        var player = new Player(initialLife);
        var GameStarted = false;
        var GameRunning = false;

        var Enemies = new Array();

        var Buttons = new Array();
        Buttons.push(new Button("Start", ScreensEnum.menu, [canvas.width/2 - 50, canvas.height/2 - 20], 100, 60, function()
        {
            player.life = initialLife;
            currentScreen = ScreensEnum.game;
        }));
        Buttons.push(new Button("Menu", ScreensEnum.end, [canvas.width/2 - 50, canvas.height/2 - 20], 100, 60, function()
        {
            DifficultyOptions.style.display = "block";

            GameStarted = false;
            GameRunning = false;

            Enemies = [];
            player.life = initialLife;
            currentScreen = ScreensEnum.menu;
            player.points = 0;
        }));

        var DifficultyOptions = document.getElementById("difficultyOptions");
        var Difficulties = new Array();
        for(var mode in ModeEnum)
        {
            Difficulties.push(mode);
        }
        
        Difficulties.forEach(function(item, index){
            var option = document.createElement("option");
            option.text = item;
            DifficultyOptions.add(option);
        });

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
        currentMode = ModeEnum.Facil;
        setInterval(update,30);

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
                    player.Attack(true);
                    break;
                case 39:
                    player.Attack(false);
                    break;
                default:
                    break;
            }
        }
        
        function drawRect(x,y,w,h)
        {
            ctx.beginPath();
            ctx.rect(x,y,w,h); 
            ctx.fillStyle = '#FFFFFF'; 
            ctx.strokeStyle = '#000000'; 
            ctx.lineWidth = 2;
            ctx.fill(); 
            ctx.stroke();
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
            if(!GameRunning)
            {
                DifficultyOptions.style.display = "none";
                writeOnCanvas(ctx, "Game On!", "32pt verdana", "black", canvas.width/2, canvas.height/2, "center");
                if(!GameStarted)
                {
                    switch(DifficultyOptions.selectedIndex) {
                        case 0:
                            currentMode = ModeEnum.Facil;
                            break;
                        case 1:
                            currentMode = ModeEnum.Medio;
                            break;
                        case 2:
                            currentMode = ModeEnum.Dificil;
                            break;
                        default:
                            break;
                    }
        
                    GameStarted = true; 
                    setTimeout(function () {
                        GameRunning = true; 
                        startSpawn();
                    }, 1000);
                }
            }
            else
            {
                drawGame();
            }
        }
        
        function startSpawn()
        {
            var timeInterval;
            switch(currentMode) {
                case ModeEnum.Facil:
                    spawnEnemies(2, 4);
                    break;
                case ModeEnum.Medio:
                    spawnEnemies(1.2, 1.6);
                    break;
                case ModeEnum.Dificil:
                    spawnEnemies(0.6, 0.6);
                    break;
                default:
                    break;
            }
        }
        
        function spawnEnemies(min, max)
        {
            var vel;
            var left;
            var rand = Math.random();
            
            switch(currentMode) {
                case ModeEnum.Facil:
                    vel = 4;
                    break;
                case ModeEnum.Medio:
                    vel = 7;
                    break;
                case ModeEnum.Dificil:
                    vel = 15;
                    break;
                default:
                    break;
            }
        
            if(rand > 0.5)
            {
                left = true;
            }
            else
            {
                left = false;
                vel *= -1;
            }
        
            var enemy = new Enemy(vel,left);
            Enemies.push(enemy);
        
            setTimeout(function () {
                if(GameRunning = true)
                {
                    spawnEnemies(min, max);
                }
            }, ((Math.random() * max) + min) * 1000);
        }
        
        function drawBackground()
        {
            var image = document.getElementById("bgimg");
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height); 
        }
        
        function drawMenu()
        {
            writeOnCanvas(ctx, "Dojo Attack", "30pt verdana", "white", canvas.width/2, 70, "center");
        }
        
        function drawGame()
        {
            drawPlayer();
            drawEnemies();
            drawScore();
            drawLife();
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
            writeOnCanvas(ctx, "Pontos: " + player.points, "32pt verdana", "black", canvas.width/2, 70, "center");
        }
        
        function drawLife()
        {
            writeOnCanvas(ctx, "Vida: " + player.life, "32pt verdana", "black", 100, 70, "center");
        }
        
        function drawEnd()
        {
            writeOnCanvas(ctx, "Finish!", "32pt verdana", "black", canvas.width/2, canvas.height/2-100, "center");
            writeOnCanvas(ctx, "Pontos: " + player.points, "32pt verdana", "black", canvas.width/2, canvas.height/2-50, "center");
        }
    })();
}