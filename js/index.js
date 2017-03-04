"use strict";
//store current score and previous score
var score      = 0;
var	preScore   = 0;
//can undo or not
var canUndo    = true;
//every cell's width and space's width
var cellWidth  = 110;
var	cellSpace  = 16;
var randomCell = {x:-1, y:-1};
var view       = document.querySelector("#view");

//store every cell's location and value(include current', previous',next')
function CellData(){
	this.lastY      = -1;
	this.lastX      = -1;
	this.lastValue  = 0;
	this.lastX1     = -1;
	this.lastY1     = -1;
	this.lastValue1 = 0;
	this.nextY      = -1;
	this.nextX      = -1;
	this.value      = 0;
} 
function GameData() {
	this.board = [];
	this.score = 0; 
	this.preScore = 0;
	this.canUndo = true;
}
var data = new GameData();
for(var i=0;i<4;i++)
{
	data.board[i] =[];
	for(var j=0;j<4;j++)
	{
		data.board[i][j] = new CellData();
	}
}

//绘制方格
initCss();
if(!getLocalBoard()){
	newGame();
}
getBest();
addMyEventListener();


function addMyEventListener(){
	document.querySelector("#restart").addEventListener("click",newGame);
	document.querySelector("#start").addEventListener("click", function(){
		newGame();
		document.querySelector("#over").style.display = "none";
	});
	document.querySelector("#undo").addEventListener("click", undo);

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
	var isTouchDown = 0;
	var startX      = 0,
		startY      = 0;
	
	var view = document.querySelector("#view");
	view.addEventListener("touchstart",function(e){
		e.preventDefault();
		
		startX      = e.changedTouches[0].pageX;
		startY      = e.changedTouches[0].pageY;
		isTouchDown = 1;
	});

	view.addEventListener("touchend",function(e){
		e.preventDefault();

	if(isTouchDown != 1)
		return;

	var endX = e.changedTouches[0].pageX;
	var endY = e.changedTouches[0].pageY;

	var dX = endX - startX;
	var dY = endY - startY;
	if(Math.abs(dX)<50 && Math.abs(dY)<50){
		return;
	}else{ 
		if(Math.abs(dX) > Math.abs(dY))
		{
			if(dX>0 && canMove('right'))
			{
				moveRight();
				isTouchDown = 0;
			}else if(dX<0 && canMove('left'))
			{
				moveLeft();
				isTouchDown = 0;
			}
		}else if(Math.abs(dX) <= Math.abs(dY))
		{
			if( canMove('down') && dY>0 )
			{
				moveDown();
				isTouchDown = 0;
			}																
			else if( canMove('up') && dY<0 )
			{
				moveUp();
				isTouchDown = 0;
			}
		}
	}
	});
}

//init board css according screen width
function initCss()
{
	var view        = document.querySelector("#view");
	
	var clientWidth = document.body.clientWidth;
	if(clientWidth<500)
	{
		document.querySelector("#game").style.width  = clientWidth+"px";
		document.querySelector("#game").style.height = clientWidth+125+"px";
		view.style.width  = clientWidth-20+"px";
		view.style.height = clientWidth-20+"px";
		
		var over          = document.querySelector("#over");
		over.style.width  = clientWidth-20+"px";
		over.style.height = clientWidth-20+"px";
		
		cellWidth         = (clientWidth-20)*0.2;
		cellSpace         = (clientWidth-20)*0.04;
	}
	
	var cells = document.createDocumentFragment();
	for(var i=0; i<4; i++){
		for(var j=0; j<4; j++){
			var cell          = document.createElement("div");
			cell.setAttribute("class", "cell");
			cell.style.top    = cellSpace*(i+1)+cellWidth*i+"px";
			cell.style.left   = cellSpace*(j+1)+cellWidth*j+"px";
			cell.style.width  = cellWidth+"px";
			cell.style.height = cellWidth+"px";
			cells.appendChild(cell);
		}
	}
	
	view.appendChild(cells);
}

//get best score from localStorage
function getBest(){
	if(typeof(Storage) !== "undefined"){
		if(!localStorage.best){
			localStorage.best = 0;
		}
		document.querySelector("#maxScore").textContent = localStorage.best;
	}
}

//update current score after every step
function updateScore()
{
	document.querySelector("#myScore").textContent = data.score;
	localStorage.score = data.score;
	if( data.score > Number(localStorage.best)){
		document.querySelector("#maxScore").textContent = data.score;
		localStorage.best = data.score;
	}
}



//start a new game
function newGame()
{
	data.score=0;
	updateScore();
	getBest();
	clearBoard();
	localStorage.removeItem("board");

	getRandomNumber();
	getRandomNumber();
	localStorage.removeItem("random");

	document.querySelector("#undo").setAttribute("disabled", "true");
	document.querySelector("#undo").style.backgroundColor = "#CECECE";

	updateBoardView();

}

