import { ToastContainer, ToastPosition } from 'react-toastify';
export function Toastify() {

    let location = "top-right" as ToastPosition
    // if(typeof(window)!=="undefined"){
    //   location = (localStorage.getItem(SETTING_NAME_TOAST_LOCATION)) ? localStorage.getItem(SETTING_NAME_TOAST_LOCATION): "bottom-center"
    // }
    return (<ToastContainer
      position={location}
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={true}
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover={false}
      />)
  } 
  
