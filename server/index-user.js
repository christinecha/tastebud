const algoliasearch = require( 'algoliasearch' )

const ALGOLIA_ID = 'J28SJH4J25'
const ALGOLIA_ADMIN_KEY = '977c0cb665372132366cde9f28019cf6'

const client = algoliasearch( ALGOLIA_ID, ALGOLIA_ADMIN_KEY )

const indexUser = ( req ) => {
  const { key, data } = req.query

  const JSONData = JSON.parse( data )

  // Add an "objectID" field which Algolia requires
  JSONData.objectID = JSONData.uid

  // Write to the algolia index
  const index = client.initIndex( key )
  return index.saveObject( JSONData )
}

module.exports = indexUser
