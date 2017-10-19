import React from 'react'
import uniq from 'lodash/uniq'

import { getPlacesWithFollowerInfo, getPlaceIdsFromUsers } from '../../db/place'
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
    })
  }

  componentWillUnmount () {
    this.isUnmounting = true
  }

  componentDidUpdate( prevProps, props ) {
    const prevLat = prevProps.mapCenter.lat
    const prevLng = prevProps.mapCenter.lng

    if (
      prevLat === this.props.mapCenter.lat &&
      prevLng === this.props.mapCenter.lng
    ) {
      return
    }

    this.centerMapAt( this.props.mapCenter )
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
    const markers = this.state.places.map(( place ) => {
      // Safety net for dead data
      if ( !place ) return

      let placeMarkerImg = placeMarkers.friends

      const { currentUser } = this.props
      if ( currentUser && currentUser.places.indexOf( place.id ) > -1 ) {
        placeMarkerImg = placeMarkers.yours
      }

      const largeIconImg = Object.assign({}, placeMarkerImg, {
        scaledSize: new google.maps.Size( 40, 60 ),
      })

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
        const { activePlaceIndex, markers } = this.state

        if ( activePlaceIndex !== null ) {
          const activeMarker = markers[ activePlaceIndex ]
          activeMarker.ref.setIcon( activeMarker.originalIcon )
        }

        this.centerMapAt( marker.getPosition())
        marker.setIcon( largeIconImg )
        this.props.updateActivePlace( place )
      })

      return {
        place,
        ref: marker,
        originalIcon: placeMarkerImg,
      }
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
