const axios = require( 'axios' )

const YELP_KEY = '2tbl7f9gBPKWCoTC2T8InIU64365FBnecXFOzDwyfElZAeLyoDmOZQu2Uc4k8Ttv0Lesc-FSQVLDBwv3D6JOy6Un1G4R3dDdqVdCNPMI7k-_emIZyGRdx7jxWG-PWXYx'

const yelpData = ( req, res ) => {
  const { term, latitude, longitude } = req.query

  const searchRequest = {
    headers: {
      'Authorization': `Bearer ${ YELP_KEY }`,
    },
    params: {
      term,
      latitude,
      longitude,
    },
  }

  axios.get( 'https://api.yelp.com/v3/businesses/search', searchRequest )
  .then(( response ) => {
    const firstResult = response.data.businesses[ 0 ]
    res.send( firstResult )
  })
  .catch(( err ) => console.log( err ))
}

module.exports = yelpData
