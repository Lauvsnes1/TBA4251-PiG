import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { FeatureCollection } from 'geojson';
import { useGeoJSONContext } from '../context/geoJSONContext';


function FileInput(props: { handleCloseModal: () => void;}) {
  const [files, setFiles] = useState<File[]>([]);
  const [geoJSONs, setGeoJSONs] = useState<FeatureCollection[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { geoJSONList, setGeoJSONList } = useGeoJSONContext();


  const handleUploadClick = () => {
    // 👇 We redirect the click event onto the hidden input element
    inputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
  
    const list = e.target.files;
    for (let i = 0; i < list.length; i++) {
      console.log("adding item:", list[i], "with index i:", i);
      setFiles((prevFiles) => [...prevFiles, list[i] as File]);
    }
    console.log("Target: ", list);
  };


  const handleOk = () => {
    //pass state up to close modal
    props.handleCloseModal()
    //console.log("List after ok press:", files)
    console.log("List of Local GeoJSONS after ok", geoJSONs)
    console.log("List of Global GeoJSONS after ok", geoJSONList)
    
  }

//   const handleGeoJSONs = () => {
//     console.log("FILES TO WORK WITH", files)
//     const filesToAdd = files.map( file => {
//         const reader = new FileReader();
//         reader.readAsText(file);
//         return new Promise((resolve, reject) => {
//             reader.onload = () => {
//               try {
//                 const content = JSON.parse(reader.result as string);
//                 const isGeoJSON = content.type === 'FeatureCollection';
//                 resolve(isGeoJSON ? content : null);
//               } catch (error) {
//                 reject(error);
//               }
//             };
//             reader.onerror = reject;
//           });
//     })
//     Promise.all(filesToAdd)
//     .then(files => {
//       const geoJSONs = files.filter(file => file !== null);
//       console.log("GeoJSONS:", geoJSONs)
//       geoJSONs.forEach(json => {console.log("Jason:", json, "type:", typeof json);
//       geoJSONs.push(json)
//     });
//       //setGeoJSONs(prevGeoJSONs => [...prevGeoJSONs, geoJSONs]);
//     })
//     .catch(error => {
//       console.error('Error reading file:', error);
//     });

//   }

  //UseEffect to process when file is uploaded
  useEffect(() => {
    const filesToAdd = files.map( file => {
        const reader = new FileReader();
        reader.readAsText(file);
        return new Promise((resolve, reject) => {
            reader.onload = () => {
              try {
                const content = JSON.parse(reader.result as string);
                const isGeoJSON = content.type === 'FeatureCollection';
                resolve(isGeoJSON ? content : null);
              } catch (error) {
                reject(error);
              }
            };
            reader.onerror = reject;
          });
    })
    Promise.all(filesToAdd)
    .then(files => {
      const geoJSONs = files.filter(file => file !== null);
      console.log("GeoJSONS:", geoJSONs)
      geoJSONs.forEach(json => {console.log("Jason:", json, "type:", typeof json);
      console.log("GLOBAL Before:", geoJSONList)
      //Local
      setGeoJSONs((prevGeoJSONs) => [...prevGeoJSONs, json as FeatureCollection]);
      //Global
      geoJSONList.push(json as FeatureCollection)
      //setGeoJSONList([...geoJSONList, json as FeatureCollection])
      console.log("GLOBAL after:", geoJSONList)
    });
      //setGeoJSONs(prevGeoJSONs => [...prevGeoJSONs, geoJSONs]);
    })
    .catch(error => {
      console.error('Error reading file:', error);
    });

  }, [files])


  

  return (
    <div style={{display: "flex", flexDirection: "column",  justifyContent: "center", alignItems: "center"}}>
        <Typography variant="h6"> File uploader:</Typography>
      <div style={{display: "inherit", paddingTop: "5%"}}>Upload file(s):</div>

      {/* 👇 Our custom button to select and upload a file */}
      <Button onClick={handleUploadClick}>
        {'Click to Upload'}
      </Button>
      <div>
        {files.map((item )=> {
            return <Typography>{item.name}</Typography>
        })}
        </div>
      <input
        multiple
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Button onClick={handleOk}>OK</Button>
    </div>
    
  );
}
export default FileInput;