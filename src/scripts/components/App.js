import React from 'react'
import { withRouter } from 'react-router-dom'
import { Route, Switch, Redirect } from 'react-router-dom'

import PropsRoute from './PropsRoute'

import Header from './Header/index'
import HomeView from './HomeView'
import SampleComponent from './SampleComponent'
import MapViewContainer from './containers/MapViewContainer'
import LoginViewContainer from './containers/LoginViewContainer'
import SavePlaceView from './SavePlaceView'
import SearchView from './SearchView'
import SignupView from './SignupView/index'
import UserView from './UserView/index'
import FollowersView from './FollowersView'
import FollowingView from './FollowingView'

import { getFullScreenHeight } from '../lib/static-height'
import { getCurrentUser, watchAuthState } from '../db/auth'
import { getUser, saveUser, watchUser, createUserFromFacebookRedirect } from '../db/user'

const FORCE_REDIRECT_PATHS = [
  '/',
  '/login',
]

class App extends React.Component {
  constructor ( props ) {
    super( props )

    this.state = {
      isLoading: true,
      contentHeight: getFullScreenHeight() + 'px',
    }

    this.handleResize = this.handleResize.bind( this )
    this.handleLogin = this.handleLogin.bind( this )
    this.handleAuthStateChange = this.handleAuthStateChange.bind( this )
  }

  componentWillMount () {
    window.addEventListener( 'resize', this.handleResize )

    this.props.history.listen(( location ) => this.handleHistoryListen( location ))

    setTimeout(() => {
      if ( this.isUnmounting ) return
      this.setState({ isLoading: false })
    }, 5000 )

    watchAuthState( this.handleAuthStateChange )

    if ( 'geolocation' in navigator ) {
      navigator.geolocation.getCurrentPosition(( position ) => {
        const { latitude, longitude } = position.coords
        const currentLocation = {
          lat: latitude,
          lng: longitude,
        }

        this.props.updateCurrentLocation( currentLocation )
      })
    }
  }

  componentWillUnmount () {
    this.isUnmounting = true
    window.removeEventListener( 'resize', this.handleResize )
  }

  handleResize () {
    // this.setState({ contentHeight: getFullScreenHeight() + 'px' })
  }

  handleLogin ( user ) {
    const { history } = this.props
    this.setState({ isLoading: false })

    if ( user.firstLogin ) {
      history.push( `/users/${ user.uid }` )
      return
    }

    const { location } = history
    const { pathname } = location
    if ( FORCE_REDIRECT_PATHS.indexOf( pathname ) < 0 ) return

    history.push( '/map' )
  }

  handleAuthStateChange ( data ) {
    if ( !data || !data.uid ) {
      this.props.updateCurrentUser( null )
      this.setState({ isLoading: false })
      return
    }

    watchUser( data.uid, ( snapshot ) => {
      const user = snapshot.val()

      this.props.updateCurrentUser( user )

      if ( user ) return this.handleLogin( user )

      createUserFromFacebookRedirect(( uid ) => {
        getUser( uid ).then(( _snapshot ) => {
          const _user = _snapshot.val()
          if ( _user ) this.handleLogin( _user )
        })
      })
    })
  }

  handleHistoryListen ( location = {}) {
    if ( location.pathname !== this.props.location.pathname ) {
      this.props.location.pathname = location.pathname || window.location.pathname
      this.forceUpdate()
    }
  }

  toggleTheme () {
    const newTheme = this.props.theme === 'light' ? 'dark' : 'light'
    this.props.dispatchThemeChange( newTheme )
  }

  renderLoading () {
    return (
      <main id='loading-view' className='view'>
        <h1>loading</h1>
      </main>
    )
  }

  render () {
    const contentWrapperStyle = {
      height: this.state.contentHeight,
    }

    if ( this.state.isLoading ) {
      return (
        <div className='content-wrapper' style={contentWrapperStyle}>
          {this.renderLoading()}
        </div>
      )
    }

    return (
      <div className='content-wrapper' style={contentWrapperStyle}>
        <Header {...this.props} />
        <Switch>
          <Route exact path='/' component={HomeView} />
          <Route path='/map' component={MapViewContainer} />
          <Route path='/sample' component={SampleComponent} />
          <Route path='/login' component={LoginViewContainer} />
          <Route path='/signup' component={SignupView} />
          <PropsRoute path='/save-place' component={SavePlaceView} {...this.props} />
          <PropsRoute path='/search' component={SearchView} {...this.props} />
          <PropsRoute exact path='/users/:uid' component={UserView} {...this.props} />
          <PropsRoute path='/users/:uid/followers' component={FollowersView} {...this.props} />
          <PropsRoute path='/users/:uid/following' component={FollowingView} {...this.props} />
          <Redirect from='*' to='/' />
        </Switch>
      </div>
    )
  }
}

export default App
