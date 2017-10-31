import { connect } from 'react-redux'
import { updateCurrentUser } from '../../actions'
import JoinView from '../JoinView'

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

const JoinViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)( JoinView )

export default JoinViewContainer
