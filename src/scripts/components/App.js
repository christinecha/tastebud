import React from 'react'
import { withRouter } from 'react-router-dom'
import { Route } from 'react-router-dom'

import PropsRoute from './PropsRoute'

import Header from './Header'
import HomeView from './HomeView'
import SampleComponent from './SampleComponent'
import MapView from './MapView'
import LoginView from './LoginView'
import SavePlaceView from './SavePlaceView'
import SignupView from './SignupView/index'
import UserView from './UserView/index'

import { getCurrentUser, watchAuthState } from '../db/auth'
import { getUser, saveUser, createUserFromFacebookRedirect } from '../db/user'


class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: location.pathname === '/'
    }

    this.handleLogin = this.handleLogin.bind(this)
    this.handleAuthStateChange = this.handleAuthStateChange.bind(this)
  }

  componentWillMount() {
    this.props.history.listen(location => this.handleHistoryListen(location))

    watchAuthState(this.handleAuthStateChange)
  }

  handleLogin(user) {
    this.props.updateCurrentUser(user)

    if (this.props.history.location.pathname !== '/') return

    if (user.firstLogin) this.props.history.push(`/users/${user.uid}`)
    else this.props.history.push('/map')

    this.setState({ isLoading: false })
  }

  handleAuthStateChange(data) {
    if (!data || !data.uid) {
      this.props.updateCurrentUser(null)
      this.setState({ isLoading: false })
      return
    }

    getUser(data.uid).then(snapshot => {
      const user = snapshot.val()

      if (user) return this.handleLogin(user)

      createUserFromFacebookRedirect(this.handleLogin)
    })
  }

  handleHistoryListen(location = {}) {
    if (location.pathname !== this.props.location.pathname) {
      this.props.location.pathname = location.pathname || window.location.pathname
      this.forceUpdate()
    }
  }

  toggleTheme() {
    const newTheme = this.props.theme === 'light' ? 'dark' : 'light'
    this.props.dispatchThemeChange(newTheme)
  }

  renderLoading() {
    return (
      <h1>loading</h1>
    )
  }

  render() {
    if (this.state.isLoading) return this.renderLoading()

    return (
      <div className='content-wrapper'>
        <Header {...this.props} />
        <div>
          <Route exact path='/' component={HomeView} />
          <PropsRoute path='/map' component={MapView} {...this.props} />
          <Route path='/sample' component={SampleComponent} />
          <PropsRoute path='/login' component={LoginView} {...this.props} />
          <Route path='/signup' component={SignupView} />
          <PropsRoute path='/save-place' component={SavePlaceView} {...this.props} />
          <PropsRoute path='/users/:uid' component={UserView} {...this.props} />
        </div>
      </div>
    )
  }
}

export default App
