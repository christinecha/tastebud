import React from 'react'
import axios from 'axios'
import GoogleMaps from 'google-maps'
import 'js-marker-clusterer'

import { getPlaces, getPlaceIdsFromUsers } from '../db/place'
import { getUser } from '../db/user'
import { getFollowerInfo } from '../lib/getFollowerInfo'

import mapStyle from '../constants/map-style'


class MapView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      places: [],
      followerInfo: [],
      activePlaceIndex: null,
      markers: []
    }
  }

  componentDidMount() {
    this.generateMap()
    this.renderMap()
    this.renderCurrentLocationMarker()
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

        const promises = places.map(place => getFollowerInfo(place, currentUser))

        Promise.all(promises)
        .then(messages => {
          if (this.isUnmounting) return

          this.setState({ followerInfo: messages })
        })

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

    const markers = this.state.places.map((place, i) => {
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
       marker.addListener('click', () => {
         this.map.setCenter(marker.getPosition())
         this.setState({ activePlaceIndex: i })
       })

       return marker
    })

    this.setState({ markers })
  }

  renderCurrentLocationMarker() {
    if (!this.map) return

    const markerImage = {
      url: '/assets/images/marker-blue.svg',
      scaledSize : new google.maps.Size(22, 32),
    }

    const marker = new google.maps.Marker({
      position: this.props.currentLocation,
      icon: markerImage,
      label: ' ',
      optimized: false,
      zIndex: 1000
    })

     marker.setMap(this.map)
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

  getDistance(point1, point2 = this.props.currentLocation) {
    const latLng1 = new google.maps.LatLng(point1.lat, point1.lng)
    const latLng2 = new google.maps.LatLng(point2.lat, point2.lng)
    const meters = google.maps.geometry.spherical.computeDistanceBetween(latLng1, latLng2)

    const feet = meters * 3.28084
    const miles = feet * 0.000189394

    if (feet > 800) return `${miles.toFixed(1)} mi`

    return `${Math.round(feet)} ft`
  }

  renderPlacePreview() {
    if (this.state.activePlaceIndex === null) return null

    const activePlace = this.state.places[this.state.activePlaceIndex]
    if (!activePlace) return null

    const latLng = {
      lat: activePlace.lat,
      lng: activePlace.lng
    }

    return (
      <div className='place-preview'>
        <div className='place-preview-content'>
          <h3>{activePlace.name}</h3>
          <p className='label'>{this.getDistance(latLng)}</p>
          <hr />
          <p className='label'>{this.state.followerInfo[this.state.activePlaceIndex]}</p>
        </div>
      </div>
    )
  }

  render() {
    return (
      <main id='map-view' className='view'>
        <div id='google-maps' ref={$map => this.$map = $map}></div>
        {this.renderPlacePreview()}
      </main>
    )
  }
}

export default MapView
