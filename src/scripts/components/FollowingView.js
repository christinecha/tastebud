import React from 'react'
import UserList from './UserList'
import { getUser } from '../db/user'

class FollowingView extends React.Component {
  constructor ( props ) {
    super( props )

    this.state = {
      user: {},
    }
  }

  componentDidMount () {
    const userId = this.props.computedMatch.params.uid

    getUser( userId ).then(( snapshot ) => {
      if ( this.isUnmounting ) return
      const user = snapshot.val()
      this.setState({ user })
    })
  }

  componentWillUnmount () {
    this.isUnmounting = true
  }

  render () {
    return (
      <main id='following-view' className='view'>
        <UserList users={this.state.user.following || []} />
      </main>
    )
  }
}

export default FollowingView
