import { FeatureCollection } from 'geojson';
import flatten from '@turf/flatten';

export function flattenFeatures(
  layer1: FeatureCollection,
  layer2: FeatureCollection,
  debug = false
): { flattened1: FeatureCollection; flattened2: FeatureCollection } {
  const flattened1: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };

  const flattened2: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };

  layer1.features.forEach((feature) => {
    if (feature.geometry.type === 'MultiPolygon') {
      const tempGeom = flatten(feature.geometry);
      tempGeom.features.forEach((poly) => {
        flattened1.features.push(poly);
        if (debug) console.log('pushing feature:', poly);
      });
    } else {
      flattened1.features.push(feature);
    }
  });

  layer2.features.forEach((feature) => {
    if (feature.geometry.type === 'MultiPolygon') {
      const tempGeom = flatten(feature.geometry);
      tempGeom.features.forEach((poly) => {
        flattened2.features.push(poly);
        if (debug) console.log('pushing feature:', poly);
      });
    } else {
      flattened2.features.push(feature);
    }
  });

  return { flattened1, flattened2 };
}
