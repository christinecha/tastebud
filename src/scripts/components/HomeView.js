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
      <main id='home-view'>
        <h1>Whatever</h1>

        <button className='button facebook full-width' onClick={this.signInWithFacebook}>Sign In With Facebook</button>

        <Link to='/signup'>
          <button className='button full-width knockout'>Sign Up With Email</button>
        </Link>
      </main>
    )
  }
}

export default HomeView
