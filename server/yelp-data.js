const yelp = require( 'yelp-fusion' )

const YELP_ID = 'xAlOtfTlrg38WtIA_B_QZA'
const YELP_SECRET = 'Kiklju4gg6B9zuR9FqxqSSVaoAy8GFU9xzanoQVUvGTJhMS3vGxY4nypjlemqoUp'

const yelpData = ( req, res ) => {
  yelp.accessToken( YELP_ID, YELP_SECRET )
  .then(( response ) => {
    const client = yelp.client( response.jsonBody.access_token )

    client.search( req.query )
    .then(( response ) => {
      const firstResult = response.jsonBody.businesses[ 0 ]
      res.send( firstResult )
    })
    .catch(( err ) => console.log( err ))
  })
  .catch(( err ) => console.log( err ))
}

module.exports = yelpData
