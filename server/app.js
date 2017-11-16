const express = require( 'express' )
const path = require( 'path' )
const app = express()

const yelpData = require( './yelp-data' )
const indexUser = require( './index-user' )
const searchUsers = require( './search-users' )

const PUBLIC_DIRECTORY = path.join( __dirname, '../public' )
const HTML = path.join( __dirname, '../public/index.html' )

app.set( 'port', process.env.PORT || 3000 )
app.use( express.static( PUBLIC_DIRECTORY ))

app.get( '/yelp-data', yelpData )
app.get( '/index-user', indexUser )
app.get( '/search-users', searchUsers )

app.get( '*', ( req, res ) => {
  res.sendFile( HTML )
})

app.listen( app.get( 'port' ), () => {
  console.log( 'Listening on port ' + app.get( 'port' ))
})
