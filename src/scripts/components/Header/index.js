import React from 'react'
import { Link } from 'react-router-dom'
import { logout } from '../../db/auth'
import NavItem from './NavItem'

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
    if (!currentUser) return null

    return (
      <nav id='header'>
        {/* <Link to='/'>Home</Link> */}
        {/* <Link to='/login'>Login</Link> */}
        {/* {!currentUser && <Link to='/signup'>Signup</Link>} */}
        <NavItem><Link to='/map' className='label'>Places</Link></NavItem>
        <NavItem><Link to='/search' className='label'>Add</Link></NavItem>
        <NavItem><Link to={`/users/${currentUser.uid}`} className='label'>Profile</Link></NavItem>
        <NavItem><div onClick={this.handleClick} className='label'>Sign Out</div></NavItem>
      </nav>
    )
  }
}

export default Header
