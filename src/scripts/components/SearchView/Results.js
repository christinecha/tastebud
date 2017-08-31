import React from 'react'
import locationSchema from '../../schema/locationSchema'
import { addUserToPlace, newPlace } from '../../db/place'
import { updateUser } from '../../db/user'

class Results extends React.Component {
  constructor(props) {
    super(props)
  }

  handleClick(place) {
    const placeData = {
      name: place.name,
      id: place.place_id,
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

      if (newPlaces.indexOf(placeId) > -1) return

      newPlaces.push(placeId)

      updateUser(
        this.props.currentUser.uid,
        { places: newPlaces }
      )
      .then(() => {
        this.props.history.push(`/users/${this.props.currentUser.uid}`)
      })
    })
  }

  isAlreadySaved(place) {
    if (!this.props.currentUser.places) return
    return this.props.currentUser.places.indexOf(place.place_id) > -1
  }

  renderButton(result) {
    if (this.isAlreadySaved(result)) {
      return <button className='edit knockout' onClick={() => {}}>Edit</button>
    }

    return <button className='save' onClick={() => this.handleClick(result)}>+ Save</button>
  }

  renderResults() {
    return this.props.results.map((result, i) => {
      return (
        <div className='result' key={i}>
          <h3>{result.name}</h3>
          {this.renderButton(result)}
        </div>
      )
    })
  }

  render() {
    return (
      <div className='search-results'>
        {this.renderResults()}
      </div>
    )
  }
}

export default Results
