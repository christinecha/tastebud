const mapStyle = [
  {
    'featureType': 'administrative',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#444444',
      },
      {
        'lightness': 30,
      },
    ],
  },
  {
    'featureType': 'administrative.locality',
    'elementType': 'labels.text',
    'stylers': [
      {
        'lightness': 65,
      },
    ],
  },
  {
    'featureType': 'landscape',
    'stylers': [
      {
        'color': '#f2f2f2',
      },
    ],
  },
  {
    'featureType': 'poi',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'poi.park',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#7e8281',
      },
      {
        'visibility': 'simplified',
      },
    ],
  },
  {
    'featureType': 'road',
    'stylers': [
      {
        'saturation': -100,
      },
      {
        'lightness': 45,
      },
    ],
  },
  {
    'featureType': 'road.arterial',
    'elementType': 'labels.icon',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'road.highway',
    'stylers': [
      {
        'visibility': 'simplified',
      },
    ],
  },
  {
    'featureType': 'transit',
    'stylers': [
      {
        'visibility': 'off',
      },
    ],
  },
  {
    'featureType': 'water',
    'stylers': [
      {
        'color': '#46bcec',
      },
      {
        'visibility': 'on',
      },
    ],
  },
  {
    'featureType': 'water',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'saturation': -45,
      },
      {
        'lightness': 65,
      },
    ],
  },
  {
    'featureType': 'water',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'saturation': -80,
      },
    ],
  },
]

export default mapStyle
