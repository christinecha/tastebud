const axios = require( 'axios' )

const getInstagramUsername = ( query ) => {
  return new Promise(( resolve ) => {
    axios.get( `https://www.instagram.com/web/search/topsearch/?context=blended&query=${ query }` )
    .then(( response ) => {
      const { data } = response
      const { users } = data

      if ( users[ 0 ]) resolve( users[ 0 ].user.username )
      else resolve( null )
    })
  })
}

const instagramUsername = ( req, res ) => {
  let { username } = req.query
  getInstagramUsername( username )
  .then(( data ) => res.send( data ))
}

module.exports = instagramUsername
