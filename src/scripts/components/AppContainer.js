import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { updateCurrentUser } from '../actions'
import App from './App'

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser,
    routing: state.routing
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateCurrentUser: (user) => {
      dispatch(updateCurrentUser(user))
    }
  }
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default withRouter(AppContainer)
