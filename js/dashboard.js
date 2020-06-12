// var uid = location.hash.substring(1,location.hash.length);
var firestore = firebase.firestore();
var auth = firebase.auth();
var signOutBtn = document.querySelector(".signOutBtn");
var userInfo,fullName,date,uid;

var signOut = async  ()=>{
    await auth.signOut();
}
var fetchUser = async (uid)=>{    
    try {
        userInfo = (await firestore.collection("users").doc(uid).get()).data();
        fullName = userInfo.fullName;
        date = userInfo.createdAt.toDate().toISOString().split("T")[0];
        console.log(date);
        console.log(userInfo);
        let name = document.querySelector(".navBar .name").innerHTML = fullName;
    } catch (error) {
        alert(error);
    }
}

auth.onAuthStateChanged(async user=>{
    if(user){
        uid = user.uid;
        fetchUser(uid);
    }else{
        location.assign("index.html");
    }
})
signOutBtn.addEventListener("click",signOut);
// fetchUser();