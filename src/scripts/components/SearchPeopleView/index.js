import React from 'react'
import axios from 'axios'

import {
  findUsersByUsername,
  followUser,
  getUsers,
  saveUser
} from '../../db/user'
import getUrlParams from '../../lib/getUrlParams'
import UserList from '../UserList'

class SearchPeopleView extends React.Component {
  constructor ( props ) {
    super( props )

    this.handleChange = this.handleChange.bind( this )
    this.getSearchResults = this.getSearchResults.bind( this )

    this.state = {
      searchQuery: '',
      people: [],
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
        people: [],
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
    this.searchPeople()
  }

  searchPeople () {
    const searchRequest = {
      params: {
        searchQuery: this.state.searchQuery,
      },
    }

    axios.get( '/search-users', searchRequest )
    .then(( response ) => {
      const people = response.data
      const uids = people.map(( p ) => p.uid )

      this.setState({ people: uids })
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
    if ( this.state.people.length < 1 ) {
      return (
        <div className='instructions'>
          <p>To find a user, just search <br /> for them by name.</p>
        </div>
      )
    }

    return <UserList users={this.state.people || []} />
  }

  render () {
    const hasResults = this.state.people.length > 0 ? 'has-results' : ''

    return (
      <main id='search-view' className='view'>
        <input
          ref={( $input ) => this.$input = $input}
          type='text'
          className='search-input'
          placeholder={'Search for people'}
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

export default SearchPeopleView
