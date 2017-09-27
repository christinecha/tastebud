import React from 'react'
import axios from 'axios'
import { uniq } from 'lodash'
import 'js-marker-clusterer'

import PlacePreview from './PlacePreview'

import { getPlacesWithFollowerInfo, getPlaceIdsFromUsers } from '../../db/place'
import { getUser } from '../../db/user'

import { genericImage, currentLocationImage } from '../../constants/map-markers'
import mapConfig from '../../constants/map-config'


class MapView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      places: [],
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
    const usersToShow = [currentUser.uid].concat(currentUser.following || [])

    getPlaceIdsFromUsers(usersToShow)
    .then(_placeIds => {
      const placeIds = uniq([].concat.apply([], _placeIds))

      getPlacesWithFollowerInfo(placeIds, currentUser)
      .then(places => {
        this.updatePlaceData(places)
      })
    })
  }

  updatePlaceData(places) {
    if (this.isUnmounting) return

    this.setState({ places: places })
    this.renderPlaceMarkers()
    this.renderMarkerClusterer()
  }

  renderMarkerClusterer() {
    const markerCluster = new MarkerClusterer(
      this.map,
      this.state.markers,
      {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
      }
    )
  }

  renderPlaceMarkers() {
    const markers = this.state.places.map((place, i) => {

      // Safety net for dead data
      if (!place) return

      const marker = new google.maps.Marker({
         position: {
           lat: place.lat,
           lng: place.lng
         },
         icon: genericImage,
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
    const marker = new google.maps.Marker({
      position: this.props.currentLocation,
      icon: currentLocationImage,
      label: ' ',
      optimized: false
    })

     marker.setMap(this.map)
  }

  generateMap() {
    const center = this.props.currentLocation
    const _mapConfig = Object.assign({}, mapConfig, { center })

    this.map = new google.maps.Map(this.$map, _mapConfig)
  }

  renderPlacePreview() {
    const { activePlaceIndex, places } = this.state
    if (activePlaceIndex === null) return null

    return (
      <PlacePreview
        activePlace={places[activePlaceIndex]}
      />
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
