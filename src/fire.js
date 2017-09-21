import firebase from 'firebase';
import firestore from 'firestore';

firebase.initializeApp({
  apiKey: 'AIzaSyAGFmHiTFDrHqsI6iGj47f9MfX4YrrfXLA',
  authDomain: 'charlies-cafe.firebaseapp.com',
  projectId: 'charlies-cafe'
});

firebase.firestore().settings({
    // Enable offline support
  persistence: true
});

  // Initialize Cloud Firestore through firebase
var db = firebase.firestore();

export default db;

// var firebase = require("firebase");
// require("firebase/auth");
// require("firebase/database");

// var config = {
//     apiKey: "AIzaSyAGFmHiTFDrHqsI6iGj47f9MfX4YrrfXLA",
//     authDomain: "charlies-cafe.firebaseapp.com",
//     databaseURL: "https://charlies-cafe.firebaseio.com",
//     projectId: "charlies-cafe",
//     storageBucket: "charlies-cafe.appspot.com",
//     messagingSenderId: "234006628796"
// };

// var fire = firebase.initializeApp(config);
// export default fire;