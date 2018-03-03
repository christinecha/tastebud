import React from 'react'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'

import PropsRoute from './PropsRoute'

import Header from './Header/index'
import HomeView from './HomeView'
import SampleComponent from './SampleComponent'
import MapViewContainer from './containers/MapViewContainer'
import JoinViewContainer from './containers/JoinViewContainer'
import LoginViewContainer from './containers/LoginViewContainer'
import SearchPlacesViewContainer from './containers/SearchPlacesViewContainer'
import SearchPeopleViewContainer from './containers/SearchPeopleViewContainer'
import UserViewContainer from './containers/UserViewContainer'
import UserView from './UserView/index'
import FollowersView from './FollowersView'
import FollowingView from './FollowingView'

import { getFullScreenHeight } from '../lib/static-height'
import { getCurrentUser, watchAuthState } from '../db/auth'
import { getUser, watchUser, createUserFromFacebookRedirect } from '../db/user'

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

    this.handleLogin = this.handleLogin.bind( this )
    this.handleAuthStateChange = this.handleAuthStateChange.bind( this )
  }

  componentWillMount () {
    window.addEventListener( 'resize', this.handleResize )

    this.props.history.listen(( location ) => this.handleHistoryListen( location ))

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
    const { history } = this.props

    if ( !data || !data.uid ) {
      this.props.updateCurrentUser( null )
      this.setState({ isLoading: false })

      history.push( '/' )
      return
    }

    const fbData = data.providerData[ 0 ]

    watchUser( fbData.uid, ( snapshot ) => {
      const user = snapshot.val()

      this.props.updateCurrentUser( user )

      if ( user ) {
        this.handleLogin( user )
        return
      }

      // If there's no user, this is a new signup!
      this.props.history.push( '/join' )
      this.setState({ isLoading: false })
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
          <Route path='/map/:locationId' component={MapViewContainer} />
          <Route path='/sample' component={SampleComponent} />
          <Route path='/login' component={LoginViewContainer} />
          <Route path='/join' component={JoinViewContainer} />
          <Route path='/search-places' component={SearchPlacesViewContainer} />
          <Route path='/search-people' component={SearchPeopleViewContainer} />
          <Route exact path='/users/:uid' component={UserViewContainer} />
          <PropsRoute path='/users/:uid/followers' component={FollowersView} {...this.props} />
          <PropsRoute path='/users/:uid/following' component={FollowingView} {...this.props} />
          <Redirect from='*' to='/' />
        </Switch>
      </div>
    )
  }
}

export default App
