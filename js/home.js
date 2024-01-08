// ----------------- Page Loaded After User Sign-in -------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { getDatabase, ref, set, update, child, get, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
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

// ---------------------// Get reference values -----------------------------

let userLink = document.getElementById('userLink'); //Username for navbar
let signOutLink = document.getElementById('signOut'); // Sign out link
let welcome = document.getElementById('welcome');     // Welcome header
let currentUser = null; // Initialize currentUser to null

// ----------------------- Get User's Name'Name ------------------------------
function getUsername(){
  // Grab value for the 'keep logged in' switch
  let keepLoggedIn = localStorage.getItem("keepLogedIn");

  // Grab user information passed from signIn.js
  if(keepLoggedIn == "yes"){
    currentUser = JSON.parse(localStorage.getItem('user'));
  }
  else{
    currentUser = JSON.parse(sessionStorage.getItem('user'));
  }
}

// Sign-out function that will remove user info from local/session storage and
// sign-out from FRD
function SignOutUser(){
  sessionStorage.removeItem('user');    // Clear session storage
  localStorage.removeItem('user');      // Clear local storage of user
  localStorage.removeItem('keepLoggedIn');

  signOutLink(auth).then(() => {
      // Sign-out successful
    }).catch((error) => {
      // Error occurred
    });

  window.location = "home.html"
}


// ------------------------Set (insert) data into FRD ------------------------
function setData(userID, year, month, day, activity){
  // Must use brackets around variable name to use it as a key
  set(ref(db, 'users/' + userID + '/data/' + year + '/' + month), {
    [day]: activity
  })
  .then(() => {
    alert("Data stored successfully.");
  })
  .catch((error) => {
    alert("There was an error. Error: " + error);
  });
}

// -------------------------Update data in database --------------------------
function updateData(userID, year, month, day, activity){
  // Must use brackets around variable name to use it as a key
  update(ref(db, 'users/' + userID + '/data/' + year + '/' + month), {
    [day]: activity
  })
  .then(() => {
    alert("Data updated successfully.");
  })
  .catch((error) => {
    alert("There was an error. Error: " + error);
  });
}

// ----------------------Get a datum from FRD (single data point)---------------
function getData(userID, year, month, day){

  let yearVal = document.getElementById('yearVal');
  let monthVal = document.getElementById('monthVal');
  let dayVal = document.getElementById('dayVal');
  let activityVal = document.getElementById('activityVal');

  const dbref = ref(db);  // firevase parameter for getting data

  // Provide the path through the nodes to the data
  get(child(dbref, 'users/' + userID + '/data/' + year + '/' + month)).then((snapshot) => {

    if(snapshot.exists()){
      yearVal.textContent = year;
      monthVal.textContent = month;
      dayVal.textContent = day;

      // To get specific valu from a key:   snapshot.val()[key]
      activityVal.textContent = snapshot.val()[day];
    }
    else{
      alert('No data found')
    }
  })
  .catch((error) => {
    alert('Unsuccessful, error: ' + error);
  });
}

// ---------------------------Get a month's data set --------------------------
// Must be an async function because you need to get all the data from FRD
// before you can process it for a table or graph
async function getDataSet(userID, year, month){

  let yearVal = document.getElementById('setYearVal');
  let monthVal = document.getElementById('setMonthVal');

  yearVal.textContent = `Year: ${year}`;
  monthVal.textContent = `Month: ${month}`;

  const days = [];
  const activities = [];
  const tbodyEl = document.getElementById('tbody-2');   //Select <tbody> element

  const dbref = ref(db);  // Firebase parameter for requesting data

  // Wait for all data to be pulled from FRD
  // Must provide the path through the nodes to the data

  await get(child(dbref, 'users/' + userID + '/data/' + year + '/' + month)).then((snapshot) => {
    if(snapshot.exists()) {
      console.log(snapshot.val());

      snapshot.forEach(child => {
        console.log(child.key, child.val());
        // Push values to correpsonding arrays
        days.push(child.key);
        activities.push(child.val());
      });
    }
    else{
      alert('No data found')
    }
  })
  .catch((error) => {
    alert('Unsuccessful, error: ' + error);
  });

  // Dynamically add table rows to HTML using string interpolation
  tbodyEl.innerHTML = ''; // Clear any existing table
  for(let i = 0; i < days.length; i++) {
    addItemToTable(days[i], activities[i], tbodyEl)
  }

  createChart(days, activities, month);
}

