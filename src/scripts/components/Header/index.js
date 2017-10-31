import React from 'react'
import { Link } from 'react-router-dom'
import { logout } from '../../db/auth'
import NavItem from './NavItem'

class Header extends React.Component {
  constructor ( props ) {
    super( props )

    this.handleClick = this.handleClick.bind( this )
  }

  handleClick () {
    logout().then(() => {
      this.props.history.push( '/' )
    })
  }

  render () {
    const { currentUser } = this.props
    if ( !currentUser ) return null

    return (
      <nav id='header'>
        <NavItem>
          <Link to='/map'>
            <img src='/assets/images/icon_places.svg' />
            <p className='label'>Map</p>
          </Link>
        </NavItem>
        <NavItem>
          <Link to='/search'>
            <img src='/assets/images/icon_add.svg' />
            <p className='label'>Add</p>
          </Link>
        </NavItem>
        <NavItem>
          <Link to={`/users/${ currentUser.uid }`}>
            <img src='/assets/images/icon_profile.svg' />
            <p className='label'>Profile</p>
          </Link>
        </NavItem>
        <NavItem>
          <div onClick={this.handleClick}>
            <img src='/assets/images/icon_activity.svg' />
            <p className='label'>Sign Out</p>
          </div>
        </NavItem>
      </nav>
    )
  }
}

export default Header
