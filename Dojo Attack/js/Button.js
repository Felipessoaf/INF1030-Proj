function Button(name, screen, pos, width, height, scope, onClick)
{
    this.pos = pos;
    this.width = width;
    this.height = height;
    this.name = name;

    this.click = function (click) 
    {
        if(screen == scope.currentScreen)
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
        console.log("s");
        if(screen == scope.currentScreen)
        {
            scope.drawRect(this.pos[0], this.pos[1], this.width, this.height); 
            
            writeOnCanvas(scope.ctx, this.name, "32pt arial", "black", this.pos[0] + this.width/2, this.pos[1] + this.height/2, "center");
        }
    }
}