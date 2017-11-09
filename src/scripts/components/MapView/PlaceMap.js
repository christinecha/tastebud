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
      placesByFilter: {},
      places: [],
      markers: [],
      activePlaceIndex: null,
    }
  }

  componentDidMount () {
    this.generateMap()
    this.renderCurrentLocationMarker()
    this.renderMap()

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

    if ( !deepEqual( prevProps.filters, this.props.filters )) {
      this.renderMap()
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

    const placesByFilter = {
      yours: [],
      friends: [],
    }

    getPlaceIdsFromUsers( usersToShow )
    .then(( placeIdArrays ) => {
      // Organize places into either 'you' or 'friends'
      placeIdArrays.forEach(( array, i ) => {
        if ( i === 0 ) placesByFilter.yours = array
        else placesByFilter.friends = placesByFilter.friends.concat( array )
      })

      let allPlaces = []
      for ( let type in this.props.filters ) {
        if ( this.props.filters[ type ]) allPlaces.push( placesByFilter[ type ])
      }

      this.setState({ placesByFilter })

      const placeIds = uniq([].concat.apply([], allPlaces ))

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
    this.removeAllMarkers()

    const markers = this.state.places.map(( place, i ) => {
      // Safety net for dead data
      if ( !place ) return null

      const isYours = this.state.placesByFilter.yours.indexOf( place.id ) > -1
      const type = isYours ? 'yours' : 'friends'
      const icon = placeMarkers[ type ]

      const largeIcon = Object.assign(
        {},
        icon,
        { scaledSize: new google.maps.Size( 40, 60 ) }
      )

      const ref = new google.maps.Marker({
        position: {
          lat: place.lat,
          lng: place.lng,
        },
        icon: icon,
        label: ' ',
      })

      ref.setMap( this.map )
      ref.addListener( 'click', () => {
        this.setActiveMarker( i )
      })

      return {
        place,
        icon,
        ref,
        largeIcon,
      }
    })

    this.setState({ markers })
  }

  resetMarkers() {
    const { activePlaceIndex, markers } = this.state

    markers.forEach(( marker ) => {
      if ( !marker ) return
      marker.ref.setIcon( marker.icon )
    })

    const activeMarker = markers[ activePlaceIndex ]

    if ( !activeMarker ) return

    activeMarker.ref.setIcon( activeMarker.largeIcon )
  }

  removeMarker( marker ) {
    if ( !marker ) return
    marker.ref.setMap( null )
  }

  removeAllMarkers() {
    const { markers } = this.state
    markers.forEach(( marker ) => {
      this.removeMarker( marker )
    })

    this.setState({
      markers: [],
      activePlaceIndex: null,
    })
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
