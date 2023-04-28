import React, { useState } from 'react';
import MainPage from './components/mainPage';
import Alert, { AlertColor } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { uid } from 'uid';

function App() {
  const [alerts, setAlerts] = useState<{ id: string; element: JSX.Element }[]>([]);

  const showAlert = (status: AlertColor, message: string) => {
    const id = uid();

    const newAlert: JSX.Element = (
      <Alert
        key={id}
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
    setAlerts((prevAlerts) => [...prevAlerts, { id, element: newAlert }]);

    // Remove the alert after 3 seconds
    setTimeout(() => {
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
    }, 3000);
  };

  return (
    <div id="root" className="App">
      <MainPage showAlert={showAlert} />
      <div>
        {alerts.map((alert) => (
          <React.Fragment key={alert.id}>{alert.element}</React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default App;
