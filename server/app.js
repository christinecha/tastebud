const express = require( 'express' )
const path = require( 'path' )
const app = express()

const yelp = require( 'yelp-fusion' )

const YELP_ID = 'xAlOtfTlrg38WtIA_B_QZA'
const YELP_SECRET = 'Kiklju4gg6B9zuR9FqxqSSVaoAy8GFU9xzanoQVUvGTJhMS3vGxY4nypjlemqoUp'

const PUBLIC_DIRECTORY = path.join( __dirname, '../public' )
const HTML = path.join( __dirname, '../public/index.html' )

app.set( 'port', process.env.PORT || 3000 )
app.use( express.static( PUBLIC_DIRECTORY ))

app.get( '/yelp-rating', ( req, res ) => {
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
})

app.get( '*', ( req, res ) => {
  res.sendFile( HTML )
})

app.listen( app.get( 'port' ), () => {
  console.log( 'Listening on port ' + app.get( 'port' ))
})
