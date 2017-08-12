import locationSchema from '../schema/locationSchema'

const createLocationObject = (locationData) => {
  return Object.assign(
    {},
    locationSchema,
    locationData
  )
}

export default createLocationObject
