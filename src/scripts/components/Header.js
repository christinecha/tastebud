import React from 'react'
import { Link } from 'react-router-dom'

class Header extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { currentUser } = this.props

    return (
      <nav id='header'>
        <Link to='/'>Home</Link>
        <Link to='/login'>Login</Link>
        <Link to='/map'>Map</Link>
        <Link to='/signup'>Signup</Link>
        {currentUser && <Link to={`/users/${currentUser.uid}`}>Profile</Link>}
      </nav>
    )
  }
}

export default Header
