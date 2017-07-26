import { ref } from '../constants/firebase'

export const saveUser = (userData) => {
  return ref.child(`users/${userData.username}`).set(userData, (n) => console.log('done'))
}

export const getUser = (id) => {
  return ref.child(`users/${id}`).once('value')
}
