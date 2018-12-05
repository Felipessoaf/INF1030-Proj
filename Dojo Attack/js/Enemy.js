function Enemy(speed, left, scope)
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
                scope.ctx.drawImage(currentImage, pos[0], pos[1], currentImage.width/5, currentImage.height/5); 
                pos[0] += speed;
                this.rect.x += speed;
                scope.player.checkHit(this.rect, this);
            }
            else
            {
                currentImage = smokeimage;
                scope.ctx.drawImage(currentImage, pos[0], pos[1], currentImage.width/5, currentImage.height/5); 
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