// Add a item to the table of data
function addItemToTable(day, activity, tbody){
  let tRow = document.createElement("tr");
  let td1 = document.createElement("td");
  let td2 = document.createElement("td");

  td1.innerHTML = day;
  td2.innerHTML = activity;

  tRow.appendChild(td1);
  tRow.appendChild(td2);

  tbody.appendChild(tRow);
}

function createChart(days, activities, month) {
  const ctx = document.getElementById("myChart");
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: days,
        datasets: [
            {
                label: `Number of activities done in ${month}`,
                data: activities,
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
        ]
    },
    options: {
        responsive: true,       // Re-size based on screen size
        scales: {                // Display options for x & y axes
            x: {
                title: {
                    display: true,
                    text: 'Days',       //x-axis title
                    font: {             // font properties
                        size: 20
                    },
                },
                ticks: {
                    font: {
                        size: 16
                    }
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Number of Activities',
                    font: {
                        size: 20
                    },
                },
                ticks: {
                    maxTicksLimit: data.max(activities)/10,    // limit # of ticks
                    font: {
                        size: 12
                    }
                }
            }
        },
        plugins: {          // Display options
            title: {
                display: true,
                text: `Number of Activities ${month}`,
                font: {
                    size: 24
                },
                padding: {
                    top: 10,
                    bottom: 30
                }
            },
            legend: {
                align: 'start',
                position: 'bottom'
            }
        }
    }
  });
}

// -------------------------Delete a day's data from FRD ---------------------
function deleteData(userID, year, month, day) {
  remove(ref(db, 'users/' + userID + '/data/' + year + '/' + month + '/' + day))
  .then(() => {
    alert('Data removed successfully');
  })
  .catch((error) => {
    alert('Unsuccessful, error: ' + error);
  });
}


// --------------------------- Home Page Loading -----------------------------
window.onload = function (){

  // ------------------------- Set Welcome Message -------------------------
  getUsername();    // Get current user's first name
  if(currentUser == null){
    userLink.innerText = "Create New Account?";
    userLink.classList.replace("nav-link", "btn");
    userLink.classList.add("btn-primary");
    userLink.href = "register.html";

    signOutLink.innerText="Sign In";
    signOutLink.classList.replace("nav-link", "btn");
    signOutLink.classList.add("btn-success");
    signOutLink.href = "signIn.html"
  }

  else{
    userLink.innerText = currentUser.firstname;
    welcome.innerText - "Welcome " + currentUser.firstname;
    userLink.classList.replace("btn", "nav-link");
    userLink.classList.add("btn-primary");
    userLink.href = "#";

    signOutLink.innerText="Sign Out";
    signOutLink.classList.replace("btn", "nav-link");
    signOutLink.classList.add("btn-success");
    document.getElementById('signOut').onclick = function(){
      SignOutUser();
    }
  }


  // Set (Insert) data function call
  document.getElementById('set').onclick = function (){
    const year = document.getElementById('year').value;
    const month = document.getElementById('month').value;
    const day = document.getElementById('day').value;
    const activity = document.getElementById('activity').value;
    const userID = currentUser.uid;

    setData(userID, year, month, day, activity);
  }


  // Update data function call
  document.getElementById('update').onclick = function (){
    const year = document.getElementById('year').value;
    const month = document.getElementById('month').value;
    const day = document.getElementById('day').value;
    const activity = document.getElementById('activity').value;
    const userID = currentUser.uid;

    updateData(userID, year, month, day, activity);
  }

  // Get a datum function call
  document.getElementById('get').onclick = function (){
    const year = document.getElementById('getYear').value;
    const month = document.getElementById('getMonth').value;
    const day = document.getElementById('getDay').value;
    const userID = currentUser.uid;

    getData(userID, year, month, day);
  };

  // Get a data set function call
  document.getElementById('getDataSet').onclick = function (){
    const year = document.getElementById('getSetYear').value;
    const month = document.getElementById('getSetMonth').value;
    const userID = currentUser.uid;

    getDataSet(userID, year, month);
  };

  // Delete a single day's data function call
  document.getElementById('delete').onclick = function (){
    const year = document.getElementById('delYear').value;
    const month = document.getElementById('delMonth').value;
    const day = document.getElementById('delDay').value;
    const userID = currentUser.uid;

    deleteData(userID, year, month, day);
  };

}