import { getUser, saveUser } from '../../db/user'
import { VALIDATION_ERRORS } from './constants'

export const fullName = ( val ) => {
  return new Promise(( resolve, reject ) => {
    if ( val.trim().length < 1 ) return resolve( VALIDATION_ERRORS.fullName.general )
    resolve( false )
  })
}

export const email = ( val ) => {
  return new Promise(( resolve, reject ) => {
    if (
      val.split( '@' ).length !== 2 ||
      val.split( '@' )[ 1 ] === ''    ||
      val.split( '.' ).length < 2   ||
      val.split( '.' )[ 1 ] === ''
    ) {
      return resolve( VALIDATION_ERRORS.email.general )
    }

    resolve( false )
  })
}

export const username = ( val ) => {
  return new Promise(( resolve, reject ) => {
    if ( val.trim().length < 1 ) return resolve( VALIDATION_ERRORS.username.empty )

    getUser( val ).then(( user ) => {
      if ( user.exists()) resolve( VALIDATION_ERRORS.username.unavailable )
      else resolve( false )
    })
  })
}

export const password = ( val ) => {
  return new Promise(( resolve, reject ) => {
    if (
      val.length < 8
    ) {
      return resolve( VALIDATION_ERRORS.password.general )
    }

    resolve( false )
  })
}
