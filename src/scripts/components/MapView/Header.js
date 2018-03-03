import React from 'react'
import { Link } from 'react-router-dom'

import PlaceSearch from './PlaceSearch'

class Header extends React.Component {
  renderFilters() {
    const filterTypes = [ 'yours', 'friends', 'popular' ]

    return filterTypes.map(( type, i ) => {
      const isActive = !!this.props.filters[ type ]
      const isActiveClass = isActive ? 'is-active' : ''

      return (
        <div
          key={i}
          className={`type label ${ type } ${ isActiveClass }`}
          onClick={() => this.toggleFilter( type )}
        >
          <div className='icon'></div>
          {type}
        </div>
      )
    })
  }

  render() {
    return (
      <div className='map-tools'>
        <div className='location-search'>
          <Link to='/search-places?focus=true' className='fake-input'>
            Search for bars & restaurants
          </Link>
          {/* <div className='use-current-location' onClick={this.resetMap}>
            <div className='icon'></div>
          </div> */}
        </div>
        <div className='reference'>
          {this.renderFilters()}
        </div>
      </div>
    )
  }
}

module.exports = Header
