const axios = require( 'axios' )
const { ref } = require( '../constants/firebase' )

ref.child( 'users' ).once( 'value' ).then(( snapshot ) => {
  snapshot.forEach(( childSnapshot ) => {
    const user = childSnapshot.val()
    const userData = {
      fullName: user.fullName,
      uid: user.uid,
      username: user.username,
    }

    const params = {
      params: {
        key: 'users',
        data: userData,
      },
    }

    axios.get( 'http://localhost:3000/index-user', params )
  })
})
