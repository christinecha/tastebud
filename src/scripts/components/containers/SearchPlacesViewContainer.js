import { connect } from 'react-redux'
import SearchPlacesView from '../SearchPlacesView'

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

const SearchPlacesViewContainer = connect(
  mapStateToProps,
)( SearchPlacesView )

export default SearchPlacesViewContainer
