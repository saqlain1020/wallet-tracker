var auth = firebase.auth();
var firestore = firebase.firestore();

var signInBtn = document.querySelector("#signInBtn");
var signUpBtn = document.querySelector("#signUpBtn");
var googleSignInBtn = document.querySelector("#googleSignInBtn");
var uid,flag = true;
var creatAccountBtn = document.querySelector("#createAccountBtn");
var backBtn = document.querySelector(".backBtn");               //Back btn on signup page

//********* Google Sign In using Google provider **********
var googleSignIn = async e =>{
    e.preventDefault();
    try {
        let googleProvider = new firebase.auth.GoogleAuthProvider();
        let user = await auth.signInWithPopup(googleProvider);      //Save returned user to a variable
        uid = user.user.uid;                                        //Get uid from user
        let isNewUser = user.additionalUserInfo.isNewUser;          //Get is new user boolean value
        //If user is newly created than save its info in database else move on to redirect
        if(isNewUser){
            let userInfo = {
                fullName: user.user.displayName,
                email: user.user.email,
                createdAt: new Date(),
                currency: "$"
            }
            //Send user info to database
            await firestore.collection("users").doc(uid).set(userInfo);
            //redirect
            location.assign(`dashboard.html`)
        }else{
            //redirect
            location.assign(`dashboard.html`)
        }
        
    } catch (error) {
        alert(error);
    }
}
var signInSubmission = async e =>{
    e.preventDefault();
    try {
        let email = document.getElementById("emailSignin").value;
        let pass = document.getElementById("passSignin").value;
        if(email && pass){
            let user = await auth.signInWithEmailAndPassword(email,pass);
            uid = user.user.uid;
            let userInfo = (await firestore.collection("users").doc(uid).get()).data();
            //redirect
            location.assign(`dashboard.html`)
        }else{
            showAlert("Fields Missing...");
            document.getElementById("passSignin").value = "";
        }
    } catch (error) {
        showAlert(error);
    }
}
var signUpSubmission = async e =>{
    e.preventDefault();
    try{
        let email = document.getElementById("emailSignup").value;
        let pass = document.getElementById("passSignup").value;
        let fullName = document.getElementById("fullNameSignup").value;
        if(fullName.split(' ')[1])
            fullName = fullName.split(' ')[0]+" "+fullName.split(' ')[1];
        if(email && pass && fullName){
            //Create User
            let user = await auth.createUserWithEmailAndPassword(email,pass);
            uid = user.user.uid;
            //Send User info to Firestore
            let userInfo = {
                fullName,
                email,
                createdAt: new Date(),
                currency: "$"
            }
            await firestore.collection("users").doc(uid).set(userInfo);
            //send email is not returned in this case so we cant use it
            // await user.sendEmailVerification();
            //redirect
            location.assign(`dashboard.html`)
        }else{
            showAlert("Fields Missing...");
            document.getElementById("passSignin").value = "";
        }
    }catch(error){
        showAlert(error);
    }
}

var creatAccountBtnClicked = async (e)=>{
    e.preventDefault();
    let signUpForm = document.querySelector(".container .signUpForm");
    let signInForm = document.querySelector(".container .signInForm");
    signInForm.style.zIndex = -1; 
    signInForm.style.opacity = 0; 
    signUpForm.style.zIndex = 3;
    signUpForm.style.opacity = 1;
}
var backBtnClicked = async (e)=>{
    e.preventDefault();
    let signUpForm = document.querySelector(".container .signUpForm");
    let signInForm = document.querySelector(".container .signInForm");
    signUpForm.style.zIndex = -1;
    signUpForm.style.opacity = 0;
    signInForm.style.zIndex = 3; 
    signInForm.style.opacity = 1; 
    
}
var showAlert = (msg)=>{
    let arr = Array.from(document.querySelectorAll(".contentWrapper .alert"));
    arr.forEach(element=>{
        element.innerHTML = msg;
        element.style.opacity = 1;
        setTimeout(()=>{
            element.style.opacity = 0;
        },3000)
    })
    
}
auth.onAuthStateChanged(async (user)=>{
    /*  
        Flag prevents functions from executing more than once
        As we don't want it redirecting after page load user check.
    */
    if(flag){
        if(user)
            location.assign(`dashboard.html`);
        flag = false
    }
    //Reset Btn pressed
    document.querySelector("#resetPassBtn").addEventListener("click",(e)=>{
        e.preventDefault();
        if(document.getElementById("emailSignin").value){
            //Send reset Link to email
            auth.sendPasswordResetEmail(document.getElementById("emailSignin").value);
            document.getElementById("emailSignin").value = "";
            showAlert("Password Reset Link Sent To Mail.");
        }else{
            showAlert("Enter Email...");
        }
    })
        
})

//Listeners
signInBtn.addEventListener("click",e => signInSubmission(e));
signUpBtn.addEventListener("click",e => signUpSubmission(e));
googleSignInBtn.addEventListener("click",e => googleSignIn(e));
creatAccountBtn.addEventListener("click",e=>creatAccountBtnClicked(e))
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
        let circle = new Circle(Math.random()*containerWidth,Math.random()*containerHeight+containerHeight/2,radius,0.5+Math.random()*1,color); 
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
