import React from 'react'
import { Link } from 'react-router-dom'
import { getUser } from '../db/user'
import { deepEqual } from '../lib/deep-equal'

class UserList extends React.Component {
  constructor ( props ) {
    super( props )

    this.state = {
      users: [],
    }
  }

  componentWillMount() {
    if ( !this.props.users[ 0 ]) return

    if ( typeof this.props.users[ 0 ] === 'object' ) {
      this.setState({ users: this.props.users })
    }
    else {
      this.populateUsers()
    }
  }

  componentDidUpdate ( props ) {
    if ( deepEqual( props.users, this.props.users )) return

    this.populateUsers()
  }

  componentWillUnmount () {
    this.isUnmounting = true
  }

  populateUsers() {
    this.getUsers( this.props.users ).then(( userSnapshots ) => {
      if ( this.isUnmounting ) return

      let users = []
      userSnapshots.forEach(( s ) => {
        if ( s && s.val()) users.push( s.val())
      })

      this.setState({ users })
    })
  }

  getUsers ( users ) {
    if ( !users ) users = this.props.users

    const promises = users.map(( uid ) => getUser( uid ))

    return Promise.all( promises )
  }

  renderUsers () {
    return this.state.users.map(( user ) => {
      if ( !user ) return null

      const profilePicStyle = {
        backgroundImage: `url(https://graph.facebook.com/${ user.uid }/picture?type=large)`,
      }

      return (
        <Link to={`/users/${ user.uid }`} key={user.uid}>
          <div className='user'>
            <div className='profile-picture' style={profilePicStyle}></div>
            <div className='info'>
              <h3>{user.fullName}</h3>
              <h5>@{user.username}</h5>
            </div>
          </div>
        </Link>
      )
    })
  }

  render () {
    return (
      <div className='user-list'>
        {this.renderUsers()}
      </div>
    )
  }
}

export default UserList
