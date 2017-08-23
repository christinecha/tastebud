import React from 'react'
import GoogleMaps from 'google-maps'

import locationSchema from '../schema/locationSchema'
import { addUserToPlace, newPlace } from '../db/place'
import { updateUser } from '../db/user'

class SavePlaceView extends React.Component {
  constructor(props) {
    super(props)

    this.handleInputChange = this.handleInputChange.bind(this)

    this.state = Object.assign({}, locationSchema)
    this.state.searchQuery = ''
  }

  getSearchResults() {
    const request = {
      query: this.state.searchQuery,
      location: { lat: 40.725493, lng: -74.004167 },
      type: [ 'restaurant' ]
    }

    const service = new google.maps.places.PlacesService(this.$places)
    service.textSearch(request, (places, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK) return

      const place = places[0]
      const placeData = {
        name: place.name,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        pricePoint: place.price_level || 0,
        rating: place.rating,
        types: place.types,
        vicinity: place.vicinity || ''
      }

      newPlace(placeData).then((placeId) => {
        addUserToPlace(placeId, this.props.currentUser.uid)
        let newPlaces = this.props.currentUser.places || []
        newPlaces.push(placeId)
        updateUser(this.props.currentUser.uid, { places: newPlaces }).then(() => {
          this.props.history.push(`/users/${this.props.currentUser.uid}`)
        })
      })
    })
  }

  handleInputChange(e) {
    const newState = {}
    newState[e.target.name] = e.target.value
    this.setState(newState)
  }

  handleSubmit() {
    this.getSearchResults()
  }

  render() {
    const { searchQuery } = this.state
    return (
      <div>
        <div className='places' ref={$l => this.$places = $l}></div>
        <input name='searchQuery' type='text' value={searchQuery} onChange={this.handleInputChange}/>
        <button onClick={() => this.handleSubmit()}>Submit Changes</button>
      </div>
    )
  }
}

export default SavePlaceView
