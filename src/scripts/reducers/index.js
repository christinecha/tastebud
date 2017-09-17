import { combineReducers } from 'redux'
import currentUser from './currentUser'
import currentLocation from './currentLocation'

const reducers = {
  currentUser,
  currentLocation
}

export default reducers
