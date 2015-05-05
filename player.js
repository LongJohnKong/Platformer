
var LEFT = 0;
var RIGHT = 1;

var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;


var ANIM_IDLE_RIGHT = 3;
var ANIM_JUMP_RIGHT = 4;
var ANIM_WALK_RIGHT = 5;

//var ANIM_SHOOT_LEFT = 6;
//var ANIM_SHOOT_RIGHT = 7;
//var ANIM_CLIMB = 8;
var ANIM_MAX = 6; 


var Player = function(){
	this.sprite = new Sprite("ChuckNorris.png");
	
	//left idle
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[0, 1, 2, 3, 4, 5, 6, 7]);
	//jump left
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[8, 9, 10, 11, 12]);
	//walk left
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]);
	//idle right
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[52, 53, 54, 55, 56, 57, 58, 59]);
	//right jump
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[60, 61, 62, 63, 64]);
	//walk right
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78]);
		
	for(var i=0; i<ANIM_MAX; i++)
	{
		this.sprite.setAnimationOffset(i, -55, -87);
	}
	
	//this.image = document.createElement("img");
	this.position = new Vector2();
	this.position.set( 9*TILE, 0*TILE );
	
	this.width = 159;
	this.height = 163;
	
	//this.offset = new Vector2();
	//this.offset.set(-55,-87);
	
	this.velocity = new Vector2();
	
	this.falling = true;
	this.jumping = false;
	
	this.direction = LEFT;
};

Player.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime);
	
	//velocity woo
/////////////////////////////////////
	var left = false;
	var right = false;
	var jump = false;
	
	//check for the presses of the keys AND DOES SPRITE CHANGES
	if(keyboard.isKeyDown(keyboard.KEY_LEFT) == true) {
		left = true;
		this.direction = LEFT;
		if(this.sprite.currentAnimation != ANIM_WALK_LEFT)
			this.sprite.setAnimation(ANIM_WALK_LEFT);
	}
	if(keyboard.isKeyDown(keyboard.KEY_RIGHT) == true) 
	{
		right = true;
		this.direction = RIGHT;
		if(this.sprite.currentAnimation != ANIM_WALK_RIGHT)
			this.sprite.setAnimation(ANIM_WALK_RIGHT);
	}
	else 
	{
		if(this.jumping == false && this.falling == false)
		{
			if(this.direction == LEFT)
			{
				if(this.sprite.currentAnimation != ANIM_IDLE_LEFT)
				this.sprite.setAnimation(ANIM_IDLE_LEFT);
			}
			else 
			{
				if(this.sprite.currentAnimation != ANIM_IDLE_RIGHT)
				this.sprite.setAnimation(ANIM_IDLE_RIGHT);
			}
		}
	}
	
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true)
	{
		jump = true;
	}

	var wasleft = this.velocity.x < 0;
	var wasright = this.velocity.x > 0;
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
	
	if (jump && !this.jumping && !falling)
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
		wasright && (this.velocity.x < 0))
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
			this.velocity.x = 0;
		}
	}
	else if (this.velocity.x < 0)
	{
		if ((cell && !cellright) || (celldown && !celldiag && ny))
		{
			this.position.x = tiletopixel(tx + 1);
			this.velocity.x = 0;
		}
	}
};
	

Player.prototype.draw = function(context)
{
	this.sprite.draw(context, this.position.x - worldOffsetX, this.position.y)
	//context.save();
	//	context.translate(this.position.x, this.position.y);
	//	context.rotate(this.rotation);
	//	context.drawImage(this.image, -this.width/2, -this.height/2);
	//context.restore();
	
};