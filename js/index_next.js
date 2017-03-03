"use strict";
//每个块的数据信息
function OneBlock(){
	this.lastY = -1;
	this.lastX = -1;
	this.lastValue = 0;

	this.lastX1= -1;
	this.lastY1= -1;
	this.lastValue1 =0;

	this.nextY = -1;
	this.nextX = -1;
	this.value = 0;
	this.random = false;
} 

// 游戏控制
function Game(){
	this.boardData = [];
	this.score = 0;
	this.best = 0;
	this.canUndo = false;
	this.isOver = false;
}
// 初始化页面css
Game.prototype.initCss = function() {
	var view = document.querySelector("#view");
	
	var clientWidth = document.body.clientWidth;
	var cellWidth = 110,
		cellSpace = 16;
	if(clientWidth<500)
	{
		document.querySelector("#game").style.width = clientWidth+"px";
		document.querySelector("#game").style.height = clientWidth+125+"px";
		view.style.width = clientWidth-20+"px";
		view.style.height = clientWidth-20+"px";

		var over = document.querySelector("#over");
		over.style.width = clientWidth-20+"px";
		over.style.height = clientWidth-20+"px";

		cellWidth = (clientWidth-20)*0.2;
		cellSpace = (clientWidth-20)*0.04;
	}
	
	var cells = document.createDocumentFragment();
	for(var i=0; i<4; i++){
		for(var j=0; j<4; j++){
			var cell = document.createElement("div");
			cell.setAttribute("class", "cell");
			cell.style.top = cellSpace*(i+1)+cellWidth*i+"px";
			cell.style.left = cellSpace*(j+1)+cellWidth*j+"px";
			cell.style.width = cellWidth+"px";
			cell.style.height = cellWidth+"px";
			cells.appendChild(cell);
		}
	}
	
	view.appendChild(cells);
};
// 添加键盘和触摸事件
Game.prototype.addEvent = function() {
	document.querySelector("#restart").addEventListener("click",this.restart);
	document.querySelector("#reset").addEventListener("click", function(){
		this.reset();
		document.querySelector("#over").style.display = "none";
	});
	document.querySelector("#undo").addEventListener("click", this.undo);

	//add keyboard event
	document.addEventListener("keydown",function(event){
		if(event.which==37)
		{
			event.preventDefault();
			if(canMove('left'))
			{
				moveLeft();
			}
		}
		if(event.which==38)
		{
			event.preventDefault();
			if(canMove('up'))
			{
				moveUp();
			}
		}
		if(event.which==39)
		{
			event.preventDefault();
			if(canMove('right'))
			{
				moveRight();
			}
		}
		if(event.which==40)
		{
			event.preventDefault();
			if(canMove('down'))
			{
				moveDown();
			}
			
		}
	});

	//add touch event
	var isTouchDown=0;
	var startX = 0,
		startY = 0;
	
	var view = document.querySelector("#view");
	view.addEventListener("touchstart",function(e){
		e.preventDefault();
		
		startX=e.changedTouches[0].pageX;
		startY=e.changedTouches[0].pageY;
		isTouchDown=1;
	});

	view.addEventListener("touchend",function(e){
		e.preventDefault();

	if(isTouchDown != 1)
		return;

	var endX = e.changedTouches[0].pageX;
	var endY = e.changedTouches[0].pageY;

	var dX= endX - startX;
	var dY= endY - startY;
	if(Math.abs(dX)<50 && Math.abs(dY)<50){
		return;
	}else{ 
		if(Math.abs(dX) > Math.abs(dY))
		{
			if(dX>0 && canMoveRight())
			{
				moveRight();
				isTouchDown=0;
			}else if(dX<0 && canMoveLeft())
			{
				moveLeft();
				isTouchDown=0;
			}
		}else if(Math.abs(dX) <= Math.abs(dY))
		{
			if(canMoveDown() && dY>0)
			{
				moveDown();
				isTouchDown=0;
			}																
			else if(canMoveUp() && dY<0)
			{
				moveUp();
				isTouchDown=0;
			}
		}
	}
	});
};

//能否向相应的方向移动
Game.prototype.canMove = function(direction) {
	for(var i=0;i<4;i++)
	{
		for(var j=1;j<4;j++)
		{
			if( direction === 'left'){
				if ( this.boardData[i][j].value !==0 && (this.boardData[i][j-1].value ===0 || this.boardData[i][j].value === this.boardData[i][j-1].value) )
				{
					return true;
				}
			}else if ( direction === 'right') {
				if(this.boardData[i][3-j].value !==0 && (this.boardData[i][4-j].value ===0 || this.boardData[i][3-j].value === this.boardData[i][4-j].value)){
					return true;
				}
			}else if( direction === 'up'){
				if(this.boardData[j][i].value !==0 && (this.boardData[j-1][i].value ===0 || this.boardData[j][i].value === this.boardData[j-1][i].value)){
					return true;
				}
			}else if( direction === 'down'){
				if(this.boardData[3-j][i].value !==0 && (this.boardData[4-j][i].value ===0 || this.boardData[3-j][i].value === this.boardData[4-j][i].value)){
					return true;
				}
			}else{
				return canMove('left') || canMove('right') || canMove('up') || canMove('down');
			}
		}
	}
	return false;
};

//移动
Game.prototype.move = function(direction) {
	if( direction === 'up' || direction === 'down'){
		var boardTemp = [];
		var i = 0,
			j = 0;
		for(i=0; i<4; i++){
			boardTemp[i] = [];
			for(j=0; j<4; j++){
				boardTemp[i][j] = board[j][i];
			}
		}
	}
};
// 初始化游戏数据
Game.prototype.initData = function() {
	for ( var i = 0; i < 4; i++){
		this.boardData[i] = [];
		for ( var j = 0; j < 4; j++) {
			this.boardData[i][j] = new OneBlock();
		}
	}

}


Game.prototype.getRandomNumber = function() {
	while ( true ) {
		var h = Math.floor( Math.random()*4 );
		var l = Math.floor( Math.random()*4 );

		if( this.boardData[h][l].value === 0 )
		{
			this.boardData[h][l].value = (Math.random()>0.5?2:4);
			
			this.boardData[h][l].random = true;
			break;
		}
	}
};
