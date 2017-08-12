import { ref } from '../constants/firebase'
import createLocationObject from '../lib/createLocationObject'

export const isDupeLocation = (locationData) => {
  return new Promise((resolve, reject) => {
    ref.child('locations')
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

export const newLocation = (_locationData) => {
  return new Promise((resolve, reject) => {
    const locationData = createLocationObject(_locationData)

    isDupeLocation(locationData).then(dupeId => {
      if (dupeId) return resolve(dupeId)

      const newLocationRef = ref.child('locations').push(locationData)
      newLocationRef.update({ id: newLocationRef.key }).then(() => {
        resolve(newLocationRef.key)
      })
    })
  })
}

export const getLocation = (locationId) => {
  return ref.child(`locations/${locationId}`).once('value')
}
