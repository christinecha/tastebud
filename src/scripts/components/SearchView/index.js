import React from 'react'
import GoogleMaps from 'google-maps'
import { followUser, getUser, saveUser } from '../../db/user'
import { getPlace } from '../../db/place'
import Results from './Results'
import { Instructions } from './static'

const PLACES_AUTOCOMPLETE_API = 'https://maps.googleapis.com/maps/api/place/autocomplete/xml?input=Amoeba&types=establishment&location=37.76999,-122.44696&radius=500&key=YOUR_API_KEY'

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

    if (now - this.lastSearch < 500) {
      setTimeout(() => {
        this.getSearchResults()
      }, 500)

      return
    }

    const request = {
      query: this.state.searchQuery,
      location: { lat: 40.725493, lng: -74.004167 },
      type: [ 'restaurant' ]
    }

    this.lastSearch = now

    this.service.textSearch(request, (places, status) => {
      if (this.isUnmounting) return
      if (status !== google.maps.places.PlacesServiceStatus.OK) return

      this.setState({ results: places })
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

    return <Results results={this.state.results} {...this.props} />
  }

  render() {
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
        {this.renderResults()}
      </main>
    )
  }
}

export default SearchView
