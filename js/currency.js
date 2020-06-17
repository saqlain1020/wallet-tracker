/*
Normal JS for page functionality
*/

var backBtn = document.querySelector('.backBtn');
var svg = document.querySelector('svg');
//Functions


var backBtnClicked = (e)=>{
    e.preventDefault();
    location.assign("dashboard.html");
}

//Listeners
backBtn.addEventListener("click",e=>backBtnClicked(e));



/*
*********************************************
*******Canvas Circle Animation Code*********
*********************************************
*/
var canvas = document.querySelector(".canvas");
var containerHeight = document.querySelector('.containerWrapper').getBoundingClientRect().height;
var containerWidth = document.querySelector('.containerWrapper').getBoundingClientRect().width;
canvas.width = containerWidth;
canvas.height = containerHeight;
var c = canvas.getContext('2d');
var mouse={
    x: undefined,
    y: undefined
}
//Circle Array which will contain our circles
var circleArr = [];

//Circle Class
function Circle(x,y,radius,ySpeed,color){
    this.x=x;                                               //x Position
    this.y=y;                                               //y Position
    this.radius = radius;
    this.ySpeed = ySpeed;                                   //Vertical rising speed
    this.color = color;
    this.innerHeight = containerHeight;                         //Height of window of canvas
    this.innerWidth = containerWidth;                           //Width
    //Draw Circle function
    this.draw = ()=>{
        c.beginPath();                                      
        c.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
        c.fillStyle= this.color;
        c.fill()
    }
    //Update Circle
    this.update = ()=>{
        this.y-=this.ySpeed;                                //Decrease y position at certain speed
        //If radius is bigger than zero keep shrinking the circle
        if(this.radius>=0)
            this.radius-=0.02;
        //If radis is zero or less set radius to orignal and position of circle at bottom of screen
        if(this.radius<=0){
            this.y = containerHeight + radius*2;
            this.radius = radius;
        }
        //Interactivity with mouse
        //Reset radius and y axis position
        if(this.x<=mouse.x+this.radius&&this.x>=mouse.x-this.radius&&this.y<=mouse.y+this.radius&&this.y>=mouse.y-this.radius){
            this.y = containerHeight + radius*2;
            this.radius = radius;
        }
        //Call draw circle function
        this.draw();
    }
}
//Circles Canvas init function
var init=()=>{
    circleArr = [];                                             //Clear Circle array
    for(let i=0;i<400;i++){                                     //Loop to create 400 circles and store in arr
        //Random radius from range(6,10)
        let radius = 6+Math.random()*10;
        let color = `rgba(255,255,255,0.5)`;
        //create circle object with random and predefince values
        let circle = new Circle(Math.random()*containerWidth,Math.random()*containerHeight,radius,0.5+Math.random()*1,color); 
        circleArr.push(circle);                                 //Send circle obj to array
    }
}
//Call init circle function
init();

//Animate function for circles
let animate = ()=>{
    requestAnimationFrame(animate);
    c.clearRect(0, 0, containerWidth, containerHeight);
    circleArr.forEach(e=>{
        e.update();
    })
}
//Call animation
animate();

window.addEventListener('resize',()=>{
    containerHeight = document.querySelector('.containerWrapper').getBoundingClientRect().height;
    containerWidth = document.querySelector('.containerWrapper').getBoundingClientRect().width;
    canvas.width = containerWidth;
    canvas.height = containerHeight;
    init();
})
window.addEventListener('mousemove',e=>{
    mouse.x = e.x;
    mouse.y = e.y;
})
