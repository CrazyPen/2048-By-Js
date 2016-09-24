var score=0;
var cellWidth = 110,
	cellSpace = 16;
function cellData(){
	this.lastY = -1;
	this.lastX = -1;
	this.lastValue = 0;
	this.lastX1= -1;
	this.lastY1= -1;
	this.lastValue =0;
	this.nextY = -1;
	this.nextX = -1;
	
	this.value = 0;
} 
var board=[];
for(var i=0;i<4;i++)
{
	board[i] =[];
	for(var j=0;j<4;j++)
	{
		board[i][j]=new cellData();
	}
}

//绘制方格
setCss();


newGame();
getBest();

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

var isTouchDown=0;
document.addEventListener("touchstart",function(e){
	e.preventDefault();
	
	startX=e.changedTouches[0].pageX;
	startY=e.changedTouches[0].pageY;
	isTouchDown=1;
});

document.addEventListener("touchend",function(e){
	e.preventDefault();

if(isTouchDown != 1)
	return;

var endX = e.changedTouches[0].pageX;
var endY = e.changedTouches[0].pageY;

var dX= endX - startX;
var dY= endY - startY;

if(Math.abs(dX)<50 && Math.abs(dY)<50){
	return;
}else{ if(Math.abs(dX) > Math.abs(dY))
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
		}}
});

document.addEventListener("mousedown",function(event) {
	event.preventDefault();
	var startMouseX=event.clientX;
	var startMouseY=event.clientY;


	document.onmouseup=function(event) {
		event.preventDefault();
		var endMouseX=event.clientX;
		var endMouseY=event.clientY;

		var mouseX=endMouseX-startMouseX;
		var mouseY=endMouseY-startMouseY;

		if(Math.abs(mouseX)<50 && Math.abs(mouseY)<50){
			return;
		}else { if(Math.abs(mouseX) > Math.abs(mouseY))
				{
					if(mouseX>0 && canMoveRight())
					{
						moveRight();
						updateScore();
						isGameOver();
					}else if(mouseX<0 && canMoveLeft())
					{
						moveLeft();
						updateScore();
						isGameOver();
					}
				}else if(Math.abs(mouseX) <= Math.abs(mouseY))
				{
					if(canMoveBottom() && mouseY>0)
					{
						moveBottom();
						updateScore();
						isGameOver();
					}																
					else if(canMoveTop() && mouseY<0)
					{
						moveTop();
						updateScore();
						isGameOver();
					}
				}}

	};
});


