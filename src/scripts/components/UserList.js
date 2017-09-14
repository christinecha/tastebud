import React from 'react'

class UserList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      users: []
    }
  }

  componentWillMount() {
    this.getUsers.then(userSnapshots => {
      this.setState({
        users: userSnapshots.map(s => s.val())
      })
    })
  }

  getUsers() {
    return Promise.all(
      this.props.uids.map(uid => {
        return getUser(uid)
      })
    )
  }

  renderUser(user) {

  }

  render() {
    console.log(this.state.users)
    return (
      <div className='user-list'>{this.props.children}</div>
    )
  }
}

export default UserList
