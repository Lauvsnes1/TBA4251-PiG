import { createContext, useContext, useState } from "react";
import { FeatureCollection } from "geojson";

export type GeoJSONItem = {
  geoJSON: FeatureCollection;
};

type GeoJSONContextType = {
  geoJSONList: FeatureCollection[];
  setGeoJSONList: (selected: FeatureCollection[]) => void;
};

const GeoJSONContext = createContext<GeoJSONContextType>({
  geoJSONList: [],
  setGeoJSONList: () => {},
});

export const useGeoJSONContext = () => useContext(GeoJSONContext);

type Props = {
  children?: React.ReactNode;
};

const GeoJSONProvider: React.FC<Props> = ({ children }) => {
  const [geoJSONList, setGeoJSONList] = useState<FeatureCollection[]>([]);


  return (
    <GeoJSONContext.Provider value={{ geoJSONList, setGeoJSONList}}>
      {children}
    </GeoJSONContext.Provider>
  );
};

export default GeoJSONProvider;
