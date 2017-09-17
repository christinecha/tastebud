import React from 'react'
import { Link } from 'react-router-dom'
import { followUser, getUser, saveUser, watchUser } from '../../db/user'
import { getPlace } from '../../db/place'
import EditUser from './EditUser'
import { getFollowerInfo } from './lib/getFollowerInfo'

class UserView extends React.Component {
  constructor(props) {
    super(props)

    this.getUserPlaces = this.getUserPlaces.bind(this)

    this.state = {
      user: null,
      places: [],
      isEditing: false
    }
  }

  componentDidMount() {
    const userId = this.props.computedMatch.params.uid

    watchUser(userId, snapshot => {
      if (this.isUnmounting) return

      const user = snapshot.val()
      this.setState({ user }, this.getUserPlaces)

      const { currentUser } = this.props
      if (currentUser && user.uid === currentUser.uid) {
        if (currentUser.firstLogin) {
          currentUser.firstLogin = false
          saveUser(currentUser)
        }
      }
    })
  }

  componentWillUnmount() {
    this.isUnmounting = true
  }

  updateStateArray(key, newItem, i) {
    let items = this.state[key].slice()

    if (i !== undefined) items[i] = newItem
    else items.push(newItem)

    const stateObj = {}
    stateObj[key] = items

    this.setState(stateObj)
  }

  getUserPlaces() {
    const { user } = this.state

    if (!user || !user.places) return

    user.places.forEach((placeId, i) => {
      getPlace(placeId).then(snapshot => {
        if (this.isUnmounting) return

        const place = snapshot.val()
console.log('va', place)
        if (!place) return

        getFollowerInfo(place, user).then((msg) => {
          place.followerInfoMsg = msg
          this.updateStateArray('places', place, i)
        })
      })
    })
  }

  followUser() {
    const { currentUser } = this.props
    const { user } = this.state

    followUser(currentUser, user.uid)
  }

  renderPlaces() {
    console.log(this.state.places)
    return this.state.places.map((place) => {
      if (!place) return null

      return (
        <div className='place' key={place.id}>
          <div className='icon'></div>
          <h3 className='name'>{place.name}</h3>
          <p className='locale label'>West Village</p>
          <div className='follower-info'>
            <p>{place.followerInfoMsg}</p>
          </div>
        </div>
      )
    })
  }

  renderStats() {
    const { user } = this.state

    if (!user) return null

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
          <Link to={`/users/${user.uid}/followers`}>
            <p className='label'>Followers</p>
            <h4 className='number'>{followers.length}</h4>
          </Link>
        </div>
        <div className='stats-following'>
          <Link to={`/users/${user.uid}/following`}>
            <p className='label'>Following</p>
            <h4 className='number'>{following.length}</h4>
          </Link>
        </div>
      </div>
    )
  }

  renderUserInfo() {
    const { currentUser } = this.props
    const { user } = this.state
    if (!user) return null

    if (this.state.isEditing) return <EditUser {...this.props} />

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

  render() {
    return (
      <main id='user-view' className='view'>
        {this.renderUserInfo()}
        {this.renderStats()}

        <div className='places'>
          {this.renderPlaces()}
        </div>
      </main>
    )
  }
}

export default UserView
