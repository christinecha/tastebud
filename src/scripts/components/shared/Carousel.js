import React from 'react'

class Carousel extends React.Component {
  constructor( props ) {
    super( props )

    this.start = this.start.bind( this )
    this.stop = this.stop.bind( this )

    this.state = {
      index: 0,
    }
  }

  start() {
    this.stop()
    this.carouselInterval = setInterval(() => {
      this.nextSlide()
    }, 3000 )
  }

  stop() {
    clearInterval( this.carouselInterval )
  }

  componentDidMount() {
    this.start()
    window.addEventListener( 'focus', this.start )
    window.addEventListener( 'blur', this.stop )
  }

  componentWillUnmount() {
    this.stop()
    window.removeEventListener( 'focus', this.start )
    window.removeEventListener( 'blur', this.stop )
  }

  nextSlide() {
    const index = ( this.state.index + 1 ) % this.props.numOfSlides
    this.setState({ index })
  }

  renderCarousel() {
    const { index } = this.state

    const $slides = this.props.children.map(( child, i ) => {
      const distFromIndex = Math.abs( index - i )
      const distFromEnd = this.props.numOfSlides - distFromIndex
      const arrivalIndex   = i >= index ? distFromIndex : distFromEnd
      const departureIndex = i <= index ? distFromIndex : distFromEnd

      return (
        <div
          key={i}
          className='slide'
          data-arrival-index={arrivalIndex}
          data-departure-index={departureIndex}
        >
          {child}
        </div>
      )
    })

    const $indicators = this.props.children.map(( slide, i ) => {
      const isActive = this.state.index === i
      return (
        <div className={`indicator ${ isActive ? 'is-active' : '' }`} key={i}></div>
      )
    })

    return (
      <div
        className={`carousel ${ this.props.name }`}
        ref={( $c ) => this.$carousel = $c}
      >
        <div className='slides-wrapper' ref={( $c ) => this.$slidesWrapper = $c}>
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
