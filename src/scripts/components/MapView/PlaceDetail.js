import React from 'react'
import axios from 'axios'
import getFriendlyDistance from '../../lib/getFriendlyDistance'

class PlaceDetail extends React.Component {
  constructor( props ) {
    super( props )

    this.state = {
      yelpRating: null,
    }
  }

  componentDidMount() {
    this.setYelpRating()
  }

  setYelpRating() {
    const { activePlace } = this.props

    const searchRequest = {
      params: {
        term: activePlace.name,
        latitude: activePlace.lat,
        longitude: activePlace.lng,
      },
    }

    axios.get( '/yelp-rating', searchRequest )
    .then(( response ) => {
      this.setState({ yelpRating: response.data.rating.toFixed( 1 ) })
    })
  }

  render () {
    const { activePlace } = this.props

    if ( !activePlace ) return null

    const { pricePoint, rating, vicinity } = activePlace

    const latLng = {
      lat: activePlace.lat,
      lng: activePlace.lng,
    }

    const distance = getFriendlyDistance( latLng, this.props.currentLocation )
    const dollarSigns = '$$$$'.substr( 0, pricePoint )

    return (
      <div className='place-detail'>
        <p className='label back' onClick={this.props.toggleDetailView}>{'< Back'}</p>

        <div className='place-info'>
          <div className='icon'></div>
          <h2>{activePlace.name}</h2>
          <p className='price-point'>{dollarSigns}</p>
          <p className='label'>{vicinity} ({distance})</p>
          <div className='ratings'>
            <div className='rating'>
              <p className='label'>Yelp</p>
              <h4>{this.state.yelpRating}</h4>
            </div>
            <div className='rating'>
              <p className='label'>Google</p>
              <h4>{rating.toFixed( 1 )}</h4>
            </div>
          </div>
          <hr />
          <p className='label'>{activePlace.followerInfo || 'You like this'}</p>
        </div>
      </div>
    )
  }
}

export default PlaceDetail
