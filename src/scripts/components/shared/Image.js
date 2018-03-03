import React from 'react'

class Image extends React.Component {
  constructor( props ) {
    super( props )

    this.handleLoad = this.handleLoad.bind( this )

    this.state = {
      isLoaded: false,
    }
  }

  componentWillMount() {
    this.image = document.createElement( 'IMG' )
    this.image.src = this.props.src
    this.image.addEventListener( 'load', this.handleLoad )
  }

  componentWillUnmount() {
    this.image.removeEventListener( 'load', this.handleLoad )
  }

  handleLoad() {
    this.image.removeEventListener( 'load', this.handleLoad )
    this.setState({ isLoaded: true })
  }

  render () {
    const { className, src, useBgImage } = this.props
    if ( useBgImage ) {
      return <div className={className} data-is-loaded={this.state.isLoaded} style={{ backgroundImage: `url(${ src })` }}></div>
    }

    return <img className={className} data-is-loaded={this.state.isLoaded} src={src} />
  }
}

export default Image
