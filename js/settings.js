var firestore = firebase.firestore();
var auth = firebase.auth();
var signOutBtn = document.querySelector(".signOutBtn");
var changePassBtn = document.querySelector(".changePassBtn");
var changeEmailBtn = document.querySelector(".changeEmailBtn");
var changeNameBtn = document.querySelector(".changeNameBtn");
var changeCurrencyBtn = document.querySelector(".changeCurrencyBtn");
var userInfo,date,uid;


var changeCurrency = async (e)=>{
    e.preventDefault();
    try {
        let currency = document.querySelector("#newCurrency").value;
        let userObj = {
            currency
        }
        await firestore.collection("users").doc(uid).update(userObj);
    } catch (error) {
        alert(error);
    }
}
var changeName = async (e)=>{
    e.preventDefault();
    try{
        let name = document.querySelector("#newName").value;
        let userObj = {
            fullName: name
        }
        await firestore.collection("users").doc(uid).update(userObj);
        fetchUser(uid);
    }catch(error){
        alert(error);
    }    
}
var changeEmail = async (e,user)=>{
    e.preventDefault();
    try {
        user.updateEmail(document.querySelector("#newEmail").value);
        document.querySelector("#newEmail").value="";
        alert("Email Change Successfull...");
    } catch (error) {
        alert(error);
    }
}
var changePass = async (e,user)=>{
    e.preventDefault();
    try {
        user.updatePassword(document.querySelector("#newPass").value);
        document.querySelector("#newPass").value="";
        alert("Password Change Successfull...");
    } catch (error) {
        alert(error);
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
        alert(error);
    }
}

signOutBtn.addEventListener("click", e=>signOut(e));


auth.onAuthStateChanged(async user=>{
    if(user){
        if(!user.emailVerified)
            await user.sendEmailVerification();
        uid = user.uid;
        fetchUser(uid);
        changePassBtn.addEventListener("click", e=>changePass(e,user));
        changeEmailBtn.addEventListener("click", e=>changeEmail(e,user));
        changeNameBtn.addEventListener("click", e=>changeName(e));        
        changeCurrencyBtn.addEventListener("click", e=>changeCurrency(e));
    }else{
        location.assign("index.html");
    }
})
