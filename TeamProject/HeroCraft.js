//////////////////////////////////////////////////////////////////////////////////////////////////
//전역 변수 선언
var context; /*컨텍스트 객체*/
var ball; /*공 객체*/
var bar; /*바 객체*/
var brick; /*벽돌 객체*/ //-> 나중에 배열로 선언 필요
var timer; /*타이머 객체 변수*/
var canvasWidth=600; /*캔버스의 가로px*/
var canvasHeight=500; /*캔버스의 세로px*/
//////////////////////////////////////////////////////////////////////////////////////////////////





//////////////////////////////////////////////////////////////////////////////////////////////////
//객체 생성자 함수
function Ball(position_x,position_y,radius,velocity_x,velocity_y,imageFile){
	
	this.position_x=position_x; /*공의 현재 x 위치*/
	this.position_y=position_y; /*공의 현재 y 위치*/
	this.radius=radius; /*공의 반지름*/
	this.velocity_x=velocity_x; /*공의 현재 x방향 속도*/ //속도는 5의 배수여야함
	this.velocity_y=-velocity_y; /*공의 현재 y방향 속도*/
	this.image=new Image(); 
	this.image.src=imageFile;

	/*공의 충돌 이벤트를 처리한다. (공&벽면, 공&바 의 충돌) */
	this.checkCrash=function(){
			//화면 아랫 벽면과 충돌
			if(ball.position_y>canvasHeight){
				clearInterval(timer);
				alert("Game Over");
			}
			
			//화면 윗 벽면과 충돌
			if(ball.position_y<0){
				ball.velocity_y=-ball.velocity_y;
			}

			//화면 왼쪽 벽면과 충돌
			if(ball.position_x<0){
				ball.velocity_x=-ball.velocity_x;
			}
			//화면 오른쪽 벽면과 충돌
			if(ball.position_x>canvasWidth-ball.radius*2){
				ball.velocity_x=-ball.velocity_x;
			}

			//바와 충돌  //바와 출돌할때 Vy를 rand으로 제공하자 일단은 상수 제공 ->이걸 아이템으로 해결해도 될듯
			if(ball.position_x+ball.radius*2>=bar.position_x&&ball.position_x<=bar.position_x+bar.width
				&&ball.position_y+ball.radius*2>=bar.position_y&&ball.position_y<=bar.position_y+bar.height){
				ball.velocity_y=-ball.velocity_y;
				ball.velocity_y-=0;
			}
	}
}


function Bar(position_x,position_y,width,height,imageFile){
	this.position_x=position_x;
	this.position_y=position_y;
	this.width=width;
	this.height=height;
	this.image=new Image();
	this.image.src=imageFile;

	/*바를 왼쪽으로 이동*/
	this.moveLeft=function(){
		this.position_x-=20;
	}
	/*바를 오른쪽으로 이동*/
	this.moveRight=function(){
		this.position_x+=20;
	}

}

function Brick(position_x,position_y,width,height,stiffness,imageFile){ //이미지 파일은 brick+((생략)stiffness).png //stiff>0까지만 유효, stiff<0은 이미지 없음
	this.position_x=position_x;
	this.position_y=position_y;
	this.width=width;
	this.height=height;
	this.stiffness=stiffness;
	this.image=new Image();
	this.image.src=imageFile+stiffness+".png";
	/*공과의 충돌 이벤트를 처리한다. (공&벽돌 의 충돌) */
	this.checkCrash=function(){
		//충돌 감지를 템플릿형 함수로 제공하자.->고려중
		if(this.stiffness>0){
			var isCrashed=false;
			//벽돌의 윗면으로 충돌하였을 때
			if(ball.position_x+ball.radius*2>=brick1.position_x&&ball.position_x<=brick1.position_x+brick1.width
				&&ball.position_y+ball.radius*2==brick1.position_y){
				ball.velocity_y=-ball.velocity_y;
				isCrashed=true;
			}
			//벽돌의 아랫면으로 충돌하였을 때
			if(ball.position_x+ball.radius*2>=brick1.position_x&&ball.position_x<=brick1.position_x+brick1.width
				&&ball.position_y==brick1.position_y+brick1.height){
				ball.velocity_y=-ball.velocity_y;
				isCrashed=true;
			}
			//벽돌의 왼쪽면으로 충돌하였을 때
			if(ball.position_y+ball.radius*2>=brick1.position_y&&ball.position_y<=brick1.position_y+brick1.height
				&&ball.position_x+ball.radius*2==brick1.position_x){
				ball.velocity_x=-ball.velocity_x;
				isCrashed=true;
			}
			//벽돌의 오른쪽면으로 충돌하였을 때
			if(ball.position_y+ball.radius*2>=brick1.position_y&&ball.position_y<=brick1.position_y+brick1.height
				&&ball.position_x==brick1.position_x+brick1.width){
				ball.velocity_x=-ball.velocity_x;
				isCrashed=true;
			}
			//충돌 하였을 경우 이미지 변경
			if(isCrashed==true){
				this.stiffness--;
				this.image.src=imageFile+this.stiffness+".png";
			}
		}
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////




//////////////////////////////////////////////////////////////////////////////////////////////////
//일반 함수

/*객체 초기화를 담당하는 함수*/
function init(){
	context=document.getElementById("canvas").getContext("2d");

	ball=new Ball(210,150,15,5,-5,"ball.png"); //공의 속도는 5이여야 한다.(충돌 조건)
	bar=new Bar(190,450,100,5,"bar.png");
	brick1=new Brick(180,50,60,30,3,"brick");

	drawCanvas();
}

/*이미 저장된 정보를 전체 화면을 그리는 함수*/
function drawCanvas(){
	context.clearRect(0,0,canvasWidth,canvasHeight);
	context.drawImage(ball.image,ball.position_x,ball.position_y);
	context.drawImage(bar.image,bar.position_x,bar.position_y);
	context.drawImage(brick1.image,brick1.position_x,brick1.position_y);
}

/*객체들의 현재 정보를 매 초 업데이트하고 새로고침한다.*/
function updateAndDraw(){
		//ballVy+=1.98; 중력 가속도 무시
		ball.position_x+=ball.velocity_x;
		ball.position_y+=ball.velocity_y;
		ball.checkCrash();
		brick1.checkCrash();
		drawCanvas();
}
//////////////////////////////////////////////////////////////////////////////////////////////////






//////////////////////////////////////////////////////////////////////////////////////////////////
//사용자의 버튼 조작

/*사용자가 시작 버튼을 누르면 호출된다.*/
function button_start(){
	init();
	drawCanvas();
	timer=setInterval(updateAndDraw,50);
}

/*사용자가 정지 버튼을 누르면 호출된다.*/
function button_stop(){
	clearInterval(timer);
}
/*사용자가 left 버튼을 누르면 호출된다.*/
function button_moveLeft(){
	bar.moveLeft();
}
/*사용자가 right 버튼을 누르면 호출된다.*/
function button_moveRight(){
	bar.moveRight();
}
//////////////////////////////////////////////////////////////////////////////////////////////////