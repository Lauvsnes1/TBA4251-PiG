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
  setGeoJSONList: (selected: GeoJSONItem[]) => void;
  setVisable: (value: boolean) => void;
};

const GeoJSONContext = createContext<GeoJSONContextType>({
  geoJSONList: [],
  setGeoJSONList: () => {},
  setVisable: () => {}
});

export const useGeoJSONContext = () => useContext(GeoJSONContext);

type Props = {
  children?: React.ReactNode;
};

const GeoJSONProvider: React.FC<Props> = ({ children }) => {
  const [geoJSONList, setGeoJSONList] = useState<GeoJSONItem[]>([]);
  const [visable, setVisable] = useState<boolean>(); 


  return (
    <GeoJSONContext.Provider value={{ geoJSONList, setGeoJSONList, setVisable }}>
      {children}
    </GeoJSONContext.Provider>
  );
};

export default GeoJSONProvider;
