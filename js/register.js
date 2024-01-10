// This JS file is for registering a new app user ---------------------------//

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

// Initialize Firebase Authentication
const auth = getAuth();

// Returns instance of your app's FRD
const db = getDatabase(app)

// ---------------- Register New Uswer --------------------------------//
document.getElementById('submitData').onclick = function(){
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('userEmail').value;

  // Firebase requires a password of at least 6 characters
  const password = document.getElementById('userPass').value;

  // Validate the user inputs
  if(!validation(firstName, lastName, email, password)){
    return;
  };

  // Create new app user using email/password auth
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    //Create user credential
    const user = userCredential.user;

    console.log(user);

    // Add user account info to the FRD
    // set function will create a new ref. or completely replace existing one
    // Each new user will be placed under the 'user' node
    set(ref(db, 'users/' + user.uid + '/accountInfo'), {
      uid: user.uid, // save userID for home.js reference
      email: email,
      password: encryptPass(password),
      firstname: firstName,
      lastname: lastName,
    })
    .then(() =>{
      // Data saved succesfully
      alert('User created successfully!')
    })
    .catch((error) => {
      // The write failed...
      alert(error)
    });
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
  });
}

// --------------- Check for null, empty ("") or all spaces only ------------//
function isEmptyorSpaces(str){
  return str === null || str.match(/^ *$/) !== null
}

// ---------------------- Validate Registration Data -----------------------//
// Function for form validation
function validation(firstName, lastName, email, password) {
  // Regular expressions for validating first name, last name, and email
  let fNameRegex = /^[a-zA-Z]+$/;
  let lNameRegex = /^[a-zA-Z]+$/;
  let emailRegex = /^[a-zA-Z0-9]+@ctemc\.org$/;

  // Check if any of the fields are empty or contain only spaces
  if (isEmptyOrSpaces(firstName) || isEmptyOrSpaces(lastName) || isEmptyOrSpaces(email) || isEmptyOrSpaces(password)) {
    // Display an alert if any field is empty or contains only spaces
    alert("Please complete all fields.");
    return false; // Return false to indicate validation failure
  }

  // Validate the format of the first name using regex
  if (!fNameRegex.test(firstName)) {
    // Display an alert if the first name does not match the expected format
    alert("The first name should only contain letters.");
    return false; // Return false to indicate validation failure
  }

  // Validate the format of the last name using regex
  if (!lNameRegex.test(lastName)) {
    // Display an alert if the last name does not match the expected format
    alert("The last name should only contain letters.");
    return false; // Return false to indicate validation failure
  }

  // Validate the format of the email using regex
  if (!emailRegex.test(email)) {
    // Display an alert if the email does not match the expected format
    alert("Please enter a valid email.");
    return false; // Return false to indicate validation failure
  }

  // If all validations pass, return true to indicate successful validation
  return true;
}

// Function to check if a string is empty or contains only spaces
function isEmptyOrSpaces(str) {
  return str === null || str.match(/^ *$/) !== null;
}

// --------------- Password Encryption -------------------------------------//
function encryptPass(password){
  let encrypted = CryptoJS.AES.encrypt(password, password);
  return encrypted.toString();
}

