import { ref } from '../constants/firebase'
import { getUserFromFacebook } from '../db/auth'
import createUserObject from '../lib/createUserObject'

export const saveUser = ( _userData ) => {
  const userData = createUserObject( _userData )
  return ref.child( `users/${ userData.uid }` ).set( userData, ( n ) => console.log( 'done', userData ))
}

export const findUsersByUsername = ( query ) => {
  query = query.toUpperCase()
  return ref.child( 'users' )
  .orderByChild( 'username' )
  .startAt( query )
  .once( 'value' )
}

export const findUserByExactUsername = ( username ) => {
  return ref.child( 'users' )
  .orderByChild( 'username' )
  .startAt( username )
  .endAt( username )
  .once( 'value' )
}

export const getUser = ( id ) => {
  return ref.child( `users/${ id }` ).once( 'value' )
}

export const watchUser = ( id, callback ) => {
  return ref.child( `users/${ id }` ).on( 'value', callback )
}

export const unwatchUser = ( id, callback ) => {
  return ref.child( `users/${ id }` ).off( 'value', callback )
}

export const updateUser = ( id, data ) => {
  return ref.child( `users/${ id }` ).update( data )
}

export const createUserFromFacebookRedirect = ( username, callback, err ) => {
  getUserFromFacebook().then(( result ) => {
    const { user } = result

    if ( !user ) {
      if ( err ) err()
      throw Error( 'This Facebook user is invalid.' )
    }

    const fbData = user.providerData[ 0 ]

    const userData = {
      username,
      fullName: fbData.displayName,
      uid: fbData.uid,
      email: fbData.email || null,
    }

    saveUser( userData )
    .then(() => callback( userData.uid ))
  })
}

export const followUser = ( user, followId ) => {
  let following = user.following ? user.following.slice() : []

  if ( following.indexOf( followId ) < 0 ) {
    following.push( followId )
  }

  updateUser( user.uid, { following })

  getUser( followId )
  .then(( snapshot ) => {
    const followedUser = snapshot.val()
    addToUserFollowing( followedUser, user.uid )
  })
  .catch(( err ) => { console.log( err ) })
}

export const addToUserFollowing = ( user, followerId ) => {
  let followers = user.followers ? user.followers.slice() : []

  if ( followers.indexOf( followerId ) < 0 ) {
    followers.push( followerId )
  }

  updateUser( user.uid, { followers })
}

export const unfollowUser = ( user, unfollowId ) => {
  let following = user.following ? user.following.slice() : []

  const index = following.indexOf( unfollowId )
  if ( index > -1 ) following.splice( index, 1 )

  updateUser( user.uid, { following })

  getUser( unfollowId )
  .then(( snapshot ) => {
    const unfollowedUser = snapshot.val()
    removeFromUserFollowing( unfollowedUser, user.uid )
  })
  .catch(( err ) => { console.log( err ) })
}

export const removeFromUserFollowing = ( user, unfollowerId ) => {
  let followers = user.followers ? user.followers.slice() : []

  const index = followers.indexOf( unfollowerId )
  if ( index > -1 ) followers.splice( index, 1 )

  updateUser( user.uid, { followers })
}

export const removePlaceFromUser = ( user, placeId ) => {
  let places = user.places || []
  const index = places.indexOf( placeId )
  if ( index < 0 ) return

  places.splice( index, 1 )
  return updateUser( user.uid, { places })
}

export const addPlaceToUser = ( user, placeId ) => {
  let places = user.places || []
  if ( places.indexOf( placeId ) > -1 ) return
  places.push( placeId )
  return updateUser( user.uid, { places })
}
