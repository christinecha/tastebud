import React from 'react'
import { withRouter } from 'react-router-dom'
import { Route, Switch, Redirect } from 'react-router-dom'

import PropsRoute from './PropsRoute'

import Header from './Header/index'
import HomeView from './HomeView'
import SampleComponent from './SampleComponent'
import MapView from './MapView'
import LoginView from './LoginView'
import SavePlaceView from './SavePlaceView'
import SearchView from './SearchView'
import SignupView from './SignupView/index'
import UserView from './UserView/index'
import FollowersView from './FollowersView'
import FollowingView from './FollowingView'

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

    setTimeout(() => {
      if (this.isUnmounting) return
      this.setState({ isLoading: false })
    }, 2000)

    watchAuthState(this.handleAuthStateChange)

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords
        const currentLocation = {
          lat: latitude,
          lng: longitude
        }

        this.props.updateCurrentLocation(currentLocation)
      })
    }
  }

  componentWillUnmount() {
    this.isUnmounting = true
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

      createUserFromFacebookRedirect((uid) => {
        getUser(uid).then(_snapshot => {
          const _user = _snapshot.val()
          if (_user) this.handleLogin(_user)
        })
      })
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
          <Switch>
            <Route exact path='/' component={HomeView} />
            <PropsRoute path='/map' component={MapView} {...this.props} />
            <Route path='/sample' component={SampleComponent} />
            <PropsRoute path='/login' component={LoginView} {...this.props} />
            <Route path='/signup' component={SignupView} />
            <PropsRoute path='/save-place' component={SavePlaceView} {...this.props} />
            <PropsRoute path='/search' component={SearchView} {...this.props} />
            <PropsRoute exact path='/users/:uid' component={UserView} {...this.props} />
            <PropsRoute path='/users/:uid/followers' component={FollowersView} {...this.props} />
            <PropsRoute path='/users/:uid/following' component={FollowingView} {...this.props} />
            <Redirect from='*' to='/' />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App
