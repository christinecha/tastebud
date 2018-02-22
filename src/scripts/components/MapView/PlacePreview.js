import React from 'react'
import getFriendlyDistance from '../../lib/getFriendlyDistance'

class PlacePreview extends React.Component {
  render () {
    const { activePlace } = this.props

    if ( !activePlace ) return null

    const latLng = {
      lat: activePlace.lat,
      lng: activePlace.lng,
    }

    const distance = getFriendlyDistance( latLng, this.props.currentLocation )
    const dollarSigns = '$$$$'.substr( 0, activePlace.pricePoint )

    return (
      <div className='place-preview' onClick={this.props.toggleDetailView}>
        <div className='place-preview-content'>
          <h3>{activePlace.name}</h3><p className='price-point'>{dollarSigns}</p>
          <p className='label'>{distance}</p>
          <hr />
          <p className='label'>{activePlace.followerInfo || 'You like this'}</p>
        </div>
      </div>
    )
  }
}

export default PlacePreview
