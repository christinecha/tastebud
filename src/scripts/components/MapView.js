import React from 'react'
import axios from 'axios'
import GoogleMaps from 'google-maps'

import { getPlace } from '../db/place'
import { getUser } from '../db/user'


class MapView extends React.Component {
  constructor(props) {
    super(props)

    this.addPlace = this.addPlace.bind(this)

    this.state = {
      places: []
    }
  }

  componentDidMount() {
    this.generateMap()
    this.getPlaces()
  }

  componentWillUnmount() {
    this.isUnmounting = true
  }

  getPlaces() {
    const { currentUser } = this.props
    if (!currentUser) return

    currentUser.places.forEach(this.addPlace)

    if (!currentUser.following) return
    currentUser.following.forEach(userId => {
      getUser(userId).then(userSnapshot => {
        const user = userSnapshot.val()
        if (!user.places) return

        user.places.forEach(this.addPlace)
      })
    })
  }

  addPlace(place) {
    getPlace(place).then(snapshot => {
      let places = this.state.places
      const location = snapshot.val()
      if (!location) return

      places.push(location)
      this.renderPlaceMarker(location)

      if (this.isUnmounting) return

      this.setState({ places: places })
    })
  }

  renderPlaceMarker(location) {
    if (!this.map) return

    const marker = new google.maps.Marker({
       position: {
         lat: location.lat,
         lng: location.lng
       },
       title: location.name,
       label: location.name
     })

     marker.setMap(this.map)
  }

  generateMap() {
    if (!this.$map) return

    this.map = new google.maps.Map(
      this.$map,
      {
        center: {lat: 40.725493, lng: -74.004167},
        scrollwheel: false,
        zoom: 12
      }
    )
  }

  render() {
    return (
      <main id='map-view' className='view'>
        <div id='google-maps' ref={$map => this.$map = $map}></div>
      </main>
    )
  }
}

export default MapView
