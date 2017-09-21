const getFriendlyDistance = (point1, point2) => {
  if (!point1 || !point2) return null

  const latLng1 = new google.maps.LatLng(point1.lat, point1.lng)
  const latLng2 = new google.maps.LatLng(point2.lat, point2.lng)
  const meters = google.maps.geometry.spherical.computeDistanceBetween(latLng1, latLng2)

  const feet = meters * 3.28084
  const miles = feet * 0.000189394

  if (feet > 800) return `${miles.toFixed(1)} mi`

  return `${Math.round(feet)} ft`
}

export default getFriendlyDistance
