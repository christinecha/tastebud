import React from 'react'

class NavItem extends React.Component {
  render () {
    const activeClassName = this.props.isActive ? 'is-active' : ''

    return (
      <div className={`nav-item ${ activeClassName }`}>
        {this.props.children}
      </div>
    )
  }
}

export default NavItem
