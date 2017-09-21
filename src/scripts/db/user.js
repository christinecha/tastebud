import { ref } from '../constants/firebase'
import { getUserFromFacebook } from '../db/auth'
import createUserObject from '../lib/createUserObject'

export const saveUser = (_userData) => {
  const userData = createUserObject(_userData)
  return ref.child(`users/${userData.uid}`).set(userData, (n) => console.log('done', userData))
}

export const getUser = (id) => {
  return ref.child(`users/${id}`).once('value')
}

export const watchUser = (id, callback) => {
  return ref.child(`users/${id}`).on('value', callback)
}

export const updateUser = (id, data) => {
  return ref.child(`users/${id}`).update(data)
}

export const createUserFromFacebookRedirect = (callback) => {
  getUserFromFacebook().then(result => {
    const fbUser = result.user

    if (!fbUser) return

    saveUser({
      fullName: fbUser.displayName,
      uid: fbUser.uid
    })
    .then(() => callback(fbUser.uid))
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

export const removePlaceFromUser = (user, placeId) => {
  let places = user.places || []
  const index = places.indexOf(placeId)
  if (index < 0) return

  places.splice(index, 1)
  return updateUser( user.uid, { places })
}

export const addPlaceToUser = (user, placeId) => {
  let places = user.places || []
  if (places.indexOf(placeId) > -1) return
  places.push(placeId)
  return updateUser(user.uid, { places })
}
