import axios from 'axios'

const getInstagramPlaceUrl = ( activePlace ) => {
  return new Promise(( resolve ) => {
    if ( activePlace.instagramPlaceUrl ) {
      resolve( activePlace.instagramPlaceUrl )
      return
    }

    const { name, vicinity } = activePlace

    const request = {
      params: {
        name,
        vicinity,
      },
    }

    axios.get( '/instagram-place', request )
    .then(( response ) => {
      const { data } = response
      const url = `explore/locations/${ data.location.pk }/${ data.slug }`
      resolve( url )
    })
  })
}

const getInstagramData = ( activePlace ) => {
  return new Promise(( resolve ) => {
    getInstagramPlaceUrl( activePlace )
    .then(( instagramPlaceUrl ) => {
      if ( !instagramPlaceUrl ) {
        console.log( 'Could not find an instagram place URL for: ', activePlace )
        return
      }

      const request = {
        params: {
          url: instagramPlaceUrl,
        },
      }

      axios.get( '/instagram-data', request )
      .then(( response ) => {
        const { data } = response
        const images = data.media.nodes
        const instagramImages = images.map(( image ) => image.thumbnail_src )
        resolve({
          instagramPlaceUrl,
          instagramImages,
        })
      })
    })
  })
}

export default getInstagramData
