import React from 'react'

import { followUser, getUser, saveUser } from '../../db/user'
import { getPlace } from '../../db/place'
import PlaceList from '../PlaceList'
import { Instructions } from './static'

class SearchView extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)

    this.state = {
      searchQuery: '',
      results: []
    }
  }

  componentDidMount() {
    this.service = new google.maps.places.PlacesService(this.$results)
    this.lastSearch = performance.now()
  }

  componentWillUnmount() {
    this.isUnmounting = true
  }

  getSearchResults() {
    const now = performance.now()

    if (now - this.lastSearch < 300) {
      setTimeout(() => {
        this.getSearchResults()
      }, 300)

      return
    }

    const request = {
      keyword: this.state.searchQuery,
      location: this.props.currentLocation,
      rankBy: google.maps.places.RankBy.DISTANCE,
      type: [ 'restaurant' ]
    }

    this.lastSearch = now

    this.service.nearbySearch(request, (places, status) => {
      if (this.isUnmounting) return
      if (status !== google.maps.places.PlacesServiceStatus.OK) return

      const firstTenPlaces = places.length > 10 ? places.slice(0, 10) : places
      this.setState({ results: firstTenPlaces })
    })
  }

  handleChange(e) {
    this.setState({ searchQuery: e.target.value })
    this.getSearchResults()
  }

  renderResults() {
    if (this.state.results.length < 1) {
      return <Instructions />
    }

    return (
      <PlaceList
        places={this.state.results}
        {...this.props}
      />
    )
  }

  render() {
    const hasResults = this.state.results.length > 0 ? 'has-results': ''

    return (
      <main id='search-view' className='view'>
        <input
          ref={$input => this.$input = $input}
          type='text'
          className='search-input'
          placeholder='Search for Places'
          onChange={this.handleChange}
          value={this.state.searchQuery}
        />
        <div ref={$results => this.$results = $results}></div>
        <div className={'search-results ' + hasResults}>
          {this.renderResults()}
        </div>
      </main>
    )
  }
}

export default SearchView
