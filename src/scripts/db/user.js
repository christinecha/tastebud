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

export const updateUser = (id, data) => {
  return ref.child(`users/${id}`).update(data)
}

export const createUserFromFacebookRedirect = (callback) => {
  getUserFromFacebook().then(result => {
    const fbUser = result.user

    if (!fbUser) return

    const userRef = ref.child('users').push()

    saveUser({
      fullName: fbUser.displayName,
      uid: userRef.key
    })
    .then(callback)
  })
}

export const followUser = (user, followId) => {
  const following = user.following ? user.following.slice() : []
  if (following.indexOf(followId) > -1) return

  following.push(followId)
  updateUser(user.uid, { following })

  getUser(followId).then((snapshot) => {
    const followedUser = snapshot.val()
    updateUserFollowing(followedUser, user.uid)
  })
}

export const updateUserFollowing = (user, followerId) => {
  const followers = user.followers ? user.followers.slice() : []
  if (followers.indexOf(followerId) > -1) return

  followers.push(followerId)
  updateUser(user.uid, { followers })
}
