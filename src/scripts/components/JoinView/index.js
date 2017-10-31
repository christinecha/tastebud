import React from 'react'
import {
  findUserByExactUsername,
  getUser,
  saveUser,
  createUserFromFacebookRedirect
} from '../../db/user'

const regex = new RegExp( /^([a-zA-Z0-9_])*$/ )

class JoinView extends React.Component {
  constructor ( props ) {
    super( props )

    this.handleClick = this.handleClick.bind( this )
    this.handleInputChange = this.handleInputChange.bind( this )

    this.state = {
      username: '',
      isSearching: false,
      isAvailable: false,
      isAlphanumeric: false,
      isLongEnough: false,
    }
  }

  handleClick() {
    const handleSuccess = ( uid ) => {
      getUser( uid ).then(( snapshot ) => {
        const user = snapshot.val()
        this.props.updateCurrentUser( user )
      })
    }

    const handleErr = () => {
      this.props.history.push( '/' )
    }

    createUserFromFacebookRedirect(
      this.state.username,
      handleSuccess,
      handleErr
    )
  }

  handleInputChange ( e ) {
    const username = e.target.value.trim()

    this.setState({
      username,
      isSearching: true,
      isLongEnough: username.length > 3 && username.length < 17,
      isAlphanumeric: !!username.match( regex ),
    })

    findUserByExactUsername( username )
    .then(( snapshot ) => {
      // If, by this point, we have a different input value, quit.
      if ( username !== this.state.username ) return

      const user = snapshot.val()

      this.setState({
        isSearching: false,
        isAvailable: !user,
      })
    })
  }

  renderValidation() {
    const { isAvailable, isAlphanumeric, isLongEnough } = this.state

    return (
      <div className='validation'>
        <div className='check is-available'>
          <span className='icon' data-is-valid={isAvailable}></span>
          Must be available.
        </div>
        <div className='check is-alphanumeric'>
          <span className='icon' data-is-valid={isAlphanumeric}></span>
          Must be only letters, numbers, or underscores.
        </div>
        <div className='check is-long-enough'>
          <span className='icon' data-is-valid={isLongEnough}></span>
          Must be between 3 and 16 characters long.
        </div>
      </div>
    )
  }

  render () {
    const isValid = (
      this.state.isAvailable &&
      this.state.isLongEnough &&
      this.state.isAlphanumeric &&
      !this.state.isSearching
    )

    return (
      <main id='join-view' className='view'>
        <div className='view-content'>
          <h1>Create Your Account</h1>
          <div className='account-form'>
            <div className='input-wrapper'>
              <input type='text' onChange={this.handleInputChange} value={this.state.username} />
            </div>
            {this.renderValidation()}
            <button
              className='create-account'
              data-is-valid={isValid}
              onClick={this.handleClick}
            >
              Create Account
            </button>
          </div>
        </div>
      </main>
    )
  }
}

export default JoinView
