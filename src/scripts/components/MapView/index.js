import React from 'react'

import PlaceMap from './PlaceMap'
import PlacePreview from './PlacePreview'
import PlaceSearch from './PlaceSearch'

class MapView extends React.Component {
  constructor ( props ) {
    super( props )

    this.updateActivePlace = this.updateActivePlace.bind( this )
    this.updateMapCenter = this.updateMapCenter.bind( this )

    this.state = {
      places: [],
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

  renderPlacePreview () {
    const { activePlace } = this.state
    if ( !activePlace ) return null

    return (
      <PlacePreview
        activePlace={activePlace}
        currentLocation={this.props.currentLocation}
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
          places={this.state.places}
          mapCenter={this.state.mapCenter}
          updateActivePlace={this.updateActivePlace}
          currentUser={this.props.currentUser}
        />
        {this.renderPlacePreview()}
      </main>
    )
  }
}

export default MapView
