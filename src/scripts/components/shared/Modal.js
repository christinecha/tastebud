import React from 'react'

class Modal extends React.Component {
  componentDidMount() {
  }

  componentWillUnmount() {
  }

  renderChildren() {
    const { children } = this.props

    return React.Children.map( children, ( child ) => {
      return React.cloneElement( child, { close: this.close.bind( this ), open: this.open.bind( this ) })
    })
  }

  render () {
    return (
      <div className='modal-wrapper' data-is-active={this.props.isActive}>
        <div className='modal' data-modal-name={this.props.name}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Modal
