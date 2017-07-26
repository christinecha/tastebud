import React from 'react'
import { Link } from 'react-router-dom'

class Header extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <nav id='header'>
        <Link to='/'>Home</Link>
        <Link to='/login'>Login</Link>
        <Link to='/signup'>Signup</Link>
        <Link to='/sample'>Dashboard</Link>
      </nav>
    )
  }
}

export default Header
