import React from 'react'
import Place from './Place'

class PlaceList extends React.Component {
  renderPlaces () {
    return this.props.places.map(( place ) => {
      if ( !place ) return null

      return <Place key={place.id} place={place} {...this.props} />
    })
  }

  render () {
    return (
      <div className='place-list'>
        {this.renderPlaces()}
      </div>
    )
  }
}

export default PlaceList
