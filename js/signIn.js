/* Name: Jyothi Ramesh, Jasmine Guo, Ishani Singh
   Date: 1/8/2024
   Program: signIn.js
   Purpose: Create a functioning sign in html page that signs 
            an existing user in
*/

// ----------------- User Sign-In Page --------------------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { getDatabase, ref, set, update, child, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlGDiv37DRS5d6DzFrxGGi_GY2LJqnXWI",
  authDomain: "green-home-ef1e1.firebaseapp.com",
  databaseURL: "https://green-home-ef1e1-default-rtdb.firebaseio.com",
  projectId: "green-home-ef1e1",
  storageBucket: "green-home-ef1e1.appspot.com",
  messagingSenderId: "1043251414580",
  appId: "1:1043251414580:web:ea805de553872378a1ac61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();   // Firebase authentification

// Return an instance of the database associated with your app
const db = getDatabase(app);


// ---------------------- Sign-In User ---------------------------------------//

document.getElementById('signIn').onclick = function(){
  // Get user's email and password for sign in
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  //console.log(email,password);
  // Attempt to sign user in
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Create user credential and store user ID
    const user = userCredential.user;

    // Log sign-in date in DB
    // 'Update' function will only add the last_login infor and won't overwrite anything else
    let logDate = new Date();
    update(ref(db, 'users/' + user.uid + '/accountInfo'), {
      last_login: logDate,
    })
    .then(() => {
      // Uswer signed in successfully
      alert('User signed in successfully!')

      // Get snapshot of all the uswer info (including uid) that will be passed to the login() function and stored in session or local storage
      get(ref(db, 'users/' + user.uid + '/accountInfo')).then((snapshot) => {
        if (snapshot.exists()){
          console.log(snapshot.val());
          logIn(snapshot.val());        //logIn function will keep user signed in
        } else {
          console.log("User does not exist");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    })
    .catch((error) => {
      // Sign-In failed...
      alert(error)
    });
  })
  .catch((error) => {
    const errorMessage = error.message;
    alert(errorMessage);
  })
}

// ---------------- Keep User Logged In ----------------------------------//
function logIn(user){
  let keepLoggedIn = document.getElementById('keepLoggedInSwitch').ariaChecked;

  // Session storage is temporary (only while active session)
  // Info saved as a string (must convert to JS object to string)
  // Session storage will be cleared with a signOut() function in home.js
  if(!keepLoggedIn){
    sessionStorage.setItem('user', JSON.stringify(user));
    window.location="home.html"   // Redirect browser to home.html
  }

  // Local storage is permanent (keep user logged in if browser is closed)
  // Local storage will be cleared with signOut() function
  else {
    localStorage.setItem('keepLoggedIn', 'yes');
    localStorage.setItem('user', JSON.stringify(user));
    window.location="home.html"   // Redirrect browser to home.html
  }
}
