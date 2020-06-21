var firestore = firebase.firestore();
var auth = firebase.auth();
var signOutBtn = document.querySelector(".signOutBtn");
var changePassBtn = document.querySelector(".changePassBtn");
var changeEmailBtn = document.querySelector(".changeEmailBtn");
var changeNameBtn = document.querySelector(".changeNameBtn");
var changeCurrencyBtn = document.querySelector(".changeCurrencyBtn");
var userInfo,date,uid,user;


var showAlert = (msg)=>{
    let alert = document.querySelector(".alert");
    alert.innerHTML = msg;
    alert.style.opacity = 1;
    setTimeout(()=>{
        alert.style.opacity = 0;
    },3000)
}
async function sendMail(){
    await user.sendEmailVerification();
    showAlert("Verification Link Sent");
}
var emailVerification = async (user)=>{
    try{
        let status = user.emailVerified;
        if(!status){
            let div = document.querySelector('.emailVerified');
            div.innerHTML=`<h3>Email Verification: <a onclick="sendMail()" style = "color: red; cursor: pointer;">Send Verification Email</a></h3>`   
        }
    }catch(error){
        console.log(error);
    }
}
var changeCurrency = async (e)=>{
    e.preventDefault();
    try {
        let currency = document.querySelector("#newCurrency").value;
        if(currency){
            let userObj = {
                currency
            }
            await firestore.collection("users").doc(uid).update(userObj);
            showAlert("Done...");
        }else
            showAlert("Enter Value.");
    } catch (error) {
        showAlert(error);
    }
}
var changeName = async (e)=>{
    e.preventDefault();
    try{
        let name = document.querySelector("#newName").value;
        if(name.split(' ')[1])
            name = name.split(' ')[0]+" "+name.split(' ')[1];
        if(name){
            let userObj = {
                fullName: name
            }
            await firestore.collection("users").doc(uid).update(userObj);
            fetchUser(uid);
        }else
            showAlert("Enter Value.");
    }catch(error){
        showAlert(error);
    }    
}
var changeEmail = async (e,user)=>{
    e.preventDefault();
    try {
        let email = document.querySelector("#newEmail").value;
        if(email){
            await user.updateEmail(email);
            document.querySelector("#newEmail").value="";
            showAlert("Email Change Successfull...");
        }else
            showAlert("Enter Value.");
    } catch (error) {
        showAlert(error);
    }
}
var changePass = async (e,user)=>{
    e.preventDefault();
    try {
        await user.updatePassword(document.querySelector("#newPass").value);
        document.querySelector("#newPass").value="";
        showAlert("Password Changed.");
    } catch (error) {
        showAlert(error);
    }
}
var signOut = async (e)=>{
    e.preventDefault();
    await auth.signOut();
}
var fetchUser = async (uid)=>{    
    try {
        userInfo = (await firestore.collection("users").doc(uid).get()).data();
        date = userInfo.createdAt.toDate().toISOString().split("T")[0];
        document.querySelector(".mainHeading").innerHTML = `Welcome!<br>${userInfo.fullName}`;
        currency = userInfo.currency;
    } catch (error) {
        console.log(error);
    }
}

signOutBtn.addEventListener("click", e=>signOut(e));


auth.onAuthStateChanged(async user=>{
    if(user){
        uid = user.uid;
        fetchUser(uid);
        window.user = user;
        changePassBtn.addEventListener("click", e=>changePass(e,user));
        changeEmailBtn.addEventListener("click", e=>changeEmail(e,user));
        changeNameBtn.addEventListener("click", e=>changeName(e));        
        changeCurrencyBtn.addEventListener("click", e=>changeCurrency(e));
        await emailVerification(user);
        imageRef = storage.child(`image/${uid}.png`);
        getImageUrl();
    }else{
        location.assign("index.html");
    }
})


/*
Upload image to firebase storage.
*/
var imageUpload = document.querySelector('#imageUpload');
var storage = firebase.storage().ref();
var imageRef;

var resize = async (item)=>{
    return new Promise((resolve)=>{
        //define the width to resize e.g 600px
        var resize_width = 500;//without px
    
    
        //create a FileReader
        var reader = new FileReader();
    
        //image turned to base64-encoded Data URI.
        reader.readAsDataURL(item);
        reader.name = item.name;//get the image's name
        reader.size = item.size; //get the image's size
        reader.onload = function(event) {
        var img = new Image();//create a image
        img.src = event.target.result;//result is base64-encoded Data URI
        img.name = event.target.name;//set name (optional)
        img.size = event.target.size;//set size (optional)
        img.onload = function(el) {
            var elem = document.createElement('canvas');//create a canvas
    
            //scale the image to 600 (width) and keep aspect ratio
            var scaleFactor = resize_width / el.target.width;
            elem.width = resize_width;
            elem.height = el.target.height * scaleFactor;
    
            //draw in canvas
            var ctx = elem.getContext('2d');
            ctx.drawImage(el.target, 0, 0, elem.width, elem.height);
    
            //get the base64-encoded Data URI from the resize image
            var srcEncoded = ctx.canvas.toDataURL(el.target, 'image/png', 0);

            resolve(srcEncoded);
            /*Now you can send "srcEncoded" to the server and
            convert it to a png o jpg. Also can send
            "el.target.name" that is the file's name.*/
    
        }
        }
    });
  }

imageUpload.addEventListener("change",async (e)=>{
    try{
        let file = e.target.files[0];
        showAlert("Uploading...Please Wait");
        //Get Resised imagedataurl.
        let data = await resize(file);
        //upload image dataurl
        let uploadTask = await imageRef.putString(data, 'data_url');

        showAlert("Upload Successfull.");
        getImageUrl();
    }catch(error){
        console.log(error);
    }
    
})
var getImageUrl = async ()=>{
    let u = await imageRef.getDownloadURL();
    document.querySelector('.img').src = u;
}


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
