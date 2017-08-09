import { ref } from '../constants/firebase'
import { getUserFromFacebook } from '../db/auth'
import createUserObject from '../lib/createUserObject'

export const saveUser = (_userData) => {
  const userData = createUserObject(_userData)
  return ref.child(`users/${userData.uid}`).set(userData, (n) => console.log('done'))
}

export const getUser = (id) => {
  return ref.child(`users/${id}`).once('value')
}

export const createUserFromFacebookRedirect = (callback) => {
  getUserFromFacebook().then(result => {
    const fbUser = result.user

    if (!fbUser) return

    saveUser({
      fullName: fbUser.displayName,
      uid: data.uid
    })
    .then(callback)
  })
}
