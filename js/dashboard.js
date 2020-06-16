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

var deleteBtnClicked = async (docId)=>{
    try {
        await firestore.collection("transactions").doc(docId).delete();
        renderTransactions(await fetchTransactions());
    } catch (error) {
        console.log(error);
    }
}
var transactionEditBtnClicked = async (e,id) =>{
    e.preventDefault();
    try {
        let title = document.querySelector(".popUp #title").value;
        let cost  = document.querySelector(".popUp #cost").value;
        let date = new Date(document.querySelector(".popUp #date").value);
        let type = document.querySelector(".popUp #transactionType").value;
        if(title && cost && date && type){
            let transactionObj = {
                title,
                cost: parseFloat(cost),
                date,
                type,
            }
            await firestore.collection("transactions").doc(id).update(transactionObj);
            renderTransactions(await fetchTransactions());
            let container = document.querySelector(".container");
            container.style.filter = `blur(0px)`;
            popUp.style.transform = `scale(0)`;
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
        document.querySelector(".popUp #title").value = transaction.title;
        document.querySelector(".popUp #cost").value = transaction.cost;
        document.querySelector(".popUp #title").value = transaction.title;
        document.querySelector(".popUp #transactionType").value = transaction.type;
        document.querySelector(".popUp #date").value = transaction.date.toDate().toISOString().split("T")[0];
    }catch(error){
        console.log(error);
    }
}
var viewBtnClicked = async (docId)=>{
    popUp.style.transform = `scale(1)`;
    let container = document.querySelector(".container");
    container.style.filter = `blur(3px)`;
    await showTransactionDetails(docId);
    transactionEditBtn.addEventListener("click",e=>transactionEditBtnClicked(e,docId));
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
            <div class="viewBtn" onclick="viewBtnClicked('${element.transactionId}')">View</div>
            <div class="deleteBtn" onclick="deleteBtnClicked('${element.transactionId}')">Delete</div>
        </div>`);
        if(element.type === "expense")
            totalMoney-=element.cost;
        else
            totalMoney+=element.cost;
        i++;
        });
        document.querySelector(".navBar .amount").innerHTML = totalMoney+currency;
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
            await firestore.collection("transactions").add(transactionObj);
            renderTransactions( await fetchTransactions());
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

auth.onAuthStateChanged(async user=>{
    if(user){
        uid = user.uid;
        fetchUser(uid);
        renderTransactions(await fetchTransactions());
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