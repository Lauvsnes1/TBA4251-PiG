// import * as React from 'react';
// import { GeoLayer, LayerTypeContext } from '../@types/file';

// export const layerContext = React.createContext<LayerTypeContext | null>(null)

// const layerProvider: React.FC<React.ReactNode> = ({children }) => {
//     // eslint-disable-next-line react-hooks/rules-of-hooks
//     const layers = React.useState<GeoLayer[]>([{id: "1", name: "Initial layer", layer:   {
//         type: 'FeatureCollection',
//         features: [
//           {
//             type: 'Feature',
//             geometry: {
//               type: 'Point',
//               coordinates: [ 10.396114476420967, 63.434122035573246 ]
//             },
//             properties: {
//               title: 'My Marker 2',
//               description: 'This is my marker',
//             },
//           }
//         ]
//       }}])

//     return (
//         <layerContext.Provider value={{layers}}>
//           {children}
//         </layerContext.Provider>
//       );
//     };

export {}