//clear board and data in order to start a game
function clearBoard()
{
	removeCons();
	
	for(var i=0;i<4;i++)
	{
		for(var j=0;j<4;j++)
		{
			data.board[i][j]=new CellData();
		}
	}
	updateBoardView();
}

//update a cell randomly
function getRandomNumber()
{
	while(true)
	{
		var h=Math.floor(Math.random()*4);
		var l=Math.floor(Math.random()*4);

		if(data.board[h][l].value===0)
		{
			data.board[h][l].value = (Math.random()>0.5?2:4);
			data.board[h][l].lastX = data.board[h][l].nextX = l;
			data.board[h][l].lastY = data.board[h][l].nextY = h;
			
			showRandomCell(h, l);

			randomCell.x = l;
			randomCell.y = h;
			localStorage.random = JSON.stringify(randomCell);

			break;
		}
		
	}
}

function showRandomCell(h, l){
	var con = document.createElement("div");
	con.setAttribute("class", "cell con");
	con.setAttribute("id", "con-"+h+"-"+l);
	con.style.top             = cellSpace*(h+1)+cellWidth*h+"px";
	con.style.left            = cellSpace*(l+1)+cellWidth*l+"px";
	con.style.width           = cellWidth + 'px';
	con.style.height          = cellWidth + 'px';
	con.style.transform       = "scale(0,0)";
	con.style.lineHeight      = cellWidth+"px";
	con.style.backgroundColor = numberBgColor(data.board[h][l].value);
	if(data.board[h][l].value>100 && data.board[h][l].value<1000){
		con.style.fontSize = cellWidth>100?"60px":"40px";
	}else if(data.board[h][l].value>1000){
		con.style.fontSize = cellWidth>100?"40px":"30px";
	}
	con.textContent = data.board[h][l].value;
	view.appendChild(con);
	setTimeout(function(){
		con.style.transform = "scale(1,1)";
	},100);
}
function removeCons(){
	var cons = document.querySelectorAll(".con");
	if(cons.length>0){
		for( var i=0,len=cons.length; i<len; i++){
			view.removeChild(cons[i]);
		}
	}
}

function updateBoardView()
{
	removeCons();
		
	var cons = document.createDocumentFragment();
	for(var i=0;i<4;i++)
	{
		for(var j=0;j<4;j++)
		{
			if(data.board[i][j].value)
			{
				var con = document.createElement("div");
				con.setAttribute("class", "cell con");
				con.setAttribute("id", "con-"+i+"-"+j);
				con.style.top             = cellSpace*(i+1)+cellWidth*i+"px";
				con.style.left            = cellSpace*(j+1)+cellWidth*j+"px";
				con.style.width           = cellWidth+"px";
				con.style.height          = cellWidth+"px";
				con.style.lineHeight      = cellWidth+"px";
				con.style.backgroundColor = numberBgColor(data.board[i][j].value);
				if(data.board[i][j].value>100 && data.board[i][j].value<1000){
					con.style.fontSize = cellWidth>100?"60px":"40px";
				}else if(data.board[i][j].value>1000){
					con.style.fontSize = cellWidth>100?"40px":"30px";
				}
				con.textContent = data.board[i][j].value;
				cons.appendChild(con);
			}
		}
	}
	view.appendChild(cons);

}

function numberBgColor(num)
{
	switch (num)
	{
		case 2:return "#EFEFEF" ;
		case 4:return "#E6DFBB" ;
		case 8:return "#FECEA8" ;
		case 16:return "#FCCB70" ;
		case 32:return "#FFD5BC" ;
		case 64:return "#F7D396" ;
		case 128:return "#F6E67B" ;
		case 256:return "#FAD14A" ;
		case 512:return "#FBD70D" ;
		case 1024:return "#FABA0F" ;
		case 2048:return "#F2970B" ;
		case 4096:return "#FA710C" ;
		case 8192:return "#F86E10" ;
		default:return "#C54A19";
	}
}
function canMove( direction ) {
	for(var i=0;i<4;i++)
	{
		for(var j=1;j<4;j++)
		{
			if( direction === 'left'){
				if ( data.board[i][j].value !==0 && (data.board[i][j-1].value ===0 || data.board[i][j].value === data.board[i][j-1].value) )
				{
					return true;
				}
			}else if ( direction === 'right') {
				if(data.board[i][3-j].value !==0 && (data.board[i][4-j].value ===0 || data.board[i][3-j].value === data.board[i][4-j].value)){
					return true;
				}
			}else if( direction === 'up'){
				if(data.board[j][i].value !==0 && (data.board[j-1][i].value ===0 || data.board[j][i].value === data.board[j-1][i].value)){
					return true;
				}
			}else if( direction === 'down'){
				if(data.board[3-j][i].value !==0 && (data.board[4-j][i].value ===0 || data.board[3-j][i].value === data.board[4-j][i].value)){
					return true;
				}
			}else{
				return canMove('left') || canMove('right') || canMove('up') || canMove('down');
			}
		}
	}
	return false;
}

