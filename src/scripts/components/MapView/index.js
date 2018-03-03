import React from 'react'

import PlaceMap from './PlaceMap'
import PlacePreview from '../Places/PlacePreview'
import PlaceDetail from '../Places/PlaceDetail'
import Header from './Header'

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
          place={activePlace}
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

  render () {
    const { activePlaceIndex } = this.state
    const hasPlacePreview = activePlaceIndex !== null

    return (
      <main id='map-view' className='view' data-has-place-preview={hasPlacePreview}>
        <Header
          filters={this.state.filters}
          updateMapCenter={this.updateMapCenter}
          currentLocation={this.props.currentLocation}
        />
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
