export const geoJSONList: GeoJSON.FeatureCollection<GeoJSON.Point, { title: string, description: string }>[] = 
[  {    type: 'FeatureCollection',    
      features: [      {        type: 'Feature',        geometry: {          type: 'Point',          coordinates: [ 10.414997227081066, 63.43964905148289  ]
        },
        properties: {
          title: 'My Marker 1',
          description: 'This is my marker',
        },
      }
    ]
  },
  {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [ 10.396114476420967, 63.434122035573246 ]
        },
        properties: {
          title: 'My Marker 2',
          description: 'This is my marker',
        },
      }
    ]
  }
];
