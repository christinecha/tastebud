const axios = require( 'axios' )
const { ref } = require( './constants/firebase' )

const getInstagramPhotos = ( username ) => {
  return new Promise(( resolve ) => {
    axios.get( `https://instagram.com/${ username }` )
    .then(( response ) => {
      const html = response.data
      const sharedData = JSON.parse( html.split( 'window._sharedData = ' )[ 1 ].split( ';</script>' )[ 0 ])

      resolve( sharedData.entry_data.ProfilePage[ 0 ].user )
    })
  })
}

const instagramData = ( req, res ) => {
  const { username } = req.query

  getInstagramPhotos( username )
  .then(( data ) => res.send( data ))
}

module.exports = instagramData