function cutZero(v){
	return v.value>0;
}
// work before moving (update lastX, lastY, lastValue and so on)
function updatedBoard() {
	return data.board.map(function(h){
		return h.map(function(l) {
			l.latX1      = -1;
			l.lastY1     = -1;
			l.lastValue1 = 0;
			
			l.lastX      = l.nextX;
			l.lastY      = l.nextY;
			l.lastValue  = l.value;
			return l;
		});
	});
}
//exchange board

function moveLeft(){
	preScore = score;
	data.board = updatedBoard();
	moveType( 'left', data.board );
	slideAnimate();
}
function moveRight(){
	preScore = score;
	data.board = updatedBoard();
	moveType('right', data.board);
	slideAnimate();
}

function moveType( type, boardData ) {
	var temp = [];
	var i,j,k;
	if( type === 'left' || type === 'up') {
		for( i=0; i<4; i++){

			temp = boardData[i].filter(function(item){return item.value>0;});
			for ( j = 0; j < temp.length-1; j++ ) {
				if ( temp[j].value === temp[j+1].value ) {
					temp[j].lastValue  = temp[j].value;
					temp[j].value     *= 2;
					
					score             += temp[j].value;
					
					temp[j].lastValue1 = temp[j+1].value;
					temp[j].lastX1     = temp[j+1].nextX;
					temp[j].lastY1     = temp[j+1].nextY;
					temp.splice(j+1,1);
				}
			}
			for(j=0; j<4; j++){
				if( j<temp.length){
					boardData[i][j]   = temp[j];
					if ( type === 'left' ){
						temp[j].nextX = j;
					}else {
						temp[j].nextY = j;
					}
					
				}else{
					boardData[i][j]   = new CellData();
				}
			}
			
			
		}
	}
	if( type === 'down' || type === 'right') {
		for( i=0; i<4; i++){
			temp = boardData[i].filter(function(item){return item.value>0;});
			for ( j = temp.length-1; j > 0; j-- ) {
				if(temp[j].value===temp[j-1].value){
					temp[j].lastValue  = temp[j].value;
					temp[j].value     *= 2;
					
					score              +=temp[j].value;
					
					temp[j].lastValue1 = temp[j-1].value;
					temp[j].lastX1     = temp[j-1].nextX;
					temp[j].lastY1     = temp[j-1].nextY;
					
					temp.splice(j-1,1);
					j--;
				}
			}
			boardData[i].splice(0,4);
			boardData[i] = boardData[i].concat(temp);
			k=0;
			while(boardData[i].length<4){
				boardData[i].unshift(new CellData());
				k++;
			}
			for(; k<4; k++){
				if( type === 'right' )
					boardData[i][k].nextX = k;
				else
					boardData[i][k].nextY = k;
			}
				
			}
	}

	data.board.map(function(v1, h){
		return v1.map(function(v2, l){
			return boardData[h][l];
		});
	});
}
function moveUp(){
	preScore = score;
	data.board = updatedBoard();
	var boardTemp = [];
	var i = 0,
		j = 0;
	for(i=0; i<4; i++){
		boardTemp[i] = [];
		for(j=0; j<4; j++){
			boardTemp[i][j] = data.board[j][i];
		}
	}
	moveType('up', boardTemp);
	
	for(i=0; i<4; i++){
		for(j=0; j<4; j++){
			data.board[i][j] = boardTemp[j][i];
		}
	}
	slideAnimate();
}
function moveDown(){
	preScore = score;
	data.board = updatedBoard();
	var boardTemp = [];
	var i = 0,
		j = 0;
	for(i=0; i<4; i++){
		boardTemp[i] = [];
		for(j=0; j<4; j++){
			boardTemp[i][j] = data.board[j][i];
		}
	}
	moveType('down', boardTemp);
	for(i=0; i<4; i++){
		for(j=0; j<4; j++){
			data.board[i][j] = boardTemp[j][i];
		}
	}
	slideAnimate();
}

