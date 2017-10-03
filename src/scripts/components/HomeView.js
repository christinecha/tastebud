
import React from 'react'
import { Link } from 'react-router-dom'
import { signInWithFacebook } from '../db/auth'

class HomeView extends React.Component {
  constructor( props ) {
    super( props )

    this.state = {
      carouselIndex: 0,
    }
  }

  componentDidMount() {
    this.$slides = this.$carousel.children
    this.numOfSlides = this.$slides.length

    this.carouselInterval = setInterval(() => {
      this.nextSlide()
    }, 3000 )
  }

  componentWillUnmount() {
    clearInterval( this.carouselInterval )
  }

  nextSlide() {
    const carouselIndex = ( this.state.carouselIndex + 1 ) % this.numOfSlides
    this.setState({ carouselIndex })
  }

  renderCarousel() {
    const slides = [
      '',
      '',
      '',
      '',
    ]

    const $slides = slides.map(( slide, i ) => {
      const isActive = this.state.carouselIndex === i
      return (
        <div className={`slide ${ isActive ? 'is-active' : '' }`} key={i}></div>
      )
    })

    const $indicators = slides.map(( slide, i ) => {
      const isActive = this.state.carouselIndex === i
      return (
        <div className={`indicator ${ isActive ? 'is-active' : '' }`} key={i}></div>
      )
    })

    return (
      <div
        className='onboarding-carousel'
        ref={( $c ) => this.$carousel = $c}
      >
        <div className='slides-wrapper'>
          {$slides}
        </div>
        <div className='indicators-wrapper'>
          {$indicators}
        </div>
      </div>
    )
  }

  render () {
    return (
      <main id='home-view' className='view'>
        <div className='view-content'>
          <h1>tastemark</h1>
          <h3>The best way to save the best places.</h3>
          {this.renderCarousel()}
          <button
            className='button facebook full-width'
            onClick={signInWithFacebook}
          >
            Sign up with Facebook
          </button>
          <Link to='/signup'>
            <button className='button full-width knockout'>
              Sign up with Email
            </button>
          </Link>

          <div className='log-in-prompt small'>
            Already have an account?
            <Link to='/login' className='log-in'>Log In</Link>
          </div>
        </div>
      </main>
    )
  }
}

export default HomeView
