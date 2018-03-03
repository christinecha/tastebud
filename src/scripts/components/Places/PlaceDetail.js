import React from 'react'
import axios from 'axios'
import getFriendlyDistance from '../../lib/getFriendlyDistance'
import getInstagramData from './lib/getInstagramData'
import getYelpData from './lib/getYelpData'
import { updatePlace, unwatchPlace, watchPlace } from '../../db/place'

import Carousel from '../shared/Carousel'
import Modal from '../shared/Modal'

class PlaceDetail extends React.Component {
  constructor( props ) {
    super( props )

    this.watchPlace = this.watchPlace.bind( this )

    this.state = {
      place: {},
      yelpRating: null,
      instagramUsername: null,
      instagramImages: [],
      activeModalId: null,
    }
  }

  componentDidMount() {
    const { place } = this.props
    watchPlace( place.id, this.watchPlace )
    this.watchPlace()
  }

  componentWillUnmount() {
    const { place } = this.props
    unwatchPlace( place.id, this.watchPlace )
  }

  watchPlace( snapshot ) {
    if ( !snapshot ) return
    const place = snapshot.val()

    if ( !place ) return

    this.setState({ place }, () => {
      console.log( place )
      if ( place.name && place.lat && place.lng ) {
        this.setYelpRating()
        this.setInstagram()
      }
    })
  }

  setInstagram() {
    const { place } = this.state

    getInstagramData( place )
    .then(({ instagramPlaceUrl, instagramImages }) => {
      const { place } = this.props
      updatePlace( place.id, { instagramPlaceUrl })
      this.setState({ instagramPlaceUrl, instagramImages })
    })
  }

  setYelpRating() {
    const { place } = this.state

    getYelpData( place )
    .then(( yelpData ) => {
      this.setState( yelpData )
      updatePlace( place.id, yelpData )
    })
  }

  setActiveModal( activeModalId = null ) {
    this.setState({ activeModalId })
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

  suggestInstagram() {
    const instagramImages = []
    this.setState({ instagramImages })
    this.updateInstagramUsername( this.$instaSuggestion.value )
    this.setActiveModal()
  }

  renderInstagramFeed() {
    const MODAL_ID = 0
    let images = this.state.instagramImages.map(( src, i ) => {
      return <div className='instagram-image' style={{ backgroundImage: `url(${ src })` }} key={i}></div>
    })

    return (
      <div className='instagram-feed-wrapper'>
        <Carousel name='instagram-feed' numOfSlides={images.length}>{images}</Carousel>
        <p className='label' onClick={() => this.setActiveModal( MODAL_ID )}>Not the right Instagram account?</p>
        <Modal name='instagram-correction' isActive={this.state.activeModalId === MODAL_ID}>
          <div className='exit' onClick={this.setActiveModal.bind( this )}>✕</div>
          <p className='label'>Suggest a different Instagram&nbsp;username:</p>
          <input ref={( $s ) => { this.$instaSuggestion = $s }}type='text' />
          <button onClick={this.suggestInstagram.bind( this )}>Confirm</button>
        </Modal>
      </div>
    )
  }

  render () {
    const { place } = this.props

    if ( !place ) return null

    const { pricePoint, rating, vicinity } = place
    const { yelpRating } = this.state

    const latLng = {
      lat: place.lat,
      lng: place.lng,
    }

    const distance = getFriendlyDistance( latLng, this.props.currentLocation )
    const dollarSigns = '$$$$'.substr( 0, pricePoint )

    return (
      <div className='place-detail'>
        <p className='label back' onClick={this.props.toggleDetailView}>{'< Back'}</p>

        <div className='place-info'>
          <div className='icon'></div>
          <h2>{place.name}</h2>
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
          <p className='label'>{place.followerInfo || 'You like this'}</p>
          <hr />
        </div>

        {this.renderInstagramFeed()}
      </div>
    )
  }
}

export default PlaceDetail
