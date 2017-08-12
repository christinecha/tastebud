import React from 'react'
import axios from 'axios'
import GoogleMaps from 'google-maps'

import { getLocation } from '../db/location'
import { getUser } from '../db/user'


class MapView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      locations: []
    }
  }

  componentDidMount() {
    this.generateMap()
    this.getLocations()
  }

  getLocations() {
    const { currentUser } = this.props

    if (!currentUser) return

    currentUser.following.forEach(userId => {
      console.log(userId)
      getUser(userId).then(userSnapshot => {
        const user = userSnapshot.val()

        user.recommendations.forEach(rec => {
          getLocation(rec).then(snapshot => {
            let locations = this.state.locations
            const location = snapshot.val()
            locations.push(location)
            this.renderLocationMarker(location)
            this.setState({ locations: locations })
          })
        })
      })
    })
  }

  renderLocationMarker(location) {
    console.log(location)
    if (!this.map) return

    const marker = new google.maps.Marker({
       position: {
         lat: location.lat,
         lng: location.lng
       },
       title: location.name
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
      <main id='map-view'>
        <h1>map</h1>
        <div id='google-maps' ref={$map => this.$map = $map}></div>
      </main>
    )
  }
}

export default MapView
