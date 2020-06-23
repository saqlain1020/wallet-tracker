// var uid = location.hash.substring(1,location.hash.length);
var firestore = firebase.firestore();
var auth = firebase.auth();
var settingsBtn = document.querySelector(".settingsBtn");
var userInfo,fullName,date,uid;
var transactionAddBtn = document.querySelector(".transactionAddBtn");
var transactionsList = document.querySelector(".transactionsList");
var popUp = document.querySelector(".popUp");
var transactionEditBtn = document.querySelector(".transactionEditBtn");
var currency;
var transactionArr = [];
var searchBtn = document.querySelector(".searchBtn")
var searchResetBtn = document.querySelector(".searchResetBtn");
var user;
var storage = firebase.storage().ref();
var imageRef;
var transactionBackBtn = document.querySelector('.popUp .transactionBackBtn');


var deleteBtnClicked = async (docId)=>{
    try {
        await firestore.collection("transactions").doc(docId).delete();
        renderTransactions(await fetchTransactions());
    } catch (error) {
        console.log(error);
    }
}
var popUpClose = ()=>{
    let container = document.querySelector(".containerWrapper");
    container.style.filter = `blur(0px)`;
    popUp.style.transform = `scale(0)`;
}
var transactionEditBtnClicked = async (id) =>{
    try {
        let title = document.querySelector(".popUp .title").value;
        let cost  = document.querySelector(".popUp .cost").value;
        let date = new Date(document.querySelector(".popUp .date").value);
        let type = document.querySelector(".popUp .transactionType").value;
        if(title && cost && date && type){
            let transactionObj = {
                title,
                cost: parseFloat(cost),
                date,
                type,
            }
            await firestore.collection("transactions").doc(id).update(transactionObj);
            renderTransactions(await fetchTransactions());
            popUpClose(this);
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}
var searchResetBtnClicked = async (e)=>{
    e.preventDefault();
    document.querySelector(".searchForm #search").value = "";
    renderTransactions(transactionArr);
}
var searchBtnClicked = async (e)=>{
    e.preventDefault();
    let arrTemp =[];
    let searchValue = document.querySelector(".searchForm #search").value;
    transactionArr.forEach(element=>{
        if(element.title.includes(searchValue))
            arrTemp.push(element);
    });
    await renderTransactions(arrTemp);
}
var showTransactionDetails = async (id)=>{
    try{
        let transaction = (await firestore.collection("transactions").doc(id).get()).data();
        document.querySelector(".popUp .title").value = transaction.title;
        document.querySelector(".popUp .cost").value = transaction.cost;
        document.querySelector(".popUp .title").value = transaction.title;
        document.querySelector(".popUp .transactionType").value = transaction.type;
        document.querySelector(".popUp .date").value = transaction.date.toDate().toISOString().split("T")[0];
    }catch(error){
        console.log(error);
    }
}
var viewBtnClicked = async (docId)=>{
    popUp.style.transform = `scale(1)`;
    let container = document.querySelector(".containerWrapper");
    container.style.filter = `blur(3px)`;
    await showTransactionDetails(docId);
    transactionEditBtn.setAttribute("onclick",`return transactionEditBtnClicked("${docId}");return false;`);
    transactionEditBtn.setAttribute("type","button");
}
var fetchTransactions = async ()=>{
    transactionArr = [];
    let transactions = await firestore.collection("transactions").where("uid","==",uid).orderBy("date","desc").get();
    transactions.forEach(doc => {
        let element = doc.data();
        element.transactionId = doc.id;
        transactionArr.push(element);
    });
    return transactionArr;
}
var renderTransactions = async (transactions)=>{
    try {
        transactionsList.innerHTML = "";
        let i=1;
        let color;
        let date;
        let totalMoney = 0;
        transactions.forEach(element => {
            if(element.type === "expense")
                color = "red";
            else
                color = "green";
            date = element.date.toDate().toISOString().split("T")[0];
            transactionsList.insertAdjacentHTML("beforeend",`<div class="transaction">
            <div class="index">${i}</div>
            <div class="title">${element.title}</div>
            <div class="cost" style="color: ${color};">${element.cost}${currency}</div>
            <div class="date">${date}</div>
            <div class="viewBtn" onclick="viewBtnClicked('${element.transactionId}')"><i class="fas fa-eye"></i></div>
            <div class="deleteBtn" onclick="deleteBtnClicked('${element.transactionId}')"><i class="fas fa-backspace"></i></div>
        </div>`);
        if(element.type === "expense")
            totalMoney-=element.cost;
        else
            totalMoney+=element.cost;
        i++;
        });
        totalMoney = totalMoney.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");   //Insert commas in number value.
        document.querySelector(".navBar .amount").innerHTML = `Balance<br><b>${totalMoney+currency}</b>`;
        
    } catch (error) {
        console.log(error);
    }
}
var transactionSubmission = async (e) =>{
    e.preventDefault();
    try {
        let title = document.querySelector("#title").value;
        let cost  = document.querySelector("#cost").value;
        let date = new Date(document.querySelector("#date").value);
        let type = document.querySelector("#transactionType").value;
        if(title && cost && date && type){
            let transactionObj = {
                title,
                cost: parseFloat(cost),
                date,
                type,
                uid
            }
            if(user.emailVerified){
                await firestore.collection("transactions").add(transactionObj);
                renderTransactions( await fetchTransactions());
            }else{
                alert("Email Not Verified\nCheck Mail Or\nGo to Settings Page");
            }
            
        }
    } catch (error) {
        console.log(error);
    }
}
var fetchUser = async (uid)=>{    
    try {
        userInfo = (await firestore.collection("users").doc(uid).get()).data();
        fullName = userInfo.fullName;
        date = userInfo.createdAt.toDate().toISOString().split("T")[0];
        document.querySelector(".navBar .name").innerHTML = fullName;
        currency = userInfo.currency;
    } catch (error) {
        console.log(error);
    }
}
var signOut = async ()=>{
    auth.signOut();
}
var setImage = async ()=>{
    let url = await imageRef.getDownloadURL();
    document.querySelector('.navBar .image>img').src = url;
}
auth.onAuthStateChanged(async user=>{
    if(user){
        uid = user.uid;
        window.user = user;
        fetchUser(uid);
        renderTransactions(await fetchTransactions());
        imageRef = storage.child(`image/${uid}.png`);
        setImage();
    }else{
        location.assign("index.html");
    }
})
settingsBtn.addEventListener("click",e=>{
    e.preventDefault();
    location.assign("settings.html");
});
transactionAddBtn.addEventListener("click",e=>transactionSubmission(e));
searchBtn.addEventListener("click",e=>searchBtnClicked(e));
searchResetBtn.addEventListener("click",e=>searchResetBtnClicked(e));


/*
*********************************************
*******Canvas Circle Animation Code*********
*********************************************
*/
var canvas = document.querySelector(".canvas");
var containerHeight = document.querySelector('.wrapper').getBoundingClientRect().height;
var containerWidth = document.querySelector('.wrapper').getBoundingClientRect().width;
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
    containerHeight = document.querySelector('.wrapper').getBoundingClientRect().height;
    containerWidth = document.querySelector('.wrapper').getBoundingClientRect().width;
    canvas.width = containerWidth;
    canvas.height = containerHeight;
    init();
})
window.addEventListener('mousemove',e=>{
    mouse.x = e.x;
    mouse.y = e.y;
})
