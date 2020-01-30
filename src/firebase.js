import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";


var firebaseConfig = {
    apiKey: "AIzaSyBSDgVZjr0MCSd1fygQVq0smC3U24-cgX8",
    authDomain: "react-slack-4c4c9.firebaseapp.com",
    databaseURL: "https://react-slack-4c4c9.firebaseio.com",
    projectId: "react-slack-4c4c9",
    storageBucket: "react-slack-4c4c9.appspot.com",
    messagingSenderId: "3113332253",
    appId: "1:3113332253:web:2d805a081f4ab9e481a0f4",
    measurementId: "G-9Y6MNXYYG3"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // firebase.analytics();

  export default firebase;