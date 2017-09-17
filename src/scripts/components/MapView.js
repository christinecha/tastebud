import React from 'react'
import axios from 'axios'
import GoogleMaps from 'google-maps'
import 'js-marker-clusterer'

import { getPlaces, getPlaceIdsFromUsers } from '../db/place'
import { getUser } from '../db/user'

import mapStyle from '../constants/map-style'


class MapView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      places: [],
      markers: []
    }
  }

  componentDidMount() {
    this.generateMap()
    this.renderMap()
  }

  componentWillUnmount() {
    this.isUnmounting = true
  }

  renderMap() {
    const { currentUser } = this.props
    if (!currentUser) return
    const usersToShow = [currentUser.uid].concat(currentUser.following)

    getPlaceIdsFromUsers(usersToShow)
    .then(_placeIds => {
      const placeIds = [].concat.apply([], _placeIds);

      getPlaces(placeIds).then(places => {
        if (this.isUnmounting) return

        this.setState({ places: places })

        this.renderPlaceMarkers()
        this.renderMarkerClusterer()
      })
    })
  }

  renderMarkerClusterer() {
    if (!this.map) return

    const markerCluster = new MarkerClusterer(
      this.map,
      this.state.markers,
      {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
      }
    )
  }

  renderPlaceMarkers(location) {
    if (!this.map) return

    const markerImage = {
      url: '/assets/images/marker-black.svg',
      scaledSize : new google.maps.Size(22, 32),
    }

    const markers = this.state.places.map(place => {
      if (!place) return

      const marker = new google.maps.Marker({
         position: {
           lat: place.lat,
           lng: place.lng
         },
         icon: markerImage,
         label: ' '
       })

       marker.setMap(this.map)

       return marker
    })

    this.setState({ markers })
  }

  generateMap() {
    if (!this.$map) return

    const latLng = this.props.currentLocation

    this.map = new google.maps.Map(
      this.$map,
      {
        center: latLng,
        scrollwheel: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullScreenControl: false,
        styles: mapStyle,
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
