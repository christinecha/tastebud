
import React from 'react'
import { Link } from 'react-router-dom'
import { signInWithFacebook } from '../db/auth'
import Carousel from './shared/Carousel'

class HomeView extends React.Component {
  handleContinue() {
    const { history } = this.props
    history.push( '/join' )
  }

  render () {
    return (
      <main id='home-view' className='view'>
        <div className='view-content'>
          <h1>flavorite</h1>
          <h3>The best way to save the best places.</h3>
          <button
            className='button facebook full-width'
            onClick={signInWithFacebook}
          >
            Continue with Facebook
          </button>
        </div>
      </main>
    )
  }
}

export default HomeView
