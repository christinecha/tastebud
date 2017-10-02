import { connect } from 'react-redux'
import { updateCurrentUser, updateCurrentLocation } from '../../actions'
import MapView from '../MapView'

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

const MapViewContainer = connect(
  mapStateToProps
)( MapView )

export default MapViewContainer
