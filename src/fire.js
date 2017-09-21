import firebase from 'firebase';
// import auth from 'firebase';
import firestore from 'firestore';

var config = {
    apiKey: "AIzaSyAGFmHiTFDrHqsI6iGj47f9MfX4YrrfXLA",
    authDomain: "charlies-cafe.firebaseapp.com",
    databaseURL: "https://charlies-cafe.firebaseio.com",
    projectId: "charlies-cafe",
    storageBucket: "charlies-cafe.appspot.com",
    messagingSenderId: "234006628796"
  };
firebase.initializeApp(config);

firebase.firestore().settings({
  persistence: true
});

// Initialize Cloud Firestore through firebase
// var db = firebase.firestore();
// var provider = new firebase.auth.GoogleAuthProvider();

// firebase.auth().signInWithPopup(provider).then(function(result) {
//   // This gives you a Google Access Token. You can use it to access the Google API.
//   var token = result.credential.accessToken;
//   // The signed-in user info.
//   var user = result.user;
//   // ...
// }).catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   // The email of the user's account used.
//   var email = error.email;
//   // The firebase.auth.AuthCredential type that was used.
//   var credential = error.credential;
//   // ...
// });

export default firebase;