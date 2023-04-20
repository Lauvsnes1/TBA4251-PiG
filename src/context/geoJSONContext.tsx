import { createContext, useContext, useState } from 'react';
import { FeatureCollection } from 'geojson';
import { LngLatLike } from 'mapbox-gl';

export type GeoJSONItem = {
  id: string;
  name: string;
  visible: boolean;
  color: string;
  opacity: number;
  geoJSON: FeatureCollection;
};

type GeoJSONContextType = {
  geoJSONList: Array<GeoJSONItem>;
  baseMap: string;
  lngLat: LngLatLike;
  setLngLat: (selected: LngLatLike) => void;
  setBaseMap: (selected: string) => void;
  setGeoJSONList: (
    selected: GeoJSONItem[] | ((prevSelected: GeoJSONItem[]) => GeoJSONItem[])
  ) => void;
};

const GeoJSONContext = createContext<GeoJSONContextType>({
  geoJSONList: [],
  baseMap: '',
  setBaseMap: () => null,
  setGeoJSONList: () => {},
  setLngLat: () => {},
  lngLat: [0, 0],
});

export const useGeoJSONContext = () => useContext(GeoJSONContext);

type Props = {
  children?: React.ReactNode;
};

const GeoJSONProvider: React.FC<Props> = ({ children }) => {
  const [geoJSONList, setGeoJSONList] = useState<GeoJSONItem[]>([]);
  const [baseMap, setBaseMap] = useState<string>('mapbox://styles/mapbox/light-v11');
  const [lngLat, setLngLat] = useState({ lng: 10.421906, lat: 63.446827 } as LngLatLike);

  return (
    <GeoJSONContext.Provider
      value={{ geoJSONList, setGeoJSONList, baseMap, setBaseMap, lngLat, setLngLat }}
    >
      {children}
    </GeoJSONContext.Provider>
  );
};

export default GeoJSONProvider;
