import React from 'react'
import uniq from 'lodash/uniq'

import { getPlacesWithFollowerInfo, getPlaceIdsFromUsers } from '../../db/place'
import { deepEqual } from '../../lib/deep-equal'
import { placeMarkers, currentLocationImage } from '../../constants/map-markers'
import mapConfig from '../../constants/map-config'

class PlaceMap extends React.Component {
  constructor( props ) {
    super( props )

    this.state = {
      places: [],
      markers: [],
      activePlaceIndex: null,
    }
  }

  componentDidMount () {
    this.generateMap()
    this.renderMap()
    this.renderCurrentLocationMarker()

    this.$map.addEventListener( 'click', ( e ) => {
      if ( e.target.tagName === 'IMG' ) return

      this.setState({ activePlaceIndex: null })
      this.props.updateActivePlace( null )
      this.resetMarkers()
    })
  }

  componentWillUnmount () {
    this.isUnmounting = true
  }

  componentDidUpdate( prevProps ) {
    if ( !deepEqual( prevProps.mapCenter, this.props.mapCenter )) {
      this.centerMapAt( this.props.mapCenter )
    }
  }

  updatePlaceData ( places ) {
    if ( this.isUnmounting ) return

    this.setState({ places: places })
    this.renderPlaceMarkers()
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

  centerMapAt( location ) {
    this.map.panTo( location )
  }

  renderPlaceMarkers () {
    const markers = this.state.places.map(( place, i ) => {
      // Safety net for dead data
      if ( !place ) return null

      let placeMarkerImg = placeMarkers.friends

      const { currentUser } = this.props
      if ( currentUser && currentUser.places.indexOf( place.id ) > -1 ) {
        placeMarkerImg = placeMarkers.yours
      }

      const largeIconImg = Object.assign(
        {},
        placeMarkerImg,
        { scaledSize: new google.maps.Size( 40, 60 ) }
      )

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
        this.setActiveMarker( i )
      })

      return {
        place,
        ref: marker,
        originalIcon: placeMarkerImg,
        largeIcon: largeIconImg,
      }
    })

    this.setState({ markers })
  }

  resetMarkers() {
    const { activePlaceIndex, markers } = this.state

    markers.forEach(( marker ) => {
      if ( !marker ) return
      marker.ref.setIcon( marker.originalIcon )
    })

    const activeMarker = markers[ activePlaceIndex ]

    if ( !activeMarker ) return

    activeMarker.ref.setIcon( activeMarker.largeIcon )
  }

  setActiveMarker( index ) {
    const { markers } = this.state
    const activeMarker = markers[ index ]

    this.centerMapAt( activeMarker.ref.getPosition())

    this.setState({ activePlaceIndex: index })
    this.props.updateActivePlace( activeMarker.place )
    this.resetMarkers()
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
    const center = this.props.mapCenter
    const _mapConfig = Object.assign({}, mapConfig, { center })

    this.map = new google.maps.Map( this.$map, _mapConfig )
  }

  render () {
    return (
      <div id='google-maps' ref={( $map ) => this.$map = $map}></div>
    )
  }
}

export default PlaceMap
