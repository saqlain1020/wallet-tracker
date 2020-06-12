var auth = firebase.auth();
var firestore = firebase.firestore();

var signInBtn = document.querySelector("#signInBtn");
var signUpBtn = document.querySelector("#signUpBtn");
var googleSignInBtn = document.querySelector("#googleSignInBtn");

var googleSignIn = async e =>{
    e.preventDefault();
    try {
        let googleProvider = new firebase.auth.GoogleAuthProvider();
        let user = await auth.signInWithPopup(googleProvider);
        let uid = user.user.uid;
        let isNewUser = user.additionalUserInfo.isNewUser;
        console.log(user);
        if(isNewUser){
            let userInfo = {
                displayName: user.user.displayName,
                email: user.user.email,
                createdAt: new Date()
            }
            console.log(userInfo);
            await firestore.collection("users").doc(uid).set(userInfo);
            alert("User Added");
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
            let uid = user.user.uid;
            let userInfo = (await firestore.collection("users").doc(uid).get()).data();
            console.log(userInfo);
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
            let uid = user.user.uid;
            //Send User info to Firestore
            let userInfo = {
                fullName,
                email,
                createdAt: new Date()
            }
            await firestore.collection("users").doc(uid).set(userInfo);
            console.log(userInfo);
            alert("User Added");
        }else{
            alert("Fields Missing...");
            document.getElementById("passSignin").value = "";
        }
    }catch(error){
        alert(error);
    }
}

signInBtn.addEventListener("click",e => signInSubmission(e));
signUpBtn.addEventListener("click",e => signUpSubmission(e));
googleSignInBtn.addEventListener("click",e => googleSignIn(e));
