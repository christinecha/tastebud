import LOCALITY_NICKNAMES from '../../../constants/LOCALITY_NICKNAMES'
import { newPlace, getPlace } from '../../../db/place'

const $input = document.createElement( 'INPUT' )
const service = new google.maps.places.PlacesService( $input )

const getGooglePlaceObject = ( placeId ) => {
  return new Promise(( resolve ) => {
    service.getDetails(
      { placeId },
      ( _place, status ) => {
        if ( status !== google.maps.places.PlacesServiceStatus.OK ) return
        resolve( _place )
      }
    )
  })
}

const savePlaceFromGoogle = ( placeId ) => {
  return new Promise(( resolve ) => {
    getPlace( placeId )
    .then(( snapshot ) => {
      if ( snapshot.exists()) {
        resolve( placeId )
        return
      }

      getGooglePlaceObject( placeId )
      .then(( place ) => {
        let locality

        place.address_components.forEach(( c ) => {
          if ( c.types.indexOf( 'sublocality' ) > -1 ) locality = c.long_name
          if ( c.types.indexOf( 'locality' ) > -1 ) locality = c.long_name
          if ( c.types.indexOf( 'administrative_area_level_1' ) > -1 ) locality = c.long_name
        })

        const placeData = {
          name: place.name,
          id: place.place_id,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          pricePoint: place.price_level || 0,
          rating: place.rating,
          types: place.types,
          vicinity: place.vicinity,
          locality: LOCALITY_NICKNAMES[ locality ] || locality || '',
        }

        newPlace( placeData )
        .then(( placeId ) => {
          resolve( placeId )
        })
      })
    })
  })
}

export default savePlaceFromGoogle
