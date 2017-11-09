import React from 'react'
import axios from 'axios'
import { addUserToPlace, removeUserFromPlace, newPlace, updatePlace } from '../db/place'
import { updateUser, addPlaceToUser, removePlaceFromUser } from '../db/user'

class Place extends React.Component {
  constructor ( props ) {
    super( props )

    this.state = {
      deleted: false,
    }

    this.handleClickDelete = this.handleClickDelete.bind( this )
    this.handleClickSave = this.handleClickSave.bind( this )
  }

  componentDidMount () {
    this.service = new google.maps.places.PlacesService( this.$result )
  }

  isAlreadySaved () {
    const { currentUser, place } = this.props
    if ( !currentUser ) return
    if ( !currentUser.places ) return

    return currentUser.places.indexOf( this.getPlaceId()) > -1
  }

  getPlaceId () {
    return this.props.place.place_id || this.props.place.id
  }

  getPlaceDetails ( placeId ) {
    if ( this.isAlreadySaved()) return Promise.resolve()

    return new Promise(( resolve, reject ) => {
      this.service.getDetails(
        { placeId: this.props.place.place_id },
        ( place, status ) => {
          if ( status !== google.maps.places.PlacesServiceStatus.OK ) return
          resolve( place )
        }
      )
    })
  }

  updateAddedPlaceAndUser ( placeId ) {
    const { currentUser } = this.props
    addUserToPlace( placeId, currentUser.uid )
    return addPlaceToUser( currentUser, placeId )
  }

  handleClickSave () {
    const _place = this.props.place

    if ( !_place.place_id ) {
      this.updateAddedPlaceAndUser( _place.id )
      this.setState({ deleted: false })
      return
    }

    this.getPlaceDetails()
    .then(( place ) => {
      const placeData = {
        name: place.name,
        id: place.place_id,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        pricePoint: place.price_level || 0,
        rating: place.rating,
        types: place.types,
        vicinity: place.vicinity,
      }

      newPlace( placeData )
      .then(( placeId ) => {
        this.addYelpDataToPlace( placeData )
        this.updateAddedPlaceAndUser( placeId )
        .then(() => {
          this.props.history.push( `/users/${ this.props.currentUser.uid }` )
        })
      })
    })
  }

  addYelpDataToPlace( place ) {
    const searchRequest = {
      params: {
        term: place.name,
        latitude: place.lat,
        longitude: place.lng,
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
      updatePlace( place.id, yelpData )
    })
  }

  handleClickDelete () {
    const { currentUser, place } = this.props
    if ( !currentUser ) return

    this.setState({ deleted: true })

    removeUserFromPlace( this.getPlaceId(), currentUser.uid )
    removePlaceFromUser( currentUser, this.getPlaceId())
  }

  renderButton () {
    if ( this.isAlreadySaved() && !this.state.deleted ) {
      // return <button className='edit knockout' onClick={() => {}}>x</button>
      return <div className='delete' onClick={this.handleClickDelete}></div>
    }

    return <button className='save' onClick={this.handleClickSave}>+ Save</button>
  }

  render () {
    const { place } = this.props

    return (
      <div className='place'>
        <div className='info'>
          <div ref={( $result ) => this.$result = $result}></div>
          <div className='icon'></div>
          <h3 className='name'>{place.name}</h3>
          <p className='vicinity label'>{place.vicinity}</p>
          <div className='follower-info label'>
            <p>{place.followerInfo}</p>
          </div>
        </div>
        {this.renderButton()}
      </div>
    )
  }
}

export default Place
