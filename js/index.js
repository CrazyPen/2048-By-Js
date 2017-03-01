"use strict";
//store current score and previous score
var score = 0,
	preScore = 0;
//can undo or not
var canUndo = false;
//every cell's width and space's width
var cellWidth = 110,
	cellSpace = 16;
var randomCell = {x:-1, y:-1};

//store every cell's location and value(include current', previous',next')
function CellData(){
	this.lastY = -1;
	this.lastX = -1;
	this.lastValue = 0;
	this.lastX1= -1;
	this.lastY1= -1;
	this.lastValue1 =0;
	this.nextY = -1;
	this.nextX = -1;
	this.value = 0;
} 

//store board's data
var board=[];
for(var i=0;i<4;i++)
{
	board[i] =[];
	for(var j=0;j<4;j++)
	{
		board[i][j]=new CellData();
	}
}


//绘制方格
setCss();
getLocalBoard();
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
			if(canMoveLeft())
			{
				moveLeft();
			}
		}
		if(event.which==38)
		{
			event.preventDefault();
			if(canMoveUp())
			{
				moveUp();
			}
		}
		if(event.which==39)
		{
			event.preventDefault();
			if(canMoveRight())
			{
				moveRight();
			}
		}
		if(event.which==40)
		{
			event.preventDefault();
			if(canMoveDown())
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
}

//init board css according screen width
function setCss()
{
	var cells = document.createDocumentFragment();
	var clientWidth = document.body.clientWidth;
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
	document.querySelector("#myScore").textContent = score;
	localStorage.score = score;
	if( score > Number(localStorage.best)){
		document.querySelector("#maxScore").textContent = score;
		localStorage.best = score;
	}
}



//start a new game
function newGame()
{
	score=0;
	updateScore();
	getBest();
	clearBoard();

	randomNumber();
	randomNumber();

	updateBoard();
}

//clear board and data in order to start a game
function clearBoard()
{
	removeCons();
	
	for(var i=0;i<4;i++)
	{
		for(var j=0;j<4;j++)
		{
			board[i][j]=new CellData();
		}
	}
	updateBoard();
}

//update a cell randomly
function randomNumber()
{
	while(true)
	{
		var h=Math.floor(Math.random()*4);
		var l=Math.floor(Math.random()*4);

		if(board[h][l].value===0)
		{
			board[h][l].value=(Math.random()>0.5?2:4);
			board[h][l].lastX = board[h][l].nextX = l;
			board[h][l].lastY = board[h][l].nextY = h;
			
			showOneCell(h, l);
			randomCell.x = l;
			randomCell.y = h;
			break;
		}
		
	}
}

function showOneCell(h, l){
	var con = document.createElement("div");
	con.setAttribute("class", "cell con");
	con.setAttribute("id", "con-"+h+"-"+l);
	con.style.top = cellSpace*(h+1)+cellWidth*(h+0.5)+"px";
	con.style.left = cellSpace*(l+1)+cellWidth*(l+0.5)+"px";
	con.style.width = 0+"px";
	con.style.height = 0+"px";
	con.style.lineHeight = cellWidth+"px";
	con.style.backgroundColor = numberBgColor(board[h][l].value);
	if(board[h][l].value>100 && board[h][l].value<1000){
		con.style.fontSize = cellWidth>100?"60px":"40px";
	}else if(board[h][l].value>1000){
		con.style.fontSize = cellWidth>100?"40px":"30px";
	}
	con.textContent = board[h][l].value;
	view.appendChild(con);
	setTimeout(function(){
		con.style.width = cellWidth+"px";
		con.style.height = cellWidth+"px";
		con.style.top = cellSpace*(h+1)+cellWidth*h+"px";
		con.style.left = cellSpace*(l+1)+cellWidth*l+"px";
	},10);
}
function removeCons(){
	var cons = document.querySelectorAll(".con");
	if(cons.length>0){
		for( var i=0,len=cons.length; i<len; i++){
			view.removeChild(cons[i]);
		}
	}
}

