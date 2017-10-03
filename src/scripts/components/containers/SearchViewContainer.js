import { connect } from 'react-redux'
import SearchView from '../SearchView'

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

const SearchViewContainer = connect(
  mapStateToProps,
)( SearchView )

export default SearchViewContainer
