export const placeMarkers = {
  yours: {
    url: '/assets/images/marker-black.svg',
    scaledSize: new google.maps.Size( 20, 20 ),
    origin: new google.maps.Point( 0, 0 ),
    anchor: new google.maps.Point( 10, 10 ),
  },
  friends: {
    url: '/assets/images/marker-white.svg',
    scaledSize: new google.maps.Size( 20, 20 ),
    origin: new google.maps.Point( 0, 0 ),
    anchor: new google.maps.Point( 10, 10 ),
  },
}

export const currentLocationImage = {
  url: '/assets/images/marker-blue.svg',
  scaledSize: new google.maps.Size( 30, 30 ),
  origin: new google.maps.Point( 0, 0 ),
  anchor: new google.maps.Point( 15, 15 ),
}
