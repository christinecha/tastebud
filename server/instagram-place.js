const axios = require( 'axios' )

const getInstagramPlace = ( query ) => {
  return new Promise(( resolve, reject ) => {
    axios.get( `https://www.instagram.com/web/search/topsearch/?context=blended&query=${ query }` )
    .then(( response ) => {
      const { data } = response
      const { places } = data

      if ( places && places[ 0 ]) resolve( places[ 0 ].place )
      else reject()
    })
  })
}

const instagramPlace = ( req, res ) => {
  const { name, vicinity } = req.query

  let _vicinity = vicinity.toLowerCase()
  _vicinity = _vicinity.split( ',' )[ 0 ]
  _vicinity = _vicinity.split( 'avenue' ).join( 'ave' )
  _vicinity = _vicinity.split( 'street' ).join( 'st' )

  getInstagramPlace( name + ' ' + _vicinity )
  .then(( data ) => res.send( data ))
  .catch(() => {
    getInstagramPlace( name )
    .then(( data ) => res.send( data ))
  })
}

module.exports = instagramPlace
