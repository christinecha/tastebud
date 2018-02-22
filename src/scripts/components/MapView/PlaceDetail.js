import React from 'react'
import axios from 'axios'
import getFriendlyDistance from '../../lib/getFriendlyDistance'
import { updatePlace } from '../../db/place'

import Carousel from '../shared/Carousel'
import Modal from '../shared/Modal'

class PlaceDetail extends React.Component {
  constructor( props ) {
    super( props )

    this.state = {
      yelpRating: null,
      instagramUsername: null,
      instagramImages: [],
      activeModalId: null,
    }
  }

  componentDidMount() {
    this.setYelpRating()
    this.setInstagramUsername()
  }

  setInstagramUsername() {
    const { activePlace } = this.props

    if ( activePlace.instagramUsername ) {
      this.updateInstagramUsername( activePlace.instagramUsername )
      return
    }

    const username = `${ activePlace.name } ${ activePlace.locality || '' }`

    const request = {
      params: {
        username,
      },
    }

    axios.get( '/instagram-username', request )
    .then(( response ) => {
      if ( !response.data ) {
        request.params.username = activePlace.name

        axios.get( '/instagram-username', request )
        .then(( r ) => this.updateInstagramUsername( r.data ))
        return
      }

      this.updateInstagramUsername( response.data )
    })
  }

  updateInstagramUsername( instagramUsername ) {
    const { activePlace } = this.props

    this.setState({ instagramUsername }, () => {
      updatePlace( activePlace.id, { instagramUsername })
      this.setInstagramImages()
    })
  }

  setInstagramImages() {
    if ( !this.state.instagramUsername ) return

    const request = {
      params: {
        username: this.state.instagramUsername,
      },
    }

    axios.get( '/instagram-data', request )
    .then(( response ) => {
      const { data } = response
      console.log( data )
      const images = data.media.nodes
      const instagramImages = images.map(( image ) => image.display_src )

      this.setState({ instagramImages })
    })
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
          <p className='label'>{activePlace.followerInfo || 'You like this'}</p>
          <hr />
        </div>

        {this.renderInstagramFeed()}
      </div>
    )
  }
}

export default PlaceDetail
