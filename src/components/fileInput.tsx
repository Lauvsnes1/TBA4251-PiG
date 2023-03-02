import { ChangeEvent, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { FeatureCollection } from 'geojson';
import { useGeoJSONContext, GeoJSONItem} from '../context/geoJSONContext';
import { uid } from 'uid';


function FileInput(props: { handleCloseModal: () => void;}) {
  const [files, setFiles] = useState<File[]>([]);
  const [geoJSONs, setGeoJSONs] = useState<FeatureCollection[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { geoJSONList, setGeoJSONList } = useGeoJSONContext();


  const handleUploadClick = () => {
    // 👇 We redirect the click event onto the hidden input element
    inputRef.current?.click();
  };
  const handleOk = () => {
    //pass state up to close modal
    props.handleCloseModal()
    //console.log("List after ok press:", files)
    console.log("List of Local GeoJSONS after ok", geoJSONs)
    console.log("List of Global GeoJSONS after ok", geoJSONList)
    
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const list = e.target.files
    
  
    const promises = Array.from(list).map((file) => {
      setFiles((prevList) => [...prevList, file as File]);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const content = JSON.parse(reader.result as string);
            const isGeoJSON = content.type === 'FeatureCollection';
            resolve(isGeoJSON ? content : null);
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsText(file);
      });
    });
  
    try {
      const files = await Promise.all(promises);
      const geoJSONs = files.filter((file) => file !== null);
      let nameCounter: number = 0;
      geoJSONs.forEach(json => { console.log("Jason:", json, "type:", typeof json);
      console.log("GLOBAL Before:", geoJSONList)
      //Local
      setGeoJSONs((prevGeoJSONs) => [...prevGeoJSONs, json as FeatureCollection]);
      const name: string = list[nameCounter].name.split(".")[0]; //To remove ".geoJSON"
     
      const newObj: GeoJSONItem = {
        id: uid(),
        name: name, 
        visible: true,
        color: getRandomColor(),
        geoJSON: json as FeatureCollection
      }
      setGeoJSONList((prevGeoJSONs: GeoJSONItem[]) => [...prevGeoJSONs, newObj as GeoJSONItem])
      nameCounter ++;
     })

    } catch (error) {
      console.error('Error reading file:', error);
    }
  };
  
  function getRandomColor(): string {
    const hexChars = "0123456789ABCDEF";
    let hexColor = "#";
  
    // generate a random hex color code
    for (let i = 0; i < 6; i++) {
      hexColor += hexChars[Math.floor(Math.random() * 16)];
    }
  
    return hexColor;
  }
  

  return (
    <div style={{display: "flex", flexDirection: "column",  justifyContent: "center", alignItems: "center"}}>
        <Typography variant="h6"> File uploader:</Typography>
      <div style={{display: "inherit", paddingTop: "5%"}}>Upload file(s):</div>

      {/* 👇 Our custom button to select and upload a file */}
      <Button onClick={handleUploadClick}>
        {'Click to Upload'}
      </Button>
      <div>
        {files.map((files )=> {
            return <Typography key={files.name} >{files.name}</Typography>
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