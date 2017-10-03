import React from 'react'
import { Link } from 'react-router-dom'

import { followUser, getUser, saveUser, unwatchUser, watchUser } from '../../db/user'
import { getPlacesWithFollowerInfo } from '../../db/place'
import { getFollowerInfo } from '../../lib/getFollowerInfo'

import EditUser from './EditUser'
import PlaceList from '../PlaceList'

class UserView extends React.Component {
  constructor ( props ) {
    super( props )

    this.handleWatchUser = this.handleWatchUser.bind( this )
    this.getUserPlaces = this.getUserPlaces.bind( this )

    this.state = {
      user: null,
      places: [],
      isEditing: false,
    }
  }

  componentDidMount () {
    const userId = this.props.match.params.uid
    this.firstLoad = true

    watchUser( userId, this.handleWatchUser )
  }

  handleWatchUser ( snapshot ) {
    if ( this.isUnmounting ) return

    const user = snapshot.val()
    this.setState({ user }, this.getUserPlaces )

    const { currentUser } = this.props
    if ( currentUser && user.uid === currentUser.uid ) {
      if ( currentUser.firstLogin ) {
        currentUser.firstLogin = false
        saveUser( currentUser )
      }
    }
  }

  componentWillUnmount () {
    const userId = this.props.match.params.uid
    this.isUnmounting = true
    unwatchUser( userId, this.handleWatchUser )
  }

  updateStateArray ( key, newItem, i ) {
    let items = this.state[ key ].slice()

    if ( i !== undefined ) items[ i ] = newItem
    else items.push( newItem )

    const stateObj = {}
    stateObj[ key ] = items

    this.setState( stateObj )
  }

  getUserPlaces () {
    if ( !this.firstLoad ) return

    const { user } = this.state
    const { currentUser } = this.props

    if ( !user || !user.places ) return
    if ( !currentUser ) return

    getPlacesWithFollowerInfo( user.places, currentUser )
    .then(( places ) => {
      if ( this.isUnmounting ) return
      this.setState({ places })

      this.firstLoad = false
    })
  }

  followUser () {
    const { currentUser } = this.props
    const { user } = this.state

    followUser( currentUser, user.uid )
  }

  renderStats () {
    const { user } = this.state

    if ( !user ) return null

    const places = user.places || []
    const following = user.following || []
    const followers = user.followers || []

    return (
      <div className='stats'>
        <div className='stats-places'>
          <p className='label'>Places</p>
          <h4 className='number'>{places.length}</h4>
        </div>
        <div className='stats-followers'>
          <Link to={`/users/${ user.uid }/followers`}>
            <p className='label'>Followers</p>
            <h4 className='number'>{followers.length}</h4>
          </Link>
        </div>
        <div className='stats-following'>
          <Link to={`/users/${ user.uid }/following`}>
            <p className='label'>Following</p>
            <h4 className='number'>{following.length}</h4>
          </Link>
        </div>
      </div>
    )
  }

  renderUserInfo () {
    const { currentUser } = this.props
    const { user } = this.state
    if ( !user ) return null

    if ( this.state.isEditing ) return <EditUser {...this.props} />

    const isSelf = (
      currentUser &&
      currentUser.uid === user.uid
    )

    return (
      <div>
        {isSelf &&
          <button
            className='edit-profile'
            onClick={() => this.setState({ isEditing: true })}
          >
            edit
          </button>
        }
        {!isSelf &&
          <button
            className='follow-profile'
            onClick={() => this.followUser()}
          >
            follow
          </button>
        }
        <div className='profile-picture'></div>
        <h1>{user.fullName}</h1>
        <h5>@{user.username}</h5>
        <h6 className='location'>New York, NY</h6>
      </div>
    )
  }

  render () {
    return (
      <main id='user-view' className='view'>
        {this.renderUserInfo()}
        {this.renderStats()}

        <PlaceList places={this.state.places} {...this.props} />
      </main>
    )
  }
}

export default UserView
