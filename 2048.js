//绘制方格
$(document).ready(function(){
setCss();
	
newGame();

$("#start").click(function(){newGame();});
document.getElementById("start").addEventListener("touchstart",function(){
	document.getElementById("start").addEventListener("touchend",function(){
		newGame();
});
});

$(document).keydown(function(event){
	
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

document.onmousedown=function(event) {
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
};

});

function setCss()
{
	totalWidth = document.body.clientWidth;
	totalHeight = document.body.clientHeight;
	if(totalWidth>800)
	{
		totalWidth=500;
		totalHeight=500;
	}

	containWidth = totalWidth*0.92;
	minWidth = 0.18*totalWidth;
	minCell = 0.04*totalWidth;
	h2block = 0.4*containWidth;
	$("h2").css({
		"width": containWidth
	});

	$("#contain").css({
		"width": containWidth,
		"height": containWidth
	});


	$("#start").css({"width":h2block});
	$("#scoreBlock").css({"width":h2block});

	for(var i=0;i<4;i++)
	{
		for(var j=0;j<4;j++)
		{
			$("#min-"+i+"-"+j).css({
				"top":minCell*(i+1)+minWidth*i+"px",
				"left":minCell*(j+1)+minWidth*j+"px",
				"width": minWidth+"px",
				"height": minWidth+"px"
			});
		}
	}
}

function updateScore()
{
	$("#score").text(score);
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
var score=0;
var canAdd=new Array();
for(var i=0;i<4;i++)
{
	canAdd[i]=new Array();
	for(var j=0;j<4;j++)
	{
		canAdd[i][j]=1;
	}
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
	$(".fs").remove();
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

	$(".fs").remove();
	for(var i=0;i<4;i++)
	{
		for(var j=0;j<4;j++)
		{
			if(board[i][j]!=0)
			{
				$("#contain").append('<div class="fs" id="min_'+i+'_'+j+'"></div>');
				$("#min_"+i+"_"+j).text(board[i][j]);
				showNumber(i,j);
			}else{
				$("#min_"+i+"_"+j).remove();
			}
		}
	}
}

function showNumber(x,y)
{
	$("#min_"+x+"_"+y).css({
		"top": minCell*(x+1)+minWidth*x+"px",
		"left": minCell*(y+1)+minWidth*y+"px",
		"width": minWidth+"px",
		"height": minWidth+"px",
		"line-height":minWidth+"px",
		"background-color":numberColor(board[x][y])
	});
}

function numberColor(num)
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
					$("#min_"+i+"_"+j).animate({"top":minCell*(i+1)+minWidth*i+"px","left":minCell*(k+1)+minWidth*k+"px"}, 300);

					continue;
					
				}
				if(board[i][k] != 0 && canAdd[i][k]==1 && board[i][k]==board[i][j] && noBlockLeft(i,k,j))
				{
					board[i][k] = 2*board[i][j];
					score+=board[i][k];
					canAdd[i][k]=0;
					board[i][j] = 0;
					$("#min_"+i+"_"+j).animate({"top":minCell*(i+1)+minWidth*i+"px","left":minCell*(k+1)+minWidth*k+"px"}, 200);
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
					$("#min_"+i+"_"+j).animate({"top":minCell*(k+1)+minWidth*k+"px","left":minCell*(j+1)+minWidth*j+"px"}, 300);
					continue;
				}
				if(board[k][j] != 0 &&  canAdd[k][j]==1 && board[k][j]==board[i][j] && noBlockTop(i,k,j))
				{
					board[k][j] = 2*board[i][j];
					score+=board[k][j];
					canAdd[k][j]=0; 
					board[i][j] = 0;
					$("#min_"+i+"_"+j).animate({"top":minCell*(k+1)+minWidth*k+"px","left":minCell*(j+1)+minWidth*j+"px"}, 200);
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
					$("#min_"+i+"_"+j).animate({"top":minCell*(k+1)+minWidth*k+"px","left":minCell*(j+1)+minWidth*j+"px"}, 300);
					score+=board[i][j];
					continue;
				}
				if(board[k][j] != 0 && canAdd[k][j]==1 && board[k][j]==board[i][j] && noBlockBottom(i,k,j))
				{
					board[k][j] = 2*board[i][j];
					score+=board[k][j];
					canAdd[k][j]=0
					board[i][j] = 0;
					$("#min_"+i+"_"+j).animate({"top":minCell*(k+1)+minWidth*k+"px","left":minCell*(j+1)+minWidth*j+"px"}, 200);
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
					$("#min_"+i+"_"+j).animate({"top":minCell*(i+1)+minWidth*i+"px","left":minCell*(k+1)+minWidth*k+"px"}, 300);
					score+=board[i][j];
					continue;
				}
				if(board[i][k] != 0 && canAdd[i][k]==1 && board[i][k]==board[i][j] && noBlockRight(i,k,j))
				{
					board[i][k] = 2*board[i][j];
					score+=board[i][k];
					canAdd[i][k]=0;
					board[i][j] = 0;
					$("#min_"+i+"_"+j).animate({"top":minCell*(i+1)+minWidth*i+"px","left":minCell*(k+1)+minWidth*k+"px"}, 300);
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

