import React from 'react'
import axios from 'axios'
import getFriendlyDistance from '../../lib/getFriendlyDistance'
import { updatePlace } from '../../db/place'

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

    if ( activePlace.yelpRating && activePlace.yelpCategories ) {
      this.setState({
        yelpRating: activePlace.yelpRating,
        yelpCategories: activePlace.yelpCategories,
      })
      return
    }

    const searchRequest = {
      params: {
        term: activePlace.name,
        latitude: activePlace.lat,
        longitude: activePlace.lng,
      },
    }

    axios.get( '/yelp-data', searchRequest )
    .then(( response ) => {
      const { data } = response
      const yelpCategories = data.categories.map(( category ) => category.title )
      const yelpRating = data.rating.toFixed( 1 )

      const yelpData = {
        yelpRating,
        yelpCategories,
      }
      this.setState( yelpData )
      updatePlace( activePlace.id, yelpData )
    })
  }

  renderYelpCategories() {
    const { yelpCategories } = this.state
    if ( !yelpCategories ) return

    const categories = yelpCategories.map(( category, i ) => {
      return (
        <div className='yelp-category label' key={i}>{category}</div>
      )
    })

    return (
      <div className='yelp-categories'>{categories}</div>
    )
  }

  render () {
    const { activePlace } = this.props

    if ( !activePlace ) return null

    const { pricePoint, rating, vicinity } = activePlace
    const { yelpRating } = this.state

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
          {this.renderYelpCategories()}
          <div className='ratings'>
            <div className='rating'>
              <p className='label'>Yelp</p>
              <h4>{yelpRating}</h4>
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
