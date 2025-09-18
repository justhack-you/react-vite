import { BrowserRouter, Routes, Route } from "react-router-dom";
import Drawer from "./components/Drawer";
import Login from "./components/Login";
import Registration from "./components/Registration";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./components/AppStores/store";
import { useEffect } from "react";


function App() {

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/public/sw.js ')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  return (
    <>
      <Provider store={store}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/chat/:chatId" element={<Drawer />} />
          </Routes>
        </BrowserRouter>

        <Toaster
          position="top-right"
          reverseOrder={false}
        />
      </Provider>
    </>
  );
}

export default App;
