import React from 'react'

import {
  findUsersByUsername,
  followUser,
  getUser,
  saveUser
} from '../../db/user'
import { getPlace } from '../../db/place'
import PlaceList from '../PlaceList'
import UserList from '../UserList'
import { Instructions } from './static'

const SEARCH_TYPES = {
  places: 0,
  people: 1
}

const SEARCH_TYPE_NAMES = Object.keys(SEARCH_TYPES)


class SearchView extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleClickSearchOption = this.handleClickSearchOption.bind(this)

    this.state = {
      searchQuery: '',
      results: [],
      searchType: SEARCH_TYPES.places
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
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.getSearchResults()
      }, 300)

      return
    }

    this.lastSearch = now
console.log('search')
    if (this.state.searchType === SEARCH_TYPES.places) {
      this.searchPlaces()
    }

    if (this.state.searchType === SEARCH_TYPES.people) {
      this.searchPeople()
    }
  }

  searchPlaces() {
    const request = {
      keyword: this.state.searchQuery,
      location: this.props.currentLocation,
      rankBy: google.maps.places.RankBy.DISTANCE,
      type: [ 'restaurant' ]
    }

    this.service.nearbySearch(request, (places, status) => {
      if (this.isUnmounting) return
      if (status !== google.maps.places.PlacesServiceStatus.OK) return

      const firstTenPlaces = places.length > 10 ? places.slice(0, 10) : places
      this.setState({ results: firstTenPlaces })
    })
  }

  searchPeople() {
    findUsersByUsername(this.state.searchQuery).then(snapshot => {
      let results = []

      snapshot.forEach((childSnapshot, i) => {
        const user = childSnapshot.val()
        results.push(user)
      })

      this.setState({ results })
    })
  }

  hasEmptyQuery() {
    return !this.$input.value || this.$input.value.trim() === ''
  }

  handleChange(e) {
    this.setState({ searchQuery: e.target.value })

    if (this.hasEmptyQuery()) {
      this.setState({ results: [] })
      return
    }

    this.getSearchResults()
  }

  handleClickSearchOption(e) {
    const type = parseInt(e.target.dataset.type)
    clearTimeout(this.searchTimeout)

    this.setState({
      searchQuery: this.$input.value,
      searchType: type,
    }, () => {
      if (this.hasEmptyQuery()) return
      this.getSearchResults()
    })
  }

  renderResults() {
    if (this.state.results.length < 1) {
      return <Instructions />
    }

    if (this.state.searchType === SEARCH_TYPES.places) {
      return <PlaceList places={this.state.results} {...this.props} />
    }

    if (this.state.searchType === SEARCH_TYPES.people) {
      return <UserList users={this.state.results || []} />
    }
  }

  renderSearchOptions() {
    const { searchType } = this.state

    const options = SEARCH_TYPE_NAMES.map((name, i) => {
      return (
        <div
          className='option label'
          key={i}
          data-active={SEARCH_TYPES[name] === searchType}
          data-type={SEARCH_TYPES[name]}
          onClick={this.handleClickSearchOption}
        >
          {name}
        </div>
      )
    })

    return (
      <div className='search-options' >
        {options}
      </div>
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
        {this.renderSearchOptions()}
        <div ref={$results => this.$results = $results}></div>
        <div className={'search-results ' + hasResults}>
          {this.renderResults()}
        </div>
      </main>
    )
  }
}

export default SearchView
