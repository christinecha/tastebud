import locationSchema from '../schema/locationSchema'

const createPlaceObject = ( locationData ) => {
  return Object.assign(
    {},
    locationSchema,
    locationData
  )
}

export default createPlaceObject
