import React from 'react'
import Place from './Place'
import PlaceDetail from './MapView/PlaceDetail'

class PlaceList extends React.Component {
  constructor( props ) {
    super( props )
    this.state = {
      activePlace: null,
    }
  }

  renderPlaceDetail() {
    const { activePlace } = this.state
    if ( !activePlace ) return null

    return (
      <div className='place-detail-wrapper'>
        <PlaceDetail
          activePlace={activePlace}
          currentLocation={this.props.currentLocation}
          toggleDetailView={() => this.setState({ activePlace: null })}
        />
      </div>
    )
  }

  renderPlaces () {
    return this.props.places.map(( place ) => {
      if ( !place ) return null

      return (
        <Place
          key={place.id}
          place={place}
          onClick={() => this.setState({ activePlace: place })}
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
