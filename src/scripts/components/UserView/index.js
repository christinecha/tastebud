import React from 'react'
import { saveUser } from '../../db/user'
import { getLocation } from '../../db/location'
import EditUser from './EditUser'

class UserView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      locations: [],
      isEditing: false
    }
  }

  componentDidMount() {
    const { currentUser } = this.props

    if (!currentUser) return

    if (currentUser.firstLogin) {
      currentUser.firstLogin = false
      saveUser(currentUser)
    }

    this.getUserRecommendations()
  }

  componentWillUnmount() {
    this.isUnmounting = true
  }

  getUserRecommendations() {
    if (!this.props.currentUser.recommendations) return

    this.props.currentUser.recommendations.forEach(rec => {
      getLocation(rec).then(snapshot => {
        let _locations = this.state.locations
        const location = snapshot.val()
        _locations.push(location)

        if (this.isUnmounting) return

        this.setState({ locations: _locations })
      })
    })
  }

  renderLocations() {
    console.log(this.state.locations)
    return this.state.locations.map((loc, i) => {
      console.log(i, loc)
      return (
        <div className='recommendation' key={i}>
          {loc.name}
        </div>
      )
    })
  }

  renderUserInfo(user) {
    if (!user) return null

    if (this.state.isEditing) return <EditUser {...this.props} />

    return (
      <div>
        <button onClick={() => this.setState({ isEditing: true })}>edit</button>
        <h1>{user.fullName}</h1>
        <h5>@{user.username}</h5>
        {this.renderLocations()}
      </div>
    )
  }

  render() {
    const { currentUser } = this.props
    return (
      <main id='user-view'>
        {this.renderUserInfo(currentUser)}
      </main>
    )
  }
}

export default UserView
