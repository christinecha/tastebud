import { addUserToPlace } from './place'
import { addPlaceToUser } from './user'

export const linkUserAndPlace = ( userId, placeId ) => {
  addUserToPlace( placeId, userId )
  addPlaceToUser( userId, placeId )
}
