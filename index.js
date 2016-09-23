var score=0;
var canAdd=new Array();
var cellWidth = 110,
	cellSpace = 16;
for(var i=0;i<4;i++)
{
	canAdd[i]=new Array();
	for(var j=0;j<4;j++)
	{
		canAdd[i][j]=1;
	}
}
var board=new Array();

for(var i=0;i<4;i++)
{
	board[i] =new Array();
	for(var j=0;j<4;j++)
	{
		board[i][j]=0;
	}
}

//绘制方格
setCss();
	
newGame();

// $("#start").click(function(){newGame();});
// document.getElementById("start").addEventListener("touchstart",function(){
// 	document.getElementById("start").addEventListener("touchend",function(){
// 		newGame();
// });
// });

document.addEventListener("keydown",function(event){
	
	if(event.which==37)
	{
		event.preventDefault();
		if(canMoveLeft())
		{
			moveLeft();
			updateScore();
			isGameOver();
		}
	}
	if(event.which==38)
	{
		event.preventDefault();
		if(canMoveTop())
		{
			moveTop();
			updateScore();
			isGameOver();
		}
	}
	if(event.which==39)
	{
		event.preventDefault();
		if(canMoveRight())
		{
			moveRight();
			updateScore();
			isGameOver();
		}
	}
	if(event.which==40)
	{
		event.preventDefault();
		if(canMoveBottom())
		{
			moveBottom();
			updateScore();
			isGameOver();
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
				updateScore();
				isGameOver();
				isTouchDown=0;
			}else if(dX<0 && canMoveLeft())
			{
				moveLeft();
				updateScore();
				isGameOver();
				isTouchDown=0;
			}
		}else if(Math.abs(dX) <= Math.abs(dY))
		{
			if(canMoveBottom() && dY>0)
			{
				moveBottom();
				updateScore();
				isGameOver();
				isTouchDown=0;
			}																
			else if(canMoveTop() && dY<0)
			{
				moveTop();
				updateScore();
				isGameOver();
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

function updateScore()
{
	document.querySelector("#myScore").textContent = score;
}




function newGame()
{
	score=0;
	updateScore();
	formCanAdd();
	removeBoard();

	randomNumber();
	randomNumber();

	updateBoard();
}

function formCanAdd()
{
	for(var i=0;i<4;i++)
	{
		for(var j=0;j<4;j++)
		{
			canAdd[i][j]=1;
		}
	}
}

function removeBoard()
{
	var fss = document.querySelectorAll(".fs");
	for( var i=0,len=fss.length; i<len; i++){
		fss.parentNode().removeChild(fss[0]);
	}
	for(var i=0;i<4;i++)
	{
		for(var j=0;j<4;j++)
		{
			board[i][j]=0;
		}
	}
	updateBoard();
}

function randomNumber()
{
	
	while(true)
	{
		var h=Math.floor(Math.random()*4);
		var l=Math.floor(Math.random()*4);

		if(board[h][l]==0)
		{
			board[h][l]=(Math.random()>0.5?2:4);
			break;
		}
	}
}

function updateBoard()
{

	var fss = document.querySelectorAll(".fs");
	for( var i=0,len=fss.length; i<len; i++){
		fss.parentNode().removeChild(fss[0]);
	}

	var view = document.getElementById("view")
	var cons = document.createDocumentFragment();
	for(var i=0;i<4;i++)
	{
		for(var j=0;j<4;j++)
		{
			if(board[i][j])
			{
				var con = document.createElement("div");
				con.setAttribute("class", "cell con");
				con.setAttribute("id", "cell-"+i+"-"+j);
				con.style.top = cellSpace*(i+1)+cellWidth*i+"px";
				con.style.left = cellSpace*(j+1)+cellWidth*j+"px";
				con.style.width = cellWidth+"px";
				con.style.height = cellWidth+"px";
				con.style.lineHeight = cellWidth+"px";
				con.style.backgroundColor = numberBgColor(board[i][j]);
				con.textContent = board[i][j];
				cons.appendChild(con);
			}else{
				// document.querySelector("#min-"+i+"-"+j).parentNode().removeChild(document.querySelector("#min-"+i+"-"+j));
			}
		}
	}

	view.appendChild(cons);
}

function numberBgColor(num)
{
	switch (num)
	{
		case 2:return "#D3D3D3" ;break;
		case 4:return "#F5DEB3" ;break;
		case 8:return "#F4A460" ;break;
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
			if(board[i][j] !=0 && board[i][j-1] ==0 )
			{
				return true;
			}
			if(board[i][j] !=0 && board[i][j] == board[i][j-1])
			{
				return true;
			}
		}
	}
	return false;
}

function canMoveTop()
{
	for(var j=0;j<4;j++)
	{
		for(var i=1;i<4;i++)
		{
			if(board[i][j] !=0 && board[i-1][j] ==0 )
			{
				return true;
			}
			if(board[i][j] !=0 && board[i][j] == board[i-1][j])
			{
				return true;
			}
		}
	}
	return false;
}

function canMoveBottom()
{
	for(var j=0;j<4;j++)
	{
		for(var i=2;i>=0;i--)
		{
			if(board[i][j] !=0 && board[i+1][j] ==0 )
			{
				return true;
			}
			if(board[i][j] !=0 && board[i][j] == board[i+1][j])
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
			if(board[i][j] !=0 && board[i][j+1] ==0 )
			{
				return true;
			}
			if(board[i][j] !=0 && board[i][j] == board[i][j+1])
			{
				return true;
			}
		}
	}
	return false;
}


function moveLeft()
{
	formCanAdd();
	for(var i=0;i<4;i++)
	{
		for(var j=1;j<4;j++)
		{
			for(var k=0;k<j;k++)
			{
				if(board[i][k] == 0 && noBlockLeft(i,k,j))
				{
					board[i][k]=board[i][j];
					
					board[i][j]=0;
					document.querySelector("#"+i+"_"+j).style.top = minCell*(i+1)+minWidth*i+"px";
					document.querySelector("#"+i+"_"+j).style.left = minCell*(k+1)+minWidth*k+"px";

					continue;
					
				}
				if(board[i][k] != 0 && canAdd[i][k]==1 && board[i][k]==board[i][j] && noBlockLeft(i,k,j))
				{
					board[i][k] = 2*board[i][j];
					score+=board[i][k];
					canAdd[i][k]=0;
					board[i][j] = 0;
					document.querySelector("#"+i+"_"+j).style.top = minCell*(i+1)+minWidth*i+"px";
					document.querySelector("#"+i+"_"+j).style.left = minCell*(k+1)+minWidth*k+"px";
					continue;
				}
			}
		}
	}
	randomNumber();
	setTimeout(function(){updateBoard();},280);
}

function moveTop()
{
	formCanAdd();
	for(var j=0;j<4;j++)
	{
		for(var i=1;i<4;i++)
		{
			for(var k=0;k<i;k++)
			{
				if(board[k][j] == 0 && noBlockTop(i,k,j))
				{
					board[k][j]=board[i][j];
					board[i][j]=0;
					document.querySelector("#cell-"+j+"-"+i).style.top = cellSpace*(k+1)+cellWidth*k+"px";
					document.querySelector("#cell-"+j+"_"+i).style.left = cellSpace*(j+1)+cellWidth*j+"px";
					continue;
				}
				if(board[k][j] != 0 &&  canAdd[k][j]==1 && board[k][j]==board[i][j] && noBlockTop(i,k,j))
				{
					board[k][j] = 2*board[i][j];
					score+=board[k][j];
					canAdd[k][j]=0; 
					board[i][j] = 0;
					document.querySelector("#"+i+"_"+j).style.top = cellSpace*(k+1)+cellWidth*k+"px";
					document.querySelector("#"+i+"_"+j).style.left = cellSpace*(j+1)+cellWidth*j+"px";
					continue;
				}
			}
		}
	}
	randomNumber();
	setTimeout(function(){updateBoard();},280);
	
}

function moveBottom()
{
	formCanAdd();
	for(var j=0;j<4;j++)
	{
		for(var i=2;i>=0;i--)
		{
			for(var k=3;k>i;k--)
			{
				if(board[k][j] == 0 && noBlockBottom(i,k,j))
				{
					board[k][j]=board[i][j];
					board[i][j]=0;
					document.querySelector("#"+i+"_"+j).style.top = minCell*(k+1)+minWidth*k+"px";
					document.querySelector("#"+i+"_"+j).style.left = minCell*(j+1)+minWidth*j+"px";
					score+=board[i][j];
					continue;
				}
				if(board[k][j] != 0 && canAdd[k][j]==1 && board[k][j]==board[i][j] && noBlockBottom(i,k,j))
				{
					board[k][j] = 2*board[i][j];
					score+=board[k][j];
					canAdd[k][j]=0
					board[i][j] = 0;
					document.querySelector("#"+i+"_"+j).style.top = minCell*(k+1)+minWidth*k+"px";
					document.querySelector("#"+i+"_"+j).style.left = minCell*(j+1)+minWidth*j+"px";
					continue;
				}
			}
		}
	}
	randomNumber();
	setTimeout(function(){updateBoard();},280);
	
}

function moveRight()
{
	formCanAdd();
	for(var i=0;i<4;i++)
	{
		for(var j=2;j>=0;j--)
		{
			for(var k=3;k>j;k--)
			{
				if(board[i][k] == 0 && noBlockRight(i,k,j))
				{
					board[i][k]=board[i][j];
					board[i][j]=0;
					document.querySelector("#"+i+"_"+j).style.top = minCell*(i+1)+minWidth*i+"px";
					document.querySelector("#"+i+"_"+j).style.left = minCell*(k+1)+minWidth*k+"px";
					score+=board[i][j];
					continue;
				}
				if(board[i][k] != 0 && canAdd[i][k]==1 && board[i][k]==board[i][j] && noBlockRight(i,k,j))
				{
					board[i][k] = 2*board[i][j];
					score+=board[i][k];
					canAdd[i][k]=0;
					board[i][j] = 0;
					document.querySelector("#"+i+"_"+j).style.top = minCell*(i+1)+minWidth*i+"px";
					document.querySelector("#"+i+"_"+j).style.left = minCell*(k+1)+minWidth*k+"px";
					continue;
				}
			}
		}
	}
	randomNumber();
	setTimeout(function(){updateBoard();},280);
	
}

function noBlockTop(i,k,j)
{
	while(board[++k][j] != 0 && k!=i)
	{
		return false;
	}
	return true;
}
function noBlockBottom(i,k,j)
{
	while(board[--k][j] != 0 && k!=i)
	{
		return false;
	}
	return true;
}

function noBlockLeft(i,k,j)
{
	while(board[i][++k] != 0 && k!=j)
	{
		return false;
	}
	return true;
}

function noBlockRight(i,k,j)
{
	while(board[i][--k] != 0 && k!=j)
	{
		return false;
	}
	return true;
}

function isGameOver()
{
	if(canMoveTop() || canMoveBottom() || canMoveRight() || canMoveLeft()){
		return;
	}else{
		setTimeout(function(){alert("Game Over!");},300);
	}
}

