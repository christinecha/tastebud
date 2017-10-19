import React from 'react'

class PlaceSearch extends React.Component {
  constructor( props ) {
    super( props )

    this.handleChangePlace = this.handleChangePlace.bind( this )
    this.resetMap = this.resetMap.bind( this )

    this.state = {
      query: '',
    }
  }

  componentDidMount () {
    this.autocomplete = new google.maps.places.Autocomplete( this.$input )
    this.lastSearch = performance.now()

    this.autocomplete.addListener( 'place_changed', this.handleChangePlace )
  }

  componentWillUnmount () {
    this.isUnmounting = true
  }

  handleChangePlace( ) {
    const place = this.autocomplete.getPlace()

    if ( !place.geometry ) {
      console.error( `No details available for input: ${ place.name }` )
      return
    }

    const newLocation = place.geometry.location.toJSON()

    this.props.updateMapCenter( newLocation )
  }

  resetMap() {
    this.props.updateMapCenter( this.props.currentLocation )
  }

  render () {
    const { activePlace } = this.props

    return (
      <div className='location-search'>
        <div className='input-wrapper'>
          <input
            ref={( $input ) => this.$input = $input}
            type='text'
            placeholder=' Your Location'
          />
          <div className='use-current-location' onClick={this.resetMap}>
            <div className='icon'></div>
          </div>
        </div>
        <div className='more'>&bull; &bull; &bull;</div>
      </div>
    )
  }
}

export default PlaceSearch
