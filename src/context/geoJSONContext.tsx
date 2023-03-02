import { createContext, useContext, useState } from "react";
import { FeatureCollection } from "geojson";

export type GeoJSONItem = {
  id: string,
  name: string,
  visable: boolean,
  color: string,
  geoJSON: FeatureCollection;
};

type GeoJSONContextType = {
  geoJSONList: Array<GeoJSONItem>;
  setGeoJSONList: (selected: GeoJSONItem[] | ((prevSelected: GeoJSONItem[]) => GeoJSONItem[])) => void;
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
  const [geoJSONList, setGeoJSONList] = useState<GeoJSONItem[]>([]);


  return (
    <GeoJSONContext.Provider value={{ geoJSONList, setGeoJSONList}}>
      {children}
    </GeoJSONContext.Provider>
  );
};

export default GeoJSONProvider;
