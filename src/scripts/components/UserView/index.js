import React from 'react'
import { saveUser } from '../../db/user'
import EditUser from './EditUser'

class UserView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isEditing: false
    }
  }

  componentDidMount() {
    const { currentUser } = this.props

    if (currentUser) {
      currentUser.firstLogin = false
      saveUser(currentUser)
    }
  }

  renderUserInfo(user) {
    if (!user) return null

    if (this.state.isEditing) return <EditUser {...this.props} />

    return (
      <div>
        <button onClick={() => this.setState({ isEditing: true })}>edit</button>
        <h1>{user.fullName}</h1>
        <h5>@{user.username}</h5>
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
