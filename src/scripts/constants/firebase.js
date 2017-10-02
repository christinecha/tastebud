import firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyAT0h7dZUilCk4MWj7mivthEn81S6XR2Gc',
  authDomain: 'tastebud-23bc0.firebaseapp.com',
  databaseURL: 'https://tastebud-23bc0.firebaseio.com',
  projectId: 'tastebud-23bc0',
  storageBucket: 'tastebud-23bc0.appspot.com',
  messagingSenderId: '835461059805',
}

firebase.initializeApp( config )

export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth
