import React from 'react'
import UserList from './UserList'
import { getUser } from '../db/user'

class FollowersView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {}
    }
  }

  componentDidMount() {
    const userId = this.props.computedMatch.params.uid

    getUser(userId).then(snapshot => {
      if (this.isUnmounting) return
      const user = snapshot.val()
      this.setState({ user })
    })
  }

  componentWillUnmount() {
    this.isUnmounting = true
  }

  render() {
    return (
      <main id='followers-view' className='view'>
        <UserList users={this.state.user.followers || []} />
      </main>
    )
  }
}

export default FollowersView
