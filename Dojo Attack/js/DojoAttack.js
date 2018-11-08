var ScreensEnum = Object.freeze({"menu":1, "game":2, "end":3});
var currentScreen;

onload = function () {

    currentScreen = ScreensEnum.menu;
    setInterval(draw,30);
    
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");

    $(window).keypress(function(event){
         eventHandler(event);
      });
}

function eventHandler(event)
{
    console.log(event);
}

function draw()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    
    switch(currentScreen) {
        case ScreensEnum.menu:
            drawMenu()
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
    var image = $("#bgimg")[0];
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height); 
}

function writeOnCanvas(c, texto, fonte, corfonte, posX, posY, align)
{
	c.font = fonte;
    c.textAlign = align;

    c.fillStyle = corfonte;
    c.fillText(texto, posX, posY);
}

function drawMenu()
{
    writeOnCanvas(ctx, "Dojo Attack", "32pt arial", "black", canvas.width/2, 75, "center");
}

function drawGame()
{
    writeOnCanvas(ctx, "Game On!", "32pt arial", "black", canvas.width/2, canvas.height/2, "center");
}

function drawEnd()
{
    writeOnCanvas(ctx, "Finish!", "32pt arial", "black", canvas.width/2, canvas.height/2, "center");
}