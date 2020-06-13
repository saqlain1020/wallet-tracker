// var uid = location.hash.substring(1,location.hash.length);
var firestore = firebase.firestore();
var auth = firebase.auth();
var signOutBtn = document.querySelector(".signOutBtn");
var userInfo,fullName,date,uid;
var transactionAddBtn = document.querySelector(".transactionAddBtn");
var transactionsList = document.querySelector(".transactionsList");

var renderTransactions = async ()=>{
    let transactions = await firestore.collection("transactions").where("uid","==",uid).orderBy("date","desc").get();
    let i=1;
    let color;
    let date;
    transactions.forEach(doc => {
        let element = doc.data();
        if(element.type === "expense")
            color = "red";
        else
            color = "green";
        date = element.date.toDate().toISOString().split("T")[0];
        transactionsList.insertAdjacentHTML("beforeend",`<div class="transaction">
        <div class="index">${i}</div>
        <div class="title">${element.title}</div>
        <div class="cost" style="color: ${color};">${element.cost}</div>
        <div class="date">${date}</div>
        <a href="transaction.html#${doc.id}"><div class="viewBtn">View</div></a>
    </div>`);
    i++;
    });
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
                cost,
                date,
                type,
                uid
            }
            await firestore.collection("transactions").add(transactionObj);
            renderTransactions();
        }
    } catch (error) {
        console.log(error);
    }
}

var signOut = async  ()=>{
    await auth.signOut();
}
var fetchUser = async (uid)=>{    
    try {
        userInfo = (await firestore.collection("users").doc(uid).get()).data();
        fullName = userInfo.fullName;
        date = userInfo.createdAt.toDate().toISOString().split("T")[0];
        document.querySelector(".navBar .name").innerHTML = fullName;
    } catch (error) {
        alert(error);
    }
}

auth.onAuthStateChanged(async user=>{
    if(user){
        uid = user.uid;
        fetchUser(uid);
        renderTransactions();
    }else{
        location.assign("index.html");
    }
})
signOutBtn.addEventListener("click",signOut);
transactionAddBtn.addEventListener("click",e=>transactionSubmission(e));

