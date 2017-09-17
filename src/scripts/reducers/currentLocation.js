// New York City
const defaultLocation = {
  lat: 40.725493,
  lng: -74.004167
}

const currentLocation = (state = defaultLocation, action) => {
  switch (action.type) {
    case 'UPDATE_CURRENT_LOCATION':
      return action.currentLocation
    default:
      return state
  }
}

export default currentLocation
