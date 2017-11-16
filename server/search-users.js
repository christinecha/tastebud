const algoliasearch = require( 'algoliasearch' )

const ALGOLIA_ID = 'J28SJH4J25'
const ALGOLIA_ADMIN_KEY = '977c0cb665372132366cde9f28019cf6'

const client = algoliasearch( ALGOLIA_ID, ALGOLIA_ADMIN_KEY )

const searchUsers = ( req, res ) => {
  const index = client.initIndex( 'users' )

  index
  .search({ query: req.query.searchQuery })
  .then(( responses ) => {
    res.send( responses.hits )
  })
}

module.exports = searchUsers
