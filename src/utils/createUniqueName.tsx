import { GeoJSONItem } from '../context/geoJSONContext';

export default function createUniqueName(name: string, allLayers: GeoJSONItem[]): string {
  let count = 0;
  const baseName = name;
  const names = allLayers.map((item) => item.name);

  while (names.includes(name)) {
    count++;
    name = `${baseName}_${count}`;
  }
  return name;
}
