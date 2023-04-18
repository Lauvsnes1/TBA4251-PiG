import { createContext, useContext, useState } from 'react';
import { FeatureCollection } from 'geojson';

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
});

export const useGeoJSONContext = () => useContext(GeoJSONContext);

type Props = {
  children?: React.ReactNode;
};

const GeoJSONProvider: React.FC<Props> = ({ children }) => {
  const [geoJSONList, setGeoJSONList] = useState<GeoJSONItem[]>([]);
  const [baseMap, setBaseMap] = useState<string>('mapbox://styles/mapbox/light-v11');

  return (
    <GeoJSONContext.Provider value={{ geoJSONList, setGeoJSONList, baseMap, setBaseMap }}>
      {children}
    </GeoJSONContext.Provider>
  );
};

export default GeoJSONProvider;
