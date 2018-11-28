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
        console.log("life: " + this.life);
        if(this.life <= 0)
        {
            currentScreen = ScreensEnum.end;
            clearInterval(spawnIntervalTimer);
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
            }
        }
    }

    this.draw = function()
    {       
        drawRect(this.centerRect.x, this.centerRect.y, this.centerRect.width, this.centerRect.height);  
        if(currentMode == ModeEnum.easy)
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

    this.AttackLeft = function()
    {
        /* if(canAttack)
        { */
            canAttack = false;
            attacked = true;
            currentState = StateEnum.left;
            this.checkAttack(this.leftRect);
    
            /* setTimeout(function () {
                currentState = StateEnum.idle;
            }, 500); */
        /* } */
    }

    this.AttackRight = function()
    {
        /* if(canAttack)
        { */
            canAttack = false;
            attacked = true;
            currentState = StateEnum.right;
            this.checkAttack(this.rightRect);
    
            /* setTimeout(function () {
                currentState = StateEnum.idle;
            }, 500); */
       /*  } */
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
        var middle = rect.x + rect.width/2;
        Enemies.forEach(function(item, index){
            if((middle > item.rect.x && middle < item.rect.x + item.rect.width))
            {
                if(index >= 0)
                {
                    item.die();
                    this.points++;
                    console.log("point: " + this.points);
                }
            }
        });
    }
}