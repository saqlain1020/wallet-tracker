var auth = firebase.auth();
var firestore = firebase.firestore();

var signInBtn = document.querySelector("#signInBtn");
var signUpBtn = document.querySelector("#signUpBtn");
var googleSignInBtn = document.querySelector("#googleSignInBtn");
var uid,userAdded = true;

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
        auth.sendPasswordResetEmail(document.getElementById("emailSignin").value);
        document.getElementById("emailSignin").value = "";
        alert("Password Reset Link Send To Mail.")
    })
        
})


signInBtn.addEventListener("click",e => signInSubmission(e));
signUpBtn.addEventListener("click",e => signUpSubmission(e));
googleSignInBtn.addEventListener("click",e => googleSignIn(e));
