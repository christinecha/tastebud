import React from 'react'
import GoogleMaps from 'google-maps'

import locationSchema from '../schema/locationSchema'
import { newLocation } from '../db/location'
import { updateUser } from '../db/user'

class SaveLocationView extends React.Component {
  constructor(props) {
    super(props)

    this.handleInputChange = this.handleInputChange.bind(this)

    this.state = Object.assign({}, locationSchema)
    this.state.searchQuery = ''
  }

  componentDidMount() {
  }

  getSearchResults() {
    const request = {
      query: this.state.searchQuery,
      location: { lat: 40.725493, lng: -74.004167 },
      type: [ 'restaurant' ]
    }
console.log('getting')
    const service = new google.maps.places.PlacesService(this.$locations)
    service.textSearch(request, (places, status) => {
      console.log(places, 'pl')
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

      newLocation(placeData).then((placeId) => {
        let newRecommendations = this.props.currentUser.recommendations || []
        newRecommendations.push(placeId)
        console.log('new', newRecommendations)
        updateUser(this.props.currentUser.uid, { recommendations: newRecommendations }).then(() => {
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
        <div className='locations' ref={$l => this.$locations = $l}></div>
        <input name='searchQuery' type='text' value={searchQuery} onChange={this.handleInputChange}/>
        <button onClick={() => this.handleSubmit()}>Submit Changes</button>
      </div>
    )
  }
}

export default SaveLocationView
