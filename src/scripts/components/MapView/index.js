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
    return (
      <div className='map-tools'>
        <PlaceSearch
          updateMapCenter={this.updateMapCenter}
          currentLocation={this.props.currentLocation}
        />
        <div className='reference'>
          <div className='type label yours'>
            <div className='icon'></div>
            Yours
          </div>
          <div className='type label friends'>
            <div className='icon'></div>
            Friends
          </div>
          <div className='type label popular'>
            <div className='icon'></div>
            Popular
          </div>
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
        />
        {this.renderPlaceInfo()}
      </main>
    )
  }
}

export default MapView
