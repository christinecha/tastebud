import { connect } from 'react-redux'
import SearchPeopleView from '../SearchPeopleView'

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

const SearchPeopleViewContainer = connect(
  mapStateToProps,
)( SearchPeopleView )

export default SearchPeopleViewContainer
