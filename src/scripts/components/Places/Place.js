import React from 'react'
import axios from 'axios'
import { addUserToPlace, removeUserFromPlace, newPlace, getPlace, updatePlace } from '../../db/place'
import { removePlaceFromUser } from '../../db/user'
import { linkUserAndPlace } from '../../db/shared'
import savePlaceFromGoogle from './lib/savePlaceFromGoogle'

class Place extends React.Component {
  constructor ( props ) {
    super( props )

    this.state = {
      deleted: false,
    }

    this.handleClickPlace = this.handleClickPlace.bind( this )
    this.handleClickDelete = this.handleClickDelete.bind( this )
    this.handleClickSave = this.handleClickSave.bind( this )
  }

  componentWillUnmount() {
    this.isUnmounting = true
  }

  isAlreadySaved () {
    const { currentUser, place } = this.props
    if ( !currentUser || !currentUser.places ) return
    return currentUser.places.indexOf( place.id ) > -1
  }

  // Async
  updateAddedPlaceAndUser () {
    const { currentUser, place } = this.props
    linkUserAndPlace( currentUser.uid, place.id )
  }

  handleClickSave ( e ) {
    e.stopPropagation()

    this.savePlaceToDB()
    .then(() => {
      this.updateAddedPlaceAndUser()
      this.setState({ deleted: false })
    })
  }

  savePlaceToDB() {
    const { place } = this.props
    return savePlaceFromGoogle( place.id )
  }

  handleClickDelete ( e ) {
    e.stopPropagation()

    const { currentUser, place } = this.props
    if ( !currentUser ) return

    this.setState({ deleted: true })

    removeUserFromPlace( place.id, currentUser.uid )
    removePlaceFromUser( currentUser, place.id )
  }

  handleClickPlace() {
    this.savePlaceToDB()
    this.props.onClick()
  }

  renderButton () {
    if ( this.isAlreadySaved() && !this.state.deleted ) {
      return <div className='delete' onClick={this.handleClickDelete}></div>
    }

    return <button className='save' onClick={this.handleClickSave}>+ Save</button>
  }

  render () {
    const { place } = this.props

    return (
      <div className='place' onClick={this.handleClickPlace}>
        <div className='info'>
          {place.id}
          <div className='icon'></div>
          <h3 className='name'>{place.name}</h3>
          <p className='vicinity label'>{place.vicinity}</p>
          <div className='follower-info label'>
            <p>{place.followerInfo}</p>
          </div>
        </div>
        {this.renderButton()}
      </div>
    )
  }
}

export default Place
