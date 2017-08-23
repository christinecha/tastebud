import { ref } from '../constants/firebase'
import createPlaceObject from '../lib/createPlaceObject'

export const isDupePlace = (locationData) => {
  return new Promise((resolve, reject) => {
    ref.child('places')
    .orderByChild('lat')
    .equalTo(locationData.lat)
    .on('value', (snapshot) => {
      snapshot.forEach((child) => {
        const location = child.val()
        if (locationData.lng === location.lng) {
          resolve(child.key)
        }
      })

      resolve(null)
    })
  })
}

export const newPlace = (_locationData) => {
  return new Promise((resolve, reject) => {
    const locationData = createPlaceObject(_locationData)

    isDupePlace(locationData).then(dupeId => {
      if (dupeId) return resolve(dupeId)

      const newPlaceRef = ref.child('places').push(locationData)
      newPlaceRef.update({ id: newPlaceRef.key }).then(() => {
        resolve(newPlaceRef.key)
      })
    })
  })
}

export const getPlace = (id) => {
  return ref.child(`places/${id}`).once('value')
}

export const updatePlace = (id, data) => {
  return ref.child(`places/${id}`).update(data)
}

export const addUserToPlace = (placeId, userId) => {
  getPlace(placeId).then(snapshot => {
    const place = snapshot.val()
    const users = place.users || []

    if (users.indexOf(userId) > -1) return

    users.push(userId)
    updatePlace(placeId, { users })
  })
}
