import { ref, firebaseAuth } from '../constants/firebase'

export const watchAuthState = (callback) => {
  firebaseAuth().onAuthStateChanged(callback)
}

export function logout () {
  return firebaseAuth().signOut()
}

export function login (email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw)
}

export function resetPassword (email) {
  return firebaseAuth().sendPasswordResetEmail(email)
}

export const signUpWithEmail = ( email, pw ) => {
  return firebaseAuth().createUserWithEmailAndPassword(email, pw)
}

export const signInWithFacebook = () => {
  const provider = new firebaseAuth.FacebookAuthProvider()
  return firebaseAuth().signInWithRedirect(provider)
}

export const getUserFromFacebook = () => {
  return firebaseAuth().getRedirectResult()
}
