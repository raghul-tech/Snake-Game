$(document).ready(function(){
	//Define Vars
	var canvas = $('#canvas')[0];
	var ctx = canvas.getContext("2d");
	var w = $('#canvas').width();
	var h = $('#canvas').height();
	var cw = 15;
	var d = "right";
	var food;
	var score;
	var color = localStorage.getItem('snakeColor') || "green";
	var speed = 130;
	var game_loop;

	//Snake Array
	var snake_array;

	//Initializer
	function init(){
		 d="right";
		create_snake();
		create_food();
		score = 0;

		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint,speed);
	}
	init(); //Run initializer

	//Create Snake
	function create_snake(){
		var length  = 5;
		snake_array = [];
		for(var i = length-1;i>=0;i--){
			snake_array.push({x:i,y:0});
		}
	}

	//Create Food
	function create_food() {
		// body...
		food = {
			x:Math.round(Math.random()*(w-cw)/cw), 
			y:Math.round(Math.random()*(h-cw)/cw),
		};
	}

	//Paint Snake
	function paint(){
		//Paint The Canvas 
		ctx.fillStyle = "black";
		ctx.fillRect(0,0,w,h);
		ctx.strokeStyle = "white";
		ctx.strokeRect(0,0,w,h);

		var nx = snake_array[0].x;
		var ny = snake_array[0].y;

		if(d == 'right') nx++;
		else if(d == 'left') nx--;
		else if(d == 'up') ny--;
		else if(d == 'down') ny++;

		//collide code
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx,ny,snake_array)){
			//init();
			clearInterval(game_loop);
			//insert final score
			$('#final_score').html(score);
			//show ovrlay
			$('#overlay').fadeIn(300);
			return;
		}

		if(nx == food.x && ny == food.y){
			var tail = {x:nx,y:ny};
			score++;
			//Create Food
			create_food();
		}else{
			var tail = snake_array.pop();
			tail.x = nx; 
			tail.y = ny;
		}

		snake_array.unshift(tail);

		for(var i = 0; i< snake_array.length;i++){
			var c = snake_array[i];
			paint_cell(c.x,c.y);
		}
		//paint cell
		paint_cell(food.x,food.y);

		//Check Score
		checkscore(score);

		//Display current score
		$('#score').html('Your Score: '+score);
	}
	function paint_cell(x,y){
		ctx.fillStyle=color;
		ctx.fillRect(x*cw,y*cw,cw,cw);
		ctx.strokeStyle="white";
		ctx.strokeRect(x*cw,y*cw,cw,cw);
	}

	function check_collision(x,y,array) {
		// body...
		for(var i = 0; i<array.length;i++){
			if(array[i].x == x && array[i].y == y)
				return true;
		}
		return false;
	}

	function checkscore(score){
		if(localStorage.getItem('highscore') == null){
			//if ther is no high score
			localStorage.setItem('highscore',score);
		}else{
			//if there is a high score
			if(score > localStorage.getItem('highscore')){
				localStorage.setItem('highscore',score)
			}
		}
		$('#high_score').html('High Score: '+localStorage.highscore);
	}

	//Keyboard controller
	$(document).keydown(function(e){
		var key = e.which;
		if(key == "37" && d != "right") d ="left";
		else if(key == "38" && d != "down") d ="up";
		else if(key == "39" && d!= "left") d = "right";
		else if(key == "40" && d!="up") d = "down";
	});

	//color change
	$('.dropdown-content li').click(function(){
		color = $(this).data('color');
		localStorage.setItem('snakeColor',color);
	});

		var savedColor = localStorage.getItem('snakeColor');
		if(savedColor){
			color = savedColor;
		}

		/*window.startGame= function(){
			$('overlay').hide();
			init();
		};*/
});

function resetScore(){
	localStorage.highscore = 0;
	//Display high score
	highscorediv = document.getElementById('high_score');
	highscorediv.innerHTML = 'High Score : 0';
}