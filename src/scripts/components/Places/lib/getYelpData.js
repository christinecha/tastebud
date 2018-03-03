import axios from 'axios'

const getYelpData = ( activePlace ) => {
  return new Promise(( resolve ) => {
    if ( activePlace.yelpRating && activePlace.yelpCategories ) {
      resolve({
        yelpRating: activePlace.yelpRating,
        yelpCategories: activePlace.yelpCategories,
      })
      return
    }

    const searchRequest = {
      params: {
        term: activePlace.name,
        latitude: activePlace.lat,
        longitude: activePlace.lng,
      },
    }

    axios.get( '/yelp-data', searchRequest )
    .then(( response ) => {
      const { data } = response

      const yelpCategories = data.categories.map(( category ) => category.title )
      const yelpRating = data.rating.toFixed( 1 )

      resolve({
        yelpRating,
        yelpCategories,
      })
    })
  })
}

export default getYelpData
