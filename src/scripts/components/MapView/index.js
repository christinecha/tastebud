import React from 'react'
import axios from 'axios'
import { uniq } from 'lodash'
import 'js-marker-clusterer'

import PlacePreview from './PlacePreview'

import { getPlacesWithFollowerInfo, getPlaceIdsFromUsers } from '../../db/place'
import { getUser } from '../../db/user'

import { placeMarkers, currentLocationImage } from '../../constants/map-markers'
import mapConfig from '../../constants/map-config'

const MarkerClusterer = window.MarkerClusterer

class MapView extends React.Component {
  constructor ( props ) {
    super( props )

    this.state = {
      places: [],
      activePlaceIndex: null,
      markers: [],
    }
  }

  componentDidMount () {
    this.generateMap()
    this.renderMap()
    this.renderCurrentLocationMarker()

    this.$map.addEventListener( 'click', ( e ) => {
      if ( e.target.tagName === 'IMG' ) return
      this.setState({ activePlaceIndex: null })
    })
  }

  componentWillUnmount () {
    this.isUnmounting = true
  }

  renderMap () {
    const { currentUser } = this.props
    if ( !currentUser ) return
    const usersToShow = [ currentUser.uid ].concat( currentUser.following || [])

    getPlaceIdsFromUsers( usersToShow )
    .then(( _placeIds ) => {
      const placeIds = uniq([].concat.apply([], _placeIds ))

      getPlacesWithFollowerInfo( placeIds, currentUser )
      .then(( places ) => {
        this.updatePlaceData( places )
      })
    })
  }

  updatePlaceData ( places ) {
    if ( this.isUnmounting ) return

    this.setState({ places: places })
    this.renderPlaceMarkers()
    // this.renderMarkerClusterer()
  }

  renderMarkerClusterer () {
    const options = {
      styles: [
        {
          textColor: 'white',
          url: '/assets/images/marker-black.svg',
          height: 40,
          width: 40,
        },
      ],
    }

    this.markerClusterer = new MarkerClusterer(
      this.map,
      this.state.markers,
      options
    )
  }

  renderPlaceMarkers () {
    const markers = this.state.places.map(( place, i ) => {
      // Safety net for dead data
      if ( !place ) return

      let placeMarkerImg = placeMarkers.friends

      const { currentUser } = this.props
      if ( currentUser && currentUser.places.indexOf( place.id ) > -1 ) {
        placeMarkerImg = placeMarkers.yours
      }

      const marker = new google.maps.Marker({
        position: {
          lat: place.lat,
          lng: place.lng,
        },
        icon: placeMarkerImg,
        label: ' ',
      })

      marker.setMap( this.map )
      marker.addListener( 'click', () => {
        this.map.panTo( marker.getPosition())
        this.setState({ activePlaceIndex: i })
      })

      return marker
    })

    this.setState({ markers })
  }

  renderCurrentLocationMarker () {
    const marker = new google.maps.Marker({
      position: this.props.currentLocation,
      icon: currentLocationImage,
      label: ' ',
      optimized: false,
    })

    marker.setMap( this.map )
  }

  generateMap () {
    const center = this.props.currentLocation
    const _mapConfig = Object.assign({}, mapConfig, { center })

    this.map = new google.maps.Map( this.$map, _mapConfig )
  }

  renderPlacePreview () {
    const { activePlaceIndex, places } = this.state
    if ( activePlaceIndex === null ) return null

    return (
      <PlacePreview
        activePlace={places[ activePlaceIndex ]}
        currentLocation={this.props.currentLocation}
      />
    )
  }

  renderMapTools() {
    return (
      <div className='map-tools'>
        <div className='input-wrapper'>
          <input type='text' placeholder='New York, NY'/>
          <div className='more'>&bull; &bull; &bull;</div>
        </div>
        <div className='reference'>
          <div className='type label yours'>
            <div className='icon'></div>
            Yours
          </div>
          <div className='type label friends'>
            <div className='icon'></div>
            Friends
          </div>
          <div className='type label popular'>
            <div className='icon'></div>
            Popular
          </div>
        </div>
      </div>
    )
  }

  render () {
    return (
      <main id='map-view' className='view'>
        {this.renderMapTools()}
        <div id='google-maps' ref={( $map ) => this.$map = $map}></div>
        {this.renderPlacePreview()}
      </main>
    )
  }
}

export default MapView
