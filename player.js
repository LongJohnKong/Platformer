var Player = function(){

	this.image = document.createElement("img");
	this.position = new Vector2();
	this.position.set(9 * TILE, 0 * TILE);
	this.width = 159;
	this.height = 163;
	
	this.offset = new Vector2();
	this.offset.set(-155, -87);
	
	this.velocity = new Vector2();
	
	this.falling = true;
	this.jumping = false;
	
	this.image.src = "hero.png";
};

Player.prototype.update = function(deltaTime)
{
	//velocity woo
/////////////////////////////////////
	var left = false;
	var right = false;
	var jump = false;
	
	//check for the presses of the keys 
	left = (keyboard.isKeyDown(keyboard.KEY_LEFT));
	right = (keyboard.isKeyDown(keyboard.KEY_RIGHT));
	jump = (keyboard.isKeyDown(keyboard.KEY_SPACE));

	var wasleft = this.velocity.x < 0;
	var wasright = this.velocity.y < 0;
	var falling = this.falling;
	var acceleration = new Vector2();
	acceleration.y = GRAVITY;
	
	if (left)
		acceleration.x -= ACCEL;
	else if (wasleft)
		acceleration.x += FRICTION;
	
	if (right)
		acceleration.x += ACCEL;
	else if (wasright)
		acceleration.x -= FRICTION;
	
	if (jump && !this.jumpinf && !falling)
	{
		acceleration.y -= JUMP;
		this.jumping = true;
	}
	
	//adds velocity 
	this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
	this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
	
	this.velocity.x = bound(this.velocity.x + (deltaTime * acceleration.x), -MAXDX, MAXDX);
	this.velocity.y = bound(this.velocity.y + (deltaTime * acceleration.y), -MAXDY, MAXDY);
	
	if (wasleft && (this.velocity.x > 0) ||
		wasright && (this.velocity.x) > 0)
		this.velocity.x = 0;
		
	////////////////////////////////////////////////
	
	//geting tiles closest to the player
	var tx = pixeltotile(this.position.x);
	var ty = pixeltotile(this.position.y);

	var nx = (this.position.x) % TILE;
	var ny = (this.position.y) % TILE;
	var cell = cellattilecoord(LAYER_PLATFORMS, tx, ty);
	
	var cellright = cellattilecoord(LAYER_PLATFORMS, tx + 1, ty);
	var celldown = cellattilecoord(LAYER_PLATFORMS, tx, ty + 1);
	var celldiag = cellattilecoord(LAYER_PLATFORMS, tx + 1, ty + 1);
	///////////////////////////////////////////////
	//Check for collision
	if (this.velocity.y > 0)
	{
		if ((celldown && !cell) || (celldiag  && !cellright && nx))
		{
			this.position.y = tiletopixel(ty)
			this.velocity.y = 0;
			this.falling = false;
			this.jumping = false;
			ny = 0; //not overlapping the cell below
		}
	}
	else if (this.velocity.y < 0)
	{
		if((cell && !celldown) || (cellright && !celldiag && nx))
		{
			this.position.y = tiletopixel(ty + 1);
			this.velocity.y = 0;
			
			cell = celldown;
			cellright = celldiag;
			ny = 0;
		
		}
	}
			//right
	if (this.velocity.x > 0)
	{
		if ((cellright && !cell ||
		cellright && !celldiag && ny))
		{
			this.position.x = tiletopixel(tx);
			this.velocity = 0;
		}
	}
	else if (this.velocity.x < 0)
	{
		if ((cell && !cellright) || (celldown && !celldiag && ny))
		{
			this.position.x = tiletopixel(tx + 1);
			this.velocity = 0;
		}
	}
};
	

Player.prototype.draw = function(context)
{
	context.save();
		context.translate(this.position.x, this.position.y);
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width/2, -this.height/2);
	context.restore();
	
};