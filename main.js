var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var STATE_GAME = 1;
var STATE_RESET = 2;
var STATE_WIN = 3;
var STATE_FAIL = 4;
var gamestate = STATE_GAME;

var lives = 3;

function runGame(deltaTime)
{

}

function runWin(deltaTime)
{
	context.fillStyle = "#000";
	context.font = "50px Ariel";
	context.fillText("You Win!", 250, 240);
}

function runReset(deltaTime)
{

}

function runFail(deltaTime)
{
	context.fillStyle = "#000";
	context.font = "50px Ariel";
	context.fillText("You Lost!", 250, 240);
}

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();


// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

// -----------P H Y S I C S   C O N S T A N T S -----------

var METER = TILE;

var GRAVITY = METER * 9.8 * 6;

	//maximum velocities
var MAXDX = METER * 10;
var MAXDY = METER * 15;

var ACCEL = MAXDX * 2;

var FRICTION = MAXDX * 6;

var JUMP = METER * 1500;

// ------------------- A D D  A U D I O ---------------------------------------

//var music = nfew Audio('rollinat5.mp3');
//music.loop = true;
//music.play();



var music = new Howl(
{
		urls: ["rollinat5.mp3"],
		loop : true,
		buffer : true,
		volume : 1
});



music.play()




var cells = [];
function initialise()
{
	for (var layerindex = 0; layerindex < LAYER_COUNT; layerindex++ )
	{
		cells[layerindex] = [];
		var itemindex = 0;
		
		for(var y = 0; y < level1.layers[layerindex].height; y++)
		{
			cells[layerindex] [y] = [];
			for (var x = 0; x < level1.layers[layerindex].width; x++)
			{
				if(level1.layers[layerindex].data[itemindex] != 0)
				{
					
					cells[layerindex][y][x] = 1;
					cells[layerindex][y - 1][x] = 1;	
					cells[layerindex][y - 1][x + 1] = 1;
					cells[layerindex][y][x + 1] = 1;
				}
				//if 
				else if (cells[layerindex][y][x] != 1)
				{
					cells[layerindex][y][x] = 0;
				}
				itemindex ++;
			}
		}
	}
}

function cellatpixelcoord(layers, x, y)
{
	if(x < 0 || x > SCREEN_WIDTH || y < 0)
		return 1;
		
	if(y > SCREEN_HEIGHT)
		return 0;
	
	return cellattilecoord(layers, tiletopixel(x), pixeltotile(y));
};

function cellattilecoord(layers, tx, ty)
{
	if(tx < 0 || tx >= MAP.tw || ty < 0)
		return 1;
		
	if(ty >= MAP.th)
		return 0;
	
	return cells[layers][ty][tx];
};

function tiletopixel(tile)
{
	return tile * TILE;
};

function pixeltotile(pixel)
{
	return Math.floor(pixel/TILE);
};

function bound(value, min, max)
{
	if (value < min)
		return min
	if (value > max)
		return max;
		
	return value;
};

// load an image to draw
var hud = document.createElement("img");
hud.src = "hud.png";



var keyboard = new Keyboard();
var player = new Player();
initialise();

function run()
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
	
	player.update(deltaTime);
	player.draw(context);
	
	context.drawImage(hud, SCREEN_WIDTH/-400 - hud.width/2, SCREEN_HEIGHT/2 - hud.height/2);
	
		
	// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
	
	switch (gamestate)
	{
		case STATE_GAME:
		runGame(deltaTime);
		break;
		
		case STATE_WIN:
		runWin(deltaTime);
		break;
		
		case STATE_RESET:
		runReset(deltaTime);
		break;
		
		case STATE_FAIL:
		runFail(deltaTime);
		break;
	}

	if (player.position.y >450)
	{
		player = new Player();
		gamestate = STATE_RESET;
		lives = lives-1
	}
	
	if (lives<0)
	{
		gamestate = STATE_FAIL;
		lives = 3;
	}
	
	if (player.position.x > 1700)
	{
		gamestate = STATE_WIN;
	}
	
	drawMap();	
		
	context.fillStyle = "#000";
	context.font="14px Arial";
	context.fillText(lives, 125, 32, 100);
	
		
	// draw the FPS
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 5, 20, 100);
	
}


//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
