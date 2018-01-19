import { ref } from '../constants/firebase'
import createPlaceObject from '../lib/createPlaceObject'
import { getFollowerInfo } from '../lib/getFollowerInfo'
import { getUser } from './user'

export const isDupePlace = ( locationData ) => {
  return new Promise(( resolve, reject ) => {
    ref.child( 'places' )
    .orderByChild( 'lat' )
    .equalTo( locationData.lat )
    .on( 'value', ( snapshot ) => {
      snapshot.forEach(( child ) => {
        const location = child.val()
        if ( locationData.lng === location.lng ) {
          resolve( child.key )
        }
      })

      resolve( null )
    })
  })
}

export const newPlace = ( _locationData ) => {
  return new Promise(( resolve ) => {
    const locationData = createPlaceObject( _locationData )

    isDupePlace( locationData ).then(( dupeId ) => {
      if ( dupeId ) {
        locationData.id = dupeId
        ref.child( `places/${ locationData.id }` ).update( locationData )
        .then(() => resolve( locationData.id ))
        return
      }

      ref.child( `places/${ locationData.id }` ).set( locationData )
      .then(() => resolve( locationData.id ))
    })
  })
}

export const getPlace = ( id ) => {
  return ref.child( `places/${ id }` ).once( 'value' )
}

export const updatePlace = ( id, data ) => {
  return ref.child( `places/${ id }` ).update( data )
}

export const addUserToPlace = ( placeId, userId ) => {
  getPlace( placeId ).then(( snapshot ) => {
    const place = snapshot.val()
    const users = place.users || []

    if ( users.indexOf( userId ) > -1 ) return

    users.push( userId )
    updatePlace( placeId, { users })
  })
}

export const removeUserFromPlace = ( placeId, userId ) => {
  getPlace( placeId ).then(( snapshot ) => {
    const place = snapshot.val()
    const users = place.users || []

    if ( users.length < 1 ) return

    const index = users.indexOf( userId )
    users.splice( userId, 1 )

    updatePlace( placeId, { users })
  })
}

export const getPlaceIdsFromUsers = ( users ) => {
  return Promise.all( users.map(( userId ) => {
    return new Promise(( resolve, reject ) => {
      getUser( userId )
      .then(( userSnapshot ) => {
        const user = userSnapshot.val()
        resolve( user.places || [])
      })
    })
  }))
}

export const getPlaces = ( places ) => {
  return Promise.all( places.map(( place ) => {
    return new Promise(( resolve, reject ) => {
      getPlace( place )
      .then(( snapshot ) => {
        resolve( snapshot.val())
      })
    })
  }))
}

export const getPlacesWithFollowerInfo = ( places, currentUser ) => {
  return new Promise(( resolve, reject ) => {
    getPlaces( places )
    .then(( places ) => {
      const promises = places.map(( place ) => getFollowerInfo( place, currentUser ))

      Promise.all( promises )
      .then(( messages ) => {
        messages.forEach(( message, i ) => {
          if ( places[ i ]) places[ i ].followerInfo = message
        })

        resolve( places )
      })
    })
  })
}
