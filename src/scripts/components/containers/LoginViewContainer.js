import { connect } from 'react-redux'
import { updateCurrentUser } from '../../actions'
import LoginView from '../LoginView'

const mapStateToProps = ( state ) => {
  return {
    currentUser: state.currentUser,
  }
}

const mapDispatchToProps = ( dispatch ) => {
  return {
    updateCurrentUser: ( user ) => {
      dispatch( updateCurrentUser( user ))
    },
  }
}

const LoginViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)( LoginView )

export default LoginViewContainer
