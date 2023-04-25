import React, { useState } from 'react';
import MainPage from './components/mainPage';
import Alert, { AlertColor } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

function App() {
  const [alerts, setAlerts] = useState<JSX.Element[]>([]);

  const showAlert = (status: AlertColor, message: string) => {
    const newAlert: JSX.Element = (
      <Alert
        severity={status}
        variant="filled"
        style={{
          position: 'fixed',
          top: 600 - alerts.length * 85, // Updated to position alerts over each other
          left: 30,
          right: 750,
          zIndex: 9999,
          transition: 'opacity 0.7s ease-in-out',
        }}
      >
        <AlertTitle>{status}</AlertTitle>
        {message}
      </Alert>
    );

    // Add the new alert to the array of alerts
    setAlerts([...alerts, newAlert]);

    // Remove the alert after 3 seconds
    setTimeout(() => {
      setAlerts((currentAlerts) => currentAlerts.filter((alert) => alert !== newAlert));
    }, 4000);
  };

  return (
    <div id="root" className="App">
      <MainPage showAlert={showAlert} />
      <div>
        {alerts.map((alert, index) => (
          <React.Fragment key={index}>{alert}</React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default App;