function updateBoard()
{
	removeCons();
		
	var cons = document.createDocumentFragment();
	for(var i=0;i<4;i++)
	{
		for(var j=0;j<4;j++)
		{
			if(board[i][j].value)
			{
				var con = document.createElement("div");
				con.setAttribute("class", "cell con");
				con.setAttribute("id", "con-"+i+"-"+j);
				con.style.top = cellSpace*(i+1)+cellWidth*i+"px";
				con.style.left = cellSpace*(j+1)+cellWidth*j+"px";
				con.style.width = cellWidth+"px";
				con.style.height = cellWidth+"px";
				con.style.lineHeight = cellWidth+"px";
				con.style.backgroundColor = numberBgColor(board[i][j].value);
				if(board[i][j].value>100 && board[i][j].value<1000){
					con.style.fontSize = cellWidth>100?"60px":"40px";
				}else if(board[i][j].value>1000){
					con.style.fontSize = cellWidth>100?"40px":"30px";
				}
				con.textContent = board[i][j].value;
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
		case 2:return "#DEDCDC" ;
		case 4:return "#E4E0B4" ;
		case 8:return "#f2b179" ;
		case 16:return "#FFA500" ;
		case 32:return "#F75F08" ;
		case 64:return "#F82008" ;
		case 128:return "#9DF30C" ;
		case 256:return "#09FA26" ;
		case 512:return "#0DFBA7" ;
		case 1024:return "#0FE0FA" ;
		case 2048:return "#0B84F2" ;
		case 4096:return "#0C4BFA" ;
		case 8192:return "#BD10F8" ;
		default:return "#191970";
	}
}

function canMoveLeft()
{
	for(var i=0;i<4;i++)
	{
		for(var j=1;j<4;j++)
		{
			if(board[i][j].value !==0 && (board[i][j-1].value ===0 || board[i][j].value === board[i][j-1].value))
			{
				return true;
			}
		}
	}
	return false;

}

function canMoveUp()
{
	for(var j=0;j<4;j++)
	{
		for(var i=1;i<4;i++)
		{
			if(board[i][j].value !== 0 && (board[i-1][j].value === 0 || board[i][j].value === board[i-1][j].value))
			{
				return true;
			}
		}
	}
	return false;
}

function canMoveDown()
{
	for(var j=0;j<4;j++)
	{
		for(var i=2;i>=0;i--)
		{
			if(board[i][j].value !== 0 && (board[i+1][j].value === 0 || board[i][j].value == board[i+1][j].value))
			{
				return true;
			}
		}
	}
	return false;
}

function canMoveRight()
{
	for(var i=0;i<4;i++)
	{
		for(var j=2;j>=0;j--)
		{
			if(board[i][j].value !==0 && (board[i][j+1].value === 0 || board[i][j].value === board[i][j+1].value))
			{
				return true;
			}
		}
	}
	return false;
}

function isGameOver()
{
	if(canMoveUp() || canMoveDown() || canMoveRight() || canMoveLeft()){
		return false;
	}else{
		setTimeout(function(){
			document.querySelector("#over").style.display = "block";
			document.querySelector("#finalScore").textContent = score;
			localStorage.remove("board");
			localStorage.score = 0;
			if( score>localStorage.best ){
				localStorage.best = score;
			}
		},300);
	}
}
function cutZero(v){
	return v.value>0;
}

//移动前的准备
function readyMove(boardData){
	boardData = boardData.map(function (v) {
			v.latX1 = -1;
			v.lastY1 = -1;
			v.lastValue1 = 0;

			v.lastX = v.nextX;
			v.lastY = v.nextY;
			v.lastValue = v.value;
			return v;
		});
}
function moveLeft(){
	preScore = score;
	for( var i=0; i<4; i++){
		readyMove(board[i]);
		var temp = board[i].filter(cutZero);
		for (var j = 0; j < temp.length-1; j++) {
			if(temp[j].value===temp[j+1].value){
				temp[j].lastValue = temp[j].value;
				temp[j].value*=2;
				temp[j].nextX = j;

				score+=temp[j].value;
				
				temp[j].lastValue1 = temp[j+1].value;
				temp[j].lastX1 = temp[j+1].nextX;
				temp[j].lastY1 = temp[j+1].nextY;
				temp.splice(j+1,1);
			}
		}
		for(j=0; j<4; j++){
			if( j<temp.length){
				board[i][j] = temp[j];
				temp[j].nextX = j;
			}else{
				board[i][j] = new CellData();
			}
		}
		
	}
	slideAnimate();
}
function moveRight(){
	preScore = score;
	for( var i=0; i<4; i++){
		readyMove(board[i]);
		var temp = board[i].filter(cutZero);
		for (var j = temp.length-1,len=temp.length; j > 0; j--) {
			if(temp[j].value===temp[j-1].value){
				temp[j].lastValue = temp[j].value;
				temp[j].value*=2;
				temp[j].nextX = 4+j-len;

				score+=temp[j].value;

				temp[j].lastValue1 = temp[j-1].value;
				temp[j].lastX1 = temp[j-1].nextX;
				temp[j].lastY1 = temp[j-1].nextY;

				temp.splice(j-1,1);
				j--;
			}
		}
		board[i].splice(0,4);
		board[i] = board[i].concat(temp);
		var k=0;
		while(board[i].length<4){
			board[i].unshift(new CellData());
			k++;
		}
		for(; k<4; k++){
			board[i][k].nextX = k;
		}
		
	}
	slideAnimate();
}
function moveUp(){
	preScore = score;
	var boardTemp = [];
	var i = 0,
		j = 0;
	for(i=0; i<4; i++){
		boardTemp[i] = [];
		for(j=0; j<4; j++){
			boardTemp[i][j] = board[j][i];
		}
	}
	for(i=0; i<4; i++){
		readyMove(boardTemp[i]);
		var temp = boardTemp[i].filter(cutZero);
		for (j = 0; j < temp.length-1; j++) {
			if(temp[j].value===temp[j+1].value){
				temp[j].lastValue = temp[j].value;
				temp[j].value*=2;
				temp[j].nextY = j;

				score+=temp[j].value;

				temp[j].lastValue1 = temp[j+1].value;
				temp[j].lastY1 = temp[j+1].nextY;
				temp[j].lastX1 = temp[j+1].nextX;

				temp.splice(j+1,1);
			}
		}
		for(j=0; j<4; j++){
			if(j<temp.length){
				boardTemp[i][j] = temp[j];
				boardTemp[i][j].nextY = j;
			}else{
				boardTemp[i][j] = new CellData();
			}
		}
		
	}
	for(i=0; i<4; i++){
		for(j=0; j<4; j++){
			board[i][j] = boardTemp[j][i];
		}
	}
	slideAnimate();
}
function moveDown(){
	preScore = score;
	var boardTemp = [];
	var i = 0,
		j = 0,
		len = 0;
	for(i=0; i<4; i++){
		boardTemp[i] = [];
		for(j=0; j<4; j++){
			boardTemp[i][j] = board[j][i];
		}
	}
	for(i=0; i<4; i++){
		readyMove(boardTemp[i]);
		var temp = boardTemp[i].filter(cutZero);
		for (j = temp.length-1,len=temp.length; j > 0; j--) {
			if(temp[j].value===temp[j-1].value){
				temp[j].lastValue = temp[j].value;
				temp[j].value*=2;
				temp[j].nextY = 4+j-len;

				score+=temp[j].value;

				temp[j].lastValue1 = temp[j-1].value;
				temp[j].lastY1 = temp[j-1].nextY;
				temp[j].lastX1 = temp[j-1].nextX;

				temp.splice(j-1,1);
				j--;
			}
		}
		boardTemp[i].splice(0,4);
		boardTemp[i] = boardTemp[i].concat(temp);
		var k=0;
		while(boardTemp[i].length<4){
			boardTemp[i].unshift(new CellData());
			k++;
		}
		for(;k<4;k++){
			boardTemp[i][k].nextY = k;
		}
	}
	for(i=0; i<4; i++){
		for(j=0; j<4; j++){
			board[i][j] = boardTemp[j][i];
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

			if( board[i][j].value){
				var con = document.querySelector("#con-"+board[i][j].lastY+"-"+board[i][j].lastX);
				con.style.left=(cellWidth+cellSpace)*board[i][j].nextX+cellSpace+"px";
				con.style.top =(cellWidth+cellSpace)*board[i][j].nextY+cellSpace+"px";

				if( board[i][j].lastValue1){
					var con1 = document.querySelector("#con-"+board[i][j].lastY1+"-"+board[i][j].lastX1);
					con1.style.left=(cellWidth+cellSpace)*board[i][j].nextX+cellSpace+"px";
					con1.style.top =(cellWidth+cellSpace)*board[i][j].nextY+cellSpace+"px";
				}
			}
		}
	}
	
	setTimeout(function(){
		updateBoard();
		randomNumber();
		setLocalBoard();
		updateScore();
		isGameOver();
	}, 200);
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
	var	cons = document.createDocumentFragment();

	view.removeChild(document.querySelector("#con-"+randomCell.y+"-"+randomCell.x));
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

function setLocalBoard(){
	if( typeof(Storage) === "undefined")
		return ;
	var localBoard = JSON.stringify(board);
	localStorage.board = localBoard;
}


function getLocalBoard(){
	if(typeof(localStorage.board)!="undefined"){
		board = JSON.parse(localStorage.board);
		updateBoard();
	}else{
		newGame();
	}
	if(!localStorage.best){
		localStorage.best = 0;
	}
	document.querySelector("#maxScore").textContent = localStorage.best;
	if( !localStorage.score){
		localStorage.score = 0;
	}
	score = Number(localStorage.score);
	updateScore();
}
