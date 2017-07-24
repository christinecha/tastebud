import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { changeTheme } from '../actions'
import App from './App'

const mapStateToProps = (state) => {
  return {
    theme: state.theme,
    routing: state.routing
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchThemeChange: (theme) => {
      dispatch(changeTheme(theme))
    }
  }
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default withRouter(AppContainer)
