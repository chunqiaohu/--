var board = new Array();
var score = 0;
var hasConficted = new Array();

var startX = 0,
	startY = 0,
	endX = 0,
	endY = 0

window.onload = function() {
	prepareMobile();
	newgame();
}

function prepareMobile() {
	
	if (documentWidth > 500) {
		gridContainWidth = 500, // 大框尺寸
		cellTop = 120, // 小框顶点
		cellSideLength = 100,  // 小框边长
		cellSpace = 20; // 小框间隔
	}
	
	var canvas = document.getElementById('canvas');
	canvas.height = gridContainWidth - 2 * cellSpace;
	canvas.width = gridContainWidth - 2 * cellSpace;
	
	var context = canvas.getContext('2d');
	
	
	
	$('#grid-container').css({
		'width': gridContainWidth - 2 * cellSpace,
		'height': gridContainWidth - 2 * cellSpace,
		'padding': cellSpace,
		'borderRadius': 0.02 * gridContainWidth
	});
	
	for ( var i=0; i<4; i++) {
		for ( var j=0; j<4; j++) {
			drawrec(context, i * cellTop , j * cellTop, cellSideLength, cellSideLength, 0.02*cellSideLength, '#ccc0b3');
		}
	}
	
	
}

function newgame() {
	//画出棋盘
	//draw();
	//初始化棋盘格
	init();
	//随机在两个格子里放数字
	generateOneNumber();
	generateOneNumber();
}

//function draw() {
//	var canvas = document.getElementById('canvas');
//	canvas.height = 460;
//	canvas.width = 460;
//	
//	var context = canvas.getContext('2d');
//	
//	for ( var i=0; i<4; i++) {
//		for ( var j=0; j<4; j++) {
//			drawrec(context, i * 120, j * 120, 100, 100, 6, '#ccc0b3');
//		}
//	}
//}

function drawrec(cxt, x, y, width, height, radius, color) {
	cxt.save();
	
	cxt.translate(x, y);

	drawarc(cxt, width, height, radius);
	cxt.fillStyle = color;
	cxt.fill();
	
	cxt.restore();
	
}

function drawarc(cxt, w, h, r) {
	
	cxt.beginPath();
	cxt.arc( r, r, r, 1*Math.PI, 1.5*Math.PI);
	cxt.arc ( w-r, r, r, 1.5*Math.PI, 2*Math.PI);
	cxt.arc(w-r, h-r, r, 0, 0.5*Math.PI);
	cxt.arc(r, h-r, r, 0.5*Math.PI, Math.PI );
	cxt.closePath();
}

function init() {
	
	for ( var  i=0; i<4; i++) {
		board[i] =new Array();
		hasConficted[i] = new Array();
		for ( var  j=0; j<4; j++) {
			board[i][j] = 0;
			hasConficted[i][j] = false;
		}
	}
	
	updateBoardView();
	
	score = 0;
	$('#score').text(score);
}

function updateBoardView(){
	$('.number-cell').remove();
	for ( var i=0; i<4; i++) {
		for ( var j=0; j<4; j++) {
			$('#grid-container').append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
			var  theNumberCell = $('#number-cell-'+i+'-'+j);
			
			if ( board[i][j] == 0)  {
				theNumberCell.css({
					'width': 0,
					'height': 0,
					'top': getPosTop(i, j) + cellSideLength/2,
					'left': getPosLeft(i, j) + cellSideLength/2
				});
			} else {
				theNumberCell.css({
					'width': cellSideLength,
					'height': cellSideLength,
					'top': getPosTop(i, j),
					'left': getPosLeft(i, j),
					'background-color': getNumberBackground(board[i][j]),
					'color': getNumberColor(board[i][j])
				});
				theNumberCell.text( board[i][j] );
			}
			hasConficted[i][j] = false;
		}
	}
	$('.number-cell').css({
		'line-height': cellSideLength + 'PX',
		'font-size': 0.6 * cellSideLength
	});
}

function generateOneNumber() {
	if ( noSpace(board) ) {
		return false;
	} else {
		//随机一个位置
		var randX = parseInt(Math.floor(Math.random()*4) );
		var randY = parseInt(Math.floor(Math.random()*4) );
		
		while ( true ) {
			if ( board[randX][randY] == 0) {
				break;
			} else {
				var randX = parseInt(Math.floor(Math.random()*4) );
				var randY = parseInt(Math.floor(Math.random()*4) );
			}
		}


		//随机一个数字
		var randNumber = Math.random() < 0.5 ? 2 : 4; 
		
		//在随机位置显示随机数
		board[randX][randY] = randNumber;
		showNumerWithAnimation(randX, randY, randNumber);
		
		return true;
	}
}

$(document).keydown( function(event) {
	event.preventDefault();
	switch (event.keyCode) {
		case 37:  //left
			if ( moveLeft() )  {
				setTimeout('generateOneNumber()', 210);
				setTimeout('isGameover()', 300);
			}
		break;
		case 38:  //up
			if ( moveUp() )  {
				setTimeout('generateOneNumber()', 210);
				setTimeout('isGameover()', 300);
			}
		break;
		case 39:  //right
			if ( moveRight() )  {
				setTimeout('generateOneNumber()', 210);
				setTimeout('isGameover()', 300);
			}
		break;
		case 40:  //down
			if ( moveDown() )  {
				setTimeout('generateOneNumber()', 210);
				setTimeout('isGameover()', 300);
			}
		break;
		default:
		break;
	}
});

