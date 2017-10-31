import React from 'react'

class Carousel extends React.Component {
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
    return this.renderCarousel()
  }
}

export default Carousel
