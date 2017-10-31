import React from 'react'

class NavItem extends React.Component {
  render () {
    return (
      <div className='nav-item'>
        {this.props.children}
      </div>
    )
  }
}

export default NavItem
