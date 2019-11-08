import firebase from 'firebase/app'
import 'firebase/firestore'

// Firebase configuration 
const firebaseConfig = {
    apiKey: "AIzaSyDcjed2KZEtVxCISVfNh8YFzxVQQr_XsUc",
    authDomain: "omega-baton-247517.firebaseapp.com",
    databaseURL: "https://omega-baton-247517.firebaseio.com",
    projectId: "omega-baton-247517",
    storageBucket: "omega-baton-247517.appspot.com",
    messagingSenderId: "606063863233",
    appId: "1:606063863233:web:5f866e5d21b9c3bd"
  };

// Get a Firestore instance
const firebaseApp = firebase.initializeApp(firebaseConfig)

export const db = firebaseApp