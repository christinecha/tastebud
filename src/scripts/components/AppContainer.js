import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { updateCurrentUser, updateCurrentLocation } from '../actions'
import App from './App'

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

const mapDispatchToProps = ( dispatch ) => {
  return {
    updateCurrentUser: ( user ) => {
      dispatch( updateCurrentUser( user ))
    },
    updateCurrentLocation: ( location ) => {
      dispatch( updateCurrentLocation( location ))
    },
  }
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)( App )

export default withRouter( AppContainer )