function setCss()
{
	var view = document.querySelector("#view");
	var cells = document.createDocumentFragment();
	clientWidth = document.body.clientWidth;
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
function getBest(){
	if(typeof(Storage) !== "undefined"){
		if(!localStorage.best){
			localStorage.best = 0;
		}
		document.querySelector("#maxScore").textContent = localStorage.best;
	}
}
function updateScore()
{
	document.querySelector("#myScore").textContent = score;
}




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

function clearBoard()
{
	var cons = document.querySelectorAll(".con");
	if(cons.length>0){
		for( var i=0,len=cons.length; i<len; i++){
			cons[i].parentNode().removeChild(cons[i]);
		}
	}
	
	for(var i=0;i<4;i++)
	{
		for(var j=0;j<4;j++)
		{
			board[i][j]=new cellData();
		}
	}
	updateBoard();
}

function randomNumber()
{
	var view = document.querySelector("#view");
	while(true)
	{
		var h=Math.floor(Math.random()*4);
		var l=Math.floor(Math.random()*4);

		if(board[h][l].value==0)
		{
			board[h][l].value=(Math.random()>0.5?2:4);
			board[h][l].lastX = board[h][l].nextX = l;
			board[h][l].lastY = board[h][l].nextY = h;

			var con = document.createElement("div");
			con.setAttribute("class", "cell con");
			con.setAttribute("id", "con-"+h+"-"+l);
			con.style.top = cellSpace*(h+1)+cellWidth*h+"px";
			con.style.left = cellSpace*(l+1)+cellWidth*l+"px";
			con.style.width = cellWidth+"px";
			con.style.height = cellWidth+"px";
			con.style.lineHeight = cellWidth+"px";
			con.style.backgroundColor = numberBgColor(board[h][l].value);
			if(board[h][l].value>100 && board[h][l].value<1000){
				con.style.fontSize = cellWidth>100?"60px":"40px";
			}else if(board[h][l].value>1000){
				con.style.fontSize = cellWidth>100?"40px":"20px";
			}
			con.textContent = board[h][l].value;
			view.appendChild(con);
			break;
		}
		
	}
}

function updateBoard()
{

	var cons = document.querySelectorAll(".con");
		view = document.getElementById("view");
	if(cons.length>0){
		for( var i=0,len=cons.length; i<len; i++){
			view.removeChild(cons[i]);
		}
	}
	

	
	var cons = document.createDocumentFragment();
	for(var i=0;i<4;i++)
	{
		for(var j=0;j<4;j++)
		{
			if(board[i][j].value)
			{
				console.log(i+","+j);
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
					con.style.fontSize = cellWidth>100?"40px":"20px";
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
		case 2:return "#DEDCDC" ;break;
		case 4:return "#E4E0B4" ;break;
		case 8:return "#f2b179" ;break;
		case 16:return "#FFA500" ;break;
		case 32:return "#FF8C00" ;break;
		case 64:return "#FF6347" ;break;
		case 128:return "#FF4500" ;break;
		case 256:return "#C71585" ;break;
		case 512:return "#B22222" ;break;
		case 1024:return "#7B68EE" ;break;
		case 2048:return "#7B68EE" ;break;
		case 4096:return "#483D8B" ;break;
		case 8192:return "#800080" ;break;
		default:return "#191970";
	}
}

function canMoveLeft()
{
	for(var i=0;i<4;i++)
	{
		for(var j=1;j<4;j++)
		{
			if(board[i][j].value !=0 && board[i][j-1].value ==0 )
			{
				return true;
			}
			if(board[i][j].value !=0 && board[i][j].value == board[i][j-1].value)
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
			if(board[i][j].value !=0 && board[i-1][j].value ==0 )
			{
				return true;
			}
			if(board[i][j].value !=0 && board[i][j].value === board[i-1][j].value)
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
			if(board[i][j].value !=0 && board[i+1][j].value ==0 )
			{
				return true;
			}
			if(board[i][j].value !=0 && board[i][j].value == board[i+1][j].value)
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
			if(board[i][j].value !=0 && board[i][j+1].value ==0 )
			{
				return true;
			}
			if(board[i][j].value !=0 && board[i][j].value == board[i][j+1].value)
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
			if( score>localStorage.best ){
				localStorage.best = score;
			}
		},300);
	}
}
function cutZero(v){
	return v.value>0;
}

function moveLeft(){
	for( var i=0; i<4; i++){
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
		for(var j=0; j<4; j++){
			if( j<temp.length){
				board[i][j] = temp[j];
				temp[j].nextX = j;
			}else{
				board[i][j] = new cellData();
			}
		}
		
	}
	slideAnimate();
}
function moveRight(){
	for( var i=0; i<4; i++){
		var temp = board[i].filter(function(v){
			return v.value>0;
		});
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
			}
		}
		board[i].splice(0,4);
		board[i] = board[i].concat(temp);
		var k=0;
		while(board[i].length<4){
			board[i].unshift(new cellData());
			k++;
		}
		for(; k<4; k++){
			board[i][k].nextX = k;
		}
		
	}
	slideAnimate();
}
function moveUp(){
	var boardTemp = [];
	for(var i=0; i<4; i++){
		boardTemp[i] = [];
		for(var j=0; j<4; j++){
			boardTemp[i][j] = board[j][i];
		}
	}
	for( var i=0; i<4; i++){
		var temp = boardTemp[i].filter(function(v){
			return v.value>0;
		});
		for (var j = 0; j < temp.length-1; j++) {
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
		for(var j=0; j<4; j++){
			if(j<temp.length){
				boardTemp[i][j] = temp[j]
				boardTemp[i][j].nextY = j;
			}else{
				boardTemp[i][j] = new cellData();
			}
		}
		
	}
	for(var i=0; i<4; i++){
		for(var j=0; j<4; j++){
			board[i][j] = boardTemp[j][i];
		}
	}
	slideAnimate();
}
function moveDown(){
	var boardTemp = [];
	for(var i=0; i<4; i++){
		boardTemp[i] = [];
		for(var j=0; j<4; j++){
			boardTemp[i][j] = board[j][i];
		}
	}
	for( var i=0; i<4; i++){
		var temp = boardTemp[i].filter(function(v){
			return v.value>0;
		});
		for (var j = temp.length-1,len=temp.length; j > 0; j--) {
			if(temp[j].value===temp[j-1].value){
				temp[j].lastValue = temp[j].value;
				temp[j].value*=2;
				temp[j].nextY = 4+j-len;

				score+=temp[j].value;

				temp[j].lastValue1 = temp[j-1].value;
				temp[j].lastY1 = temp[j-1].nextY;
				temp[j].lastX1 = temp[j-1].nextX;

				temp.splice(j-1,1);
			}
		}
		boardTemp[i].splice(0,4);
		boardTemp[i] = boardTemp[i].concat(temp);
		var k=0;
		while(boardTemp[i].length<4){
			boardTemp[i].unshift(new cellData());
			k++;
		}
		for(;k<4;k++){
			boardTemp[i][k].nextY = k;
		}
	}
	for(var i=0; i<4; i++){
		for(var j=0; j<4; j++){
			board[i][j] = boardTemp[j][i];
		}
	}
	slideAnimate();
}

function slideAnimate(){
	console.log(arguments);
	for(var i=0; i<4; i++){
		for(var j=0; j<4; j++){

			if( board[i][j].value){
				console.log("animate");
				var con = document.querySelector("#con-"+board[i][j].lastY+"-"+board[i][j].lastX);
				console.log("#con-"+board[i][j].lastY+"-"+board[i][j].lastX)
				console.log(+board[i][j].nextY+"-"+board[i][j].nextX)
				con.style.left=(cellWidth+cellSpace)*board[i][j].nextX+cellSpace+"px";
				con.style.top =(cellWidth+cellSpace)*board[i][j].nextY+cellSpace+"px";

				if( board[i][j].lastValue1){
					var con1 = document.querySelector("#con-"+board[i][j].lastY1+"-"+board[i][j].lastX1);
					console.log(board[i][j].lastY1+"-"+board[i][j].lastX1);
					con1.style.left=(cellWidth+cellSpace)*board[i][j].nextX+cellSpace+"px";
					con1.style.top =(cellWidth+cellSpace)*board[i][j].nextY+cellSpace+"px";
					board[i][j].lastValue1 = 0;
				}
				

				board[i][j].lastX = board[i][j].nextX;
				board[i][j].lastY = board[i][j].nextY;
			}
		}
	}
	setTimeout(function(){
		updateBoard();
		randomNumber();
		updateScore();
		isGameOver();
	}, 200);
}

