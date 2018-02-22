const axios = require( 'axios' )
const { ref } = require( './constants/firebase' )

const getInstagramPhotos = ( url ) => {
  return new Promise(( resolve ) => {
    axios.get( `https://instagram.com/${ url }` )
    .then(( response ) => {
      const html = response.data
      const sharedData = JSON.parse( html.split( 'window._sharedData = ' )[ 1 ].split( ';</script>' )[ 0 ])

      resolve( sharedData.entry_data.LocationsPage[ 0 ].location )
    })
  })
}

const instagramData = ( req, res ) => {
  const { url } = req.query

  getInstagramPhotos( url )
  .then(( data ) => res.send( data ))
}

module.exports = instagramData
