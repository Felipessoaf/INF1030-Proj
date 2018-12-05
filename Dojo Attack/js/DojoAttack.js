onload = function () {
    (function ()
    {
        var ScreensEnum = Object.freeze({"menu":1, "game":2, "end":3});
        var currentScreen;
        var ModeEnum = Object.freeze({"Facil":1, "Medio":2, "Dificil":3});
        var currentMode;

        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");

        var initialLife = 3;
        var player = new Player(initialLife);
        player.bind(this);
        var GameStarted = false;
        var GameRunning = false;

        var Enemies = new Array();

        var Buttons = new Array();
        var button = new Button("Start", ScreensEnum.menu, [canvas.width/2 - 50, canvas.height/2 - 20], 100, 60, this, function()
        {
            player.life = initialLife;
            currentScreen = ScreensEnum.game;
        });
        button.bind(this);
        Buttons.push(button);
        
        button = new Button("Menu", ScreensEnum.end, [canvas.width/2 - 50, canvas.height/2 - 20], 100, 60, this, function()
        {
            DifficultyOptions.style.display = "block";

            GameStarted = false;
            GameRunning = false;

            Enemies = [];
            player.life = initialLife;
            currentScreen = ScreensEnum.menu;
            player.points = 0;
        });
        button.bind(this);
        Buttons.push(button);

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
            enemy.bind(this);
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