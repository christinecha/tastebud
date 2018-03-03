import React from 'react'
import Place from './Place'
import PlaceDetail from './PlaceDetail'

class PlaceList extends React.Component {
  constructor( props ) {
    super( props )

    this.state = {
      activePlace: null,
    }
  }

  activatePlaceDetail( place ) {
    this.setState({ activePlace: place })
  }

  renderPlaceDetail() {
    const { activePlace } = this.state
    if ( !activePlace ) return null

    return (
      <div className='place-detail-wrapper'>
        <PlaceDetail
          place={activePlace}
          currentLocation={this.props.currentLocation}
          toggleDetailView={() => this.setState({ activePlace: null })}
        />
      </div>
    )
  }

  renderPlaces () {
    return this.props.places.map(( place ) => {
      if ( !place ) return null

      place.id = place.place_id || place.id

      return (
        <Place
          key={place.id}
          place={place}
          onClick={() => this.activatePlaceDetail( place )}
          {...this.props}
        />
      )
    })
  }

  render () {
    return (
      <div className='place-list'>
        {this.renderPlaces()}
        {this.renderPlaceDetail()}
      </div>
    )
  }
}

export default PlaceList
