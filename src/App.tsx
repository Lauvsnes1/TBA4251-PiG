import React, { useState } from 'react';
import MainPage from './pages/mainPage';
import Alert, { AlertColor } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { uid } from 'uid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const showAlert = (status: string, message: string) => {
    switch (status) {
      case 'info':
        toast.info(message, { pauseOnHover: true });
        break;

      case 'success':
        toast.success(message, { pauseOnHover: true });
        break;

      case 'warning':
        toast.warning(message, { pauseOnHover: true });
        break;

      case 'error':
        toast.error(message, { pauseOnHover: true });
        break;
    }
  };

  return (
    <div id="root" className="App">
      <MainPage showAlert={showAlert} />
      <div>
        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="colored"
        />
      </div>
    </div>
  );
}

export default App;
