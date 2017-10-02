import userSchema from '../schema/userSchema'

const createUserObject = ( userData ) => {
  return Object.assign(
    {},
    userSchema,
    userData
  )
}

export default createUserObject
