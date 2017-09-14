import React from 'react'
import { Link } from 'react-router-dom'
import { signInWithFacebook, getUserFromFacebook } from '../db/auth'

class HomeView extends React.Component {
  constructor(props) {
    super(props)

    this.signInWithFacebook = this.signInWithFacebook.bind(this)

    this.getUserFromFacebook()
  }

  getUserFromFacebook() {
    getUserFromFacebook()
  }

  signInWithFacebook() {
    signInWithFacebook()
  }

  render() {
    return (
      <main id='home-view' className='view'>
        <h1>Tastemark</h1>

        <button className='button facebook full-width' onClick={this.signInWithFacebook}>
          Continue With Facebook
        </button>

        <hr />

        <Link to='/signup'>
          <button className='button full-width knockout'>Sign Up With Email</button>
        </Link>

        <div className='log-in-prompt'>
          Already have an account?
          <Link to='/login' className='log-in'>Log In</Link>
        </div>
      </main>
    )
  }
}

export default HomeView
