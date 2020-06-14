var auth = firebase.auth();
var firestore = firebase.firestore();

var signInBtn = document.querySelector("#signInBtn");
var signUpBtn = document.querySelector("#signUpBtn");
var googleSignInBtn = document.querySelector("#googleSignInBtn");
var uid,userAdded = true;
var canvas = document.querySelector(".canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');
var mouse={
    x: undefined,
    y: undefined
}

var googleSignIn = async e =>{
    e.preventDefault();
    try {
        let googleProvider = new firebase.auth.GoogleAuthProvider();
        let user = await auth.signInWithPopup(googleProvider);
        uid = user.user.uid;
        let isNewUser = user.additionalUserInfo.isNewUser;
        console.log(user);
        if(isNewUser){
            let userInfo = {
                fullName: user.user.displayName,
                email: user.user.email,
                createdAt: new Date(),
                currency: "$"
            }
            console.log(userInfo);
            await firestore.collection("users").doc(uid).set(userInfo);
            alert("User Added");
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
            console.log(userInfo);
            //redirect
            location.assign(`dashboard.html`)
        }else{
            alert("Fields Missing...");
            document.getElementById("passSignin").value = "";
        }
    } catch (error) {
        alert(error);
    }
}
var signUpSubmission = async e =>{
    e.preventDefault();
    try{
        let email = document.getElementById("emailSignup").value;
        let pass = document.getElementById("passSignup").value;
        let fullName = document.getElementById("fullNameSignup").value;
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
            console.log(userInfo);
            alert("User Added");
            //redirect
            location.assign(`dashboard.html`)
        }else{
            alert("Fields Missing...");
            document.getElementById("passSignin").value = "";
        }
    }catch(error){
        alert(error);
    }
}

auth.onAuthStateChanged(async (user)=>{
    if(userAdded){
        if(user)
            location.assign(`dashboard.html`);
        userAdded = false
    }
    document.querySelector("#resetPassBtn").addEventListener("click",(e)=>{
        e.preventDefault();
        if(document.getElementById("emailSignin").value){
            auth.sendPasswordResetEmail(document.getElementById("emailSignin").value);
            document.getElementById("emailSignin").value = "";
            alert("Password Reset Link Send To Mail.");
        }
    })
        
})


signInBtn.addEventListener("click",e => signInSubmission(e));
signUpBtn.addEventListener("click",e => signUpSubmission(e));
googleSignInBtn.addEventListener("click",e => googleSignIn(e));


//Canvas work
var circleArr = [];

function Circle(x,y,radius,ySpeed,color){
    this.x=x;
    this.y=y;
    this.radius = radius;
    this.ySpeed = ySpeed;
    this.color = color;
    this.innerHeight = innerHeight;
    this.innerWidth = innerWidth;
    this.draw = ()=>{
        c.beginPath();
        c.arc(this.x, this.y, this.radius, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
        c.fillStyle= this.color;
        c.fill()
    }
    this.update = ()=>{
        this.y-=this.ySpeed;
        if(this.radius>=0)
            this.radius-=0.02;
        if(this.radius<=0){
            this.y = innerHeight + this.radius*5;
            this.radius = radius;
        }
        //Interactivity with mouse
        if(this.x<=mouse.x+this.radius&&this.x>=mouse.x-this.radius&&this.y<=mouse.y+this.radius&&this.y>=mouse.y-this.radius){
            this.y = innerHeight + this.radius*5;
            this.radius = radius;
        }
        this.draw();
    }
}
var init=()=>{
    circleArr = [];
    for(let i=0;i<300;i++){
        let radius = 6+Math.random()*10;
        let color = `rgba(255,255,255,0.5)`;
        let circle = new Circle(Math.random()*innerWidth,Math.random()*innerHeight,radius,0.5+Math.random()*1,color); 
        circleArr.push(circle);
    }
}
init();

let animate = ()=>{
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    // c1.update();
    circleArr.forEach(e=>{
        e.update();
    })
}
animate();

window.addEventListener('resize',()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
})
window.addEventListener('mousemove',e=>{
    mouse.x = e.x;
    mouse.y = e.y;
})
