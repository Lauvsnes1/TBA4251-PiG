import { FeatureCollection } from 'geojson';
import { getType } from '@turf/invariant';

//Give 1 in inital opacity to point and linestring layers, 0.5 for the rest
export default function determineOpacity(layer: FeatureCollection) {
  const type = getType(layer.features[0]);
  return type === 'Point' || type === 'LineString' ? 1 : 0.5;
}
