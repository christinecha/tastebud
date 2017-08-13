import React from 'react'
import { Link } from 'react-router-dom'
import { logout } from '../db/auth'

class Header extends React.Component {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    logout().then(() => {
      this.props.history.push('/')
    })
  }

  render() {
    const { currentUser } = this.props

    return (
      <nav id='header'>
        <Link to='/'>Home</Link>
        <Link to='/login'>Login</Link>
        <Link to='/map'>Map</Link>
        {!currentUser && <Link to='/signup'>Signup</Link>}
        {currentUser && <Link to='/save-location'>Save Location</Link>}
        {currentUser && <Link to={`/users/${currentUser.uid}`}>Profile</Link>}
        {currentUser && <button onClick={this.handleClick}>Sign Out</button>}
      </nav>
    )
  }
}

export default Header