// 触摸事件
document.addEventListener('touchstart', function(e) {
	var e = e || window.event;
	startX = e.touches[0].pageX;
	startY = e.touches[0].pageY;
});

document.addEventListener('touchend', function(e) {
	var e = e || window.event;
	endX = e.changedTouches[0].pageX;
	endY = e.changedTouches[0].pageY;
	
	var deltaX = endX - startX;
	var deltaY = endY - startY;
	
	if (Math.abs(deltaX) < 0.3 * documentWidth && Math.abs(deltaY) < 0.3 * documentWidth) 
	return;
	
	if (Math.abs(deltaX) >= Math.abs(deltaY)) {
		//X
		if (deltaX > 0) {
			// Right
			if ( moveRight() )  {
				setTimeout('generateOneNumber()', 210);
				setTimeout('isGameover()', 300);
			}
		} else {
			// Left
			if ( moveLeft() )  {
				setTimeout('generateOneNumber()', 210);
				setTimeout('isGameover()', 300);
			}
		}	
	} else {
		//Y
		if (deltaY > 0) {
			// Down
			if ( moveDown() )  {
				setTimeout('generateOneNumber()', 210);
				setTimeout('isGameover()', 300);
			}
		} else {
			// Up
			if ( moveUp() )  {
				setTimeout('generateOneNumber()', 210);
				setTimeout('isGameover()', 300);
			}
		}
		
	}
	
	
});



function moveLeft() {
	if ( !canMoveLeft(board) ){
		return false;
	} else {
		for ( var i=0; i<4; i++) {
			for ( var j=1; j<4; j++) {
				if (board[i][j] != 0) {
					for ( var k=0; k<j; k++) {
						//判断之前的格子是否为空
						if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
							//move
							showMoveAnimation(i, j, i, k);
							board[i][k] = board[i][j];
							board[i][j] = 0;
							continue;
						} else if ( board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConficted[i][k]) {//之前是否有相等的数字
							//move
							showMoveAnimation(i, j, i, k);
							//add
							board[i][k] += board[i][j];
							board[i][j] = 0;
							
							score += board[i][k];
							updateScore(score);
							
							hasConficted[i][k] = true;
							continue;
						}
					}
				}
			}
		}
		setTimeout('updateBoardView()', 200);
		return true;
	}
}

function moveRight() {
	if ( !canMoveRight(board) ) {
		return false;
	} else {
		for ( var i=0; i<4; i++) {
			for ( var j=2; j>=0; j--) {
				if (board[i][j] != 0) {
					for ( var k=3; k>j; k--) {
						if (board[i][k] ==0 && noBlockHorizontal(i, j, k, board) ) {
							showMoveAnimation(i, j, i, k);
							board[i][k] = board[i][j];
							board[i][j] = 0;
							continue;
						} else if ( board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConficted[i][k]) {
							showMoveAnimation(i, j, i, k);
							//add
							board[i][k] += board[i][j];
							board[i][j] = 0;
							
							score += board[i][k];
							updateScore(score);
							
							hasConficted[i][k] = true;
							continue;
						}
					}
				}
			}
		}
		setTimeout('updateBoardView()', 200);
		return true;
	}
}


function moveDown() {
	if ( ! canMoveDown(board) ) {
		return false;
	} else {
		for ( var j=0; j<4; j++) {
			for ( var i=2; i>=0; i--) {
				if ( board[i][j]!= 0) {
					for (var k=3; k>i; k--) {
						if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
							showMoveAnimation(i, j, k, j);
							board[k][j] = board[i][j];
							board[i][j] = 0;
							continue;
						} else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConficted[k][j]) {
							showMoveAnimation(i, j, k, j);
							board[k][j] += board[i][j];
							board[i][j] = 0;
							
							score += board[k][j];
							updateScore(score);
							
							hasConficted[k][j] = true;
							continue;
						}
					}
				}
			}
		}
		setTimeout('updateBoardView()', 200);
		return true;
	}
}

function moveUp() {
	if ( ! canMoveUp(board)) {
		return false;
	} else {
		for ( var j=0; j<4; j++) {
			for ( var i=1; i<4; i++) {
				if (board[i][j] != 0) {
					for ( var k=0; k<i; k++) {
						if(board[k][j] ==0 && noBlockVertical(j, k, i, board) ) {
							showMoveAnimation(i, j, k ,j);
							board[k][j] = board[i][j];
							board[i][j] = 0;
							continue;
						} else if ( board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConficted[k][j] ) {
							showMoveAnimation(i, j, k, j);
							board[k][j] += board[i][j];
							board[i][j] =0;
							
							score += board[k][j];
							updateScore(score);
							
							hasConficted[k][j] = true;
							continue;
						}
					}
				}
			}
		}
		setTimeout('updateBoardView()', 200);
 		return true;
	}
}

function isGameover() {
	if (noSpace(board) && noMove(board)) {
		alert('LOL! GAME OVER SILLY BOY!');
	}
}