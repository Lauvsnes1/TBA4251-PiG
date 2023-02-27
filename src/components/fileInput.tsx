import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

function FileInput(props: { handleCloseModal: () => void;}) {
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);


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
    console.log("List after ok press:", files)
    
  }

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
      //setFiles(prevFiles => [...prevFiles, ...geoJSONs]);
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