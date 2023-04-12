import React, {useState} from 'react';
import MainPage from './components/mainPage';
import Alert, { AlertColor } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

function App() {
  const [alertComponent, setAlertComponent] = useState<JSX.Element>()
  const [alert, setAlert] = useState<boolean>(false)

const showAlert = (status: AlertColor, message: string) => {
  const componentToRender: JSX.Element | undefined = (
    <Alert
    severity={status}
    variant="filled"
    style={{
      position: "fixed",
      top: 600,
      left: 30,
      right: 750,
      zIndex: 9999,
      transition: "opacity 0.7s ease-in-out",
      // opacity: alert ? 1 : 0,
      // pointerEvents: alert ? "auto" : "none",
    }}
  >
    <AlertTitle>{status}</AlertTitle>
    {message}
  </Alert>)
  setAlertComponent(componentToRender)
  setAlert(true)
  setTimeout(() => {
  setAlert(false)
  }, 3000);
}


  return (
    <div id="root" className='App'> 
    <MainPage showAlert={showAlert}/>
    <div>
    {alert? alertComponent : <></>}
    </div>
    </div>
      
  );
}

export default App;
