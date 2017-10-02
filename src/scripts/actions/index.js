export const updateCurrentUser = ( user ) => {
  return {
    type: 'UPDATE_CURRENT_USER',
    currentUser: user,
  }
}

export const updateCurrentLocation = ( location ) => {
  return {
    type: 'UPDATE_CURRENT_LOCATION',
    currentLocation: {
      lat: location.lat,
      lng: location.lng,
    },
  }
}
