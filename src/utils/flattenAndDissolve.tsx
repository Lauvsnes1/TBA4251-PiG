import { FeatureCollection, Polygon } from 'geojson';
import flatten from '@turf/flatten';
import dissolve from '@turf/dissolve';
import { Properties } from '@turf/helpers';

export function flattenFeatures(
  layer1: FeatureCollection,
  layer2: FeatureCollection,
  debug = false
): {
  processed1: FeatureCollection<Polygon, Properties>;
  processed2: FeatureCollection<Polygon, Properties>;
} {
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
  const processed1 = dissolve(flattened1 as FeatureCollection<Polygon, Properties>);
  const processed2 = dissolve(flattened2 as FeatureCollection<Polygon, Properties>);

  return { processed1, processed2 };
}
