import { connect } from 'react-redux'
import UserView from '../UserView'

const mapStateToProps = ( state ) => {
  return {
    currentUser: state.currentUser,
    routing: state.routing,
    currentLocation: {
      lat: state.currentLocation.lat,
      lng: state.currentLocation.lng,
    },
  }
}

const UserViewContainer = connect(
  mapStateToProps,
)( UserView )

export default UserViewContainer
