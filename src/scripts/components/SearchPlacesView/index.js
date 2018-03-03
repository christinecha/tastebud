import React from 'react'
import axios from 'axios'

import PlaceList from '../Places/PlaceList'
import getUrlParams from '../../lib/getUrlParams'

class SearchPlacesView extends React.Component {
  constructor ( props ) {
    super( props )

    this.handleChange = this.handleChange.bind( this )
    this.getSearchResults = this.getSearchResults.bind( this )

    this.state = {
      searchQuery: '',
      places: [],
    }
  }

  componentDidMount () {
    this.service = new google.maps.places.PlacesService( this.$results )
    this.lastSearch = performance.now()

    if ( getUrlParams().focus === 'true' ) {
      this.$input.focus()
    }
  }

  componentWillUnmount () {
    this.isUnmounting = true
  }

  getSearchResults () {
    if ( this.hasEmptyQuery()) {
      clearTimeout( this.searchTimeout )
      this.setState({
        places: [],
      })
      return
    }

    const now = performance.now()

    if ( now - this.lastSearch < 300 ) {
      clearTimeout( this.searchTimeout )
      this.searchTimeout = setTimeout(() => {
        this.getSearchResults()
      }, 300 )

      return
    }

    this.lastSearch = now
    this.searchPlaces()
  }

  searchPlaces () {
    const request = {
      keyword: this.state.searchQuery,
      location: this.props.currentLocation,
      rankBy: google.maps.places.RankBy.DISTANCE,
      type: [ 'restaurant' ],
    }

    this.service.nearbySearch( request, ( places, status ) => {
      if ( this.isUnmounting ) return
      if ( status !== google.maps.places.PlacesServiceStatus.OK ) return

      // If this is not the most recent query, quit.
      if ( request.keyword !== this.state.searchQuery ) return

      let firstTenPlaces = places.length > 10 ? places.slice( 0, 10 ) : places
      firstTenPlaces = firstTenPlaces.map(( place ) => {
        place.id = place.place_id
        return place
      })

      this.setState({ places: firstTenPlaces })
    })
  }

  hasEmptyQuery () {
    return !this.state.searchQuery || this.state.searchQuery.trim() === ''
  }

  handleChange ( e ) {
    this.setState(
      { searchQuery: e.target.value },
      this.getSearchResults
    )
  }

  renderResults () {
    if ( this.state.places.length < 1 ) {
      return (
        <div className='instructions'>
          <p>To find a place, just search <br /> for it by name.</p>
        </div>
      )
    }

    return <PlaceList places={this.state.places} {...this.props} />
  }

  render () {
    const hasResults = this.state.places.length > 0 ? 'has-results' : ''

    return (
      <main id='search-view' className='view'>
        <input
          ref={( $input ) => this.$input = $input}
          type='text'
          className='search-input'
          placeholder={'Search for restaurants & bars'}
          onChange={this.handleChange}
          value={this.state.searchQuery}
        />
        <div ref={( $results ) => this.$results = $results}></div>
        <div className={'search-results ' + hasResults}>
          {this.renderResults()}
        </div>
      </main>
    )
  }
}

export default SearchPlacesView
