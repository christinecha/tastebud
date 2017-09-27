import React from 'react'
import { Link } from 'react-router-dom'
import { getUser } from '../db/user'

class UserList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      users: []
    }
  }

  componentWillMount() {
    if (this.props.users[0] && typeof this.props.users[0] === 'object') {
      this.setState({ users: this.props.users })
    }
  }

  componentWillReceiveProps(props) {
    if (this.state.users.length > 0) return

    this.getUsers(props.users).then(userSnapshots => {
      if (this.isUnmounting) return
      this.setState({
        users: userSnapshots.map(s => s.val())
      })
    })
  }

  componentWillUnmount() {
    this.isUnmounting = true
  }

  getUsers(users) {
    if (!users) users = this.props.users

    const promises = users.map(uid => getUser(uid))

    return Promise.all(promises)
  }

  renderUsers() {
    return this.state.users.map(user => {
      if (!user) return null

      return (
        <Link to={`/users/${user.uid}`} key={user.uid}>
          <div className='user'>
            <div className='profile-picture'></div>
            <div className='info'>
              <h3>{user.fullName}</h3>
              <h5>@{user.username}</h5>
            </div>
          </div>
        </Link>
      )
    })
  }

  render() {
    return (
      <div className='user-list'>
        {this.renderUsers()}
      </div>
    )
  }
}

export default UserList
