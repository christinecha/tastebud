import React from 'react'

import PlaceMap from './PlaceMap'
import PlacePreview from './PlacePreview'
import PlaceDetail from './PlaceDetail'
import PlaceSearch from './PlaceSearch'

class MapView extends React.Component {
  constructor ( props ) {
    super( props )

    this.updateActivePlace = this.updateActivePlace.bind( this )
    this.updateMapCenter = this.updateMapCenter.bind( this )
    this.toggleDetailView = this.toggleDetailView.bind( this )

    this.state = {
      filters: {
        yours: true,
        friends: true,
      },
      mapCenter: props.currentLocation,
      activePlace: null,
      detailView: false,
    }
  }

  updateActivePlace( activePlace = null ) {
    this.setState({ activePlace })
  }

  updateMapCenter( mapCenter = this.props.currentLocation ) {
    this.setState({ mapCenter })
  }

  toggleDetailView() {
    this.setState({ detailView: !this.state.detailView })
  }

  toggleFilter( type ) {
    const newFilters = Object.assign({}, this.state.filters )
    newFilters[ type ] = !newFilters[ type ]
    this.setState({ filters: newFilters })
  }

  renderPlaceInfo () {
    const { activePlace, detailView } = this.state
    if ( !activePlace ) return null

    if ( detailView ) {
      return (
        <PlaceDetail
          activePlace={activePlace}
          currentLocation={this.props.currentLocation}
          toggleDetailView={this.toggleDetailView}
        />
      )
    }

    return (
      <PlacePreview
        activePlace={activePlace}
        currentLocation={this.props.currentLocation}
        toggleDetailView={this.toggleDetailView}
      />
    )
  }

  renderMapTools() {
    const filterTypes = [ 'yours', 'friends', 'popular' ]

    const filters = filterTypes.map(( type, i ) => {
      const isActive = !!this.state.filters[ type ]
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
    return (
      <div className='map-tools'>
        <PlaceSearch
          updateMapCenter={this.updateMapCenter}
          currentLocation={this.props.currentLocation}
        />
        <div className='reference'>
          {filters}
        </div>
      </div>
    )
  }

  render () {
    const { activePlaceIndex } = this.state
    const hasPlacePreview = activePlaceIndex !== null

    return (
      <main id='map-view' className='view' data-has-place-preview={hasPlacePreview}>
        {this.renderMapTools()}
        <PlaceMap
          mapCenter={this.state.mapCenter}
          updateActivePlace={this.updateActivePlace}
          currentUser={this.props.currentUser}
          currentLocation={this.props.currentLocation}
          filters={this.state.filters}
        />
        {this.renderPlaceInfo()}
      </main>
    )
  }
}

export default MapView