function slideAnimate(){
	//上一步可用
	canUndo = true;
	document.querySelector("#undo").removeAttribute("disabled");
	document.querySelector("#undo").style.backgroundColor = "#8f7a66";

	for(var i=0; i<4; i++){
		for(var j=0; j<4; j++){

			if( data.board[i][j].value){
				var con = document.querySelector("#con-"+data.board[i][j].lastY+"-"+data.board[i][j].lastX);
				con.style.left=(cellWidth+cellSpace)*data.board[i][j].nextX+cellSpace+"px";
				con.style.top =(cellWidth+cellSpace)*data.board[i][j].nextY+cellSpace+"px";
				if( data.board[i][j].lastValue1){
					var con1 = document.querySelector("#con-"+data.board[i][j].lastY1+"-"+data.board[i][j].lastX1);
					con1.style.left=(cellWidth+cellSpace)*data.board[i][j].nextX+cellSpace+"px";
					con1.style.top =(cellWidth+cellSpace)*data.board[i][j].nextY+cellSpace+"px";
				}
			}
		}
	}
	
	setTimeout(function(){
		updateBoardView();
		getRandomNumber();
		localStorage.board = JSON.stringify(data.board);
		updateScore();
		if(!canMove()){
			setTimeout(function(){
				document.querySelector("#over").style.display = "block";
				document.querySelector("#finalScore").textContent = score;
				localStorage.removeItem("board");
				localStorage.score = 0;
				if( score>localStorage.best ){
					localStorage.best = data.score;
				}
			},300);
		}
	}, 150);
}
function undo(){
	if( !canUndo){
		return;
	}
	//上一步不可用
	canUndo = false;
	document.querySelector("#undo").setAttribute("disabled", "true");
	document.querySelector("#undo").style.backgroundColor = "#CECECE";
	board[randomCell.y][randomCell.x].value = 0;
	board[randomCell.y][randomCell.x].lastX = board[randomCell.y][randomCell.x].nextX = -1;
	board[randomCell.y][randomCell.x].lastY = board[randomCell.y][randomCell.x].nextY = -1;
	
	document.querySelector("#con-"+randomCell.y+"-"+randomCell.x).style.transform = "scale(0,0)";

	setTimeout(function(){
		view.removeChild(document.querySelector("#con-"+randomCell.y+"-"+randomCell.x));}, 150);

	var	cons = document.createDocumentFragment();
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			if( board[i][j].value){
				board[i][j].nextX = board[i][j].lastX;
				board[i][j].nextY = board[i][j].lastY;
				board[i][j].value = board[i][j].lastValue;
				board[i][j].lastX = -1;
				board[i][j].lastY = -1;
				board[i][j].lastValue = 0;
				var con = document.querySelector("#con-"+i+"-"+j);
				con.textContent = board[i][j].value;
				con.style.backgroundColor = numberBgColor(board[i][j].value);
				con.setAttribute("id", "con-"+board[i][j].nextY+"-"+board[i][j].nextX);

				if(board[i][j].lastValue1) {
					var con1 = document.createElement("div");
					con1.setAttribute("class", "cell con");
					con1.setAttribute("id", "con-"+board[i][j].lastY1+"-"+board[i][j].lastX1);
					con1.style.top = (cellWidth+cellSpace)*i+cellSpace+"px";
					con1.style.left = (cellSpace+cellWidth)*j+cellSpace+"px";
					con1.style.width = cellWidth+"px";
					con1.style.height = cellWidth+"px";
					con1.style.lineHeight = cellWidth+"px";
					con1.style.backgroundColor = numberBgColor(board[i][j].lastValue1);
					con1.textContent = board[i][j].lastValue1;
					cons.appendChild(con1);
				}
			}
		}
	}
	view.appendChild(cons);

	score = preScore;

	setTimeout(function(){
		for(var i=0; i<4; i++){
			for(var j=0; j<4; j++){
				if( document.querySelector("#con-"+i+"-"+j)){
					document.querySelector("#con-"+i+"-"+j).style.top=(cellSpace+cellWidth)*i+cellSpace+"px";
					document.querySelector("#con-"+i+"-"+j).style.left=(cellSpace+cellWidth)*j+cellSpace+"px";

					board[i][j].value = Number(document.querySelector("#con-"+i+"-"+j).textContent);
					board[i][j].lastX = board[i][j].nextX = j;
					board[i][j].lastY = board[i][j].nextY = i;
					board[i][j].lastX1 = -1;
					board[i][j].lastY1 = -1;
					board[i][j].lastValue = 0;
				}else{
					board[i][j].value = 0;
					board[i][j].nextX = -1;
					board[i][j].nextY = -1;
				}
			}
		}
		updateScore();
	}, 200);
	
}

function getLocalBoard() {
	if( typeof(localStorage.board)!="undefined"){
		data.board = JSON.parse(localStorage.board);
		updateBoardView();

		randomCell = JSON.parse(localStorage.random);
		data.canUndo = true;

		data.score = Number(localStorage.score);
		document.querySelector("#myScore").textContent = data.score;

		return true;
	}else{
		return false;
	}
}