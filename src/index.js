import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
// import App from './App';
// import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  // Route,
  // Link,
} from "react-router-dom";
import ProductsList from './Components/ProductsList';
import { AuthProvider } from './Context/Auth';
import { ViewProvider } from './Context/View';
import Home from './Pages/Home';
import Login from './Pages/Login';
import { BASE_URL } from './utils/constans';
import {GlobalProvider} from './Context/GlobalContext';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "login",
    element: <Login/>,
  },
  {
    path: "productList",
    element: <ProductsList />
  },
]);

axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <ViewProvider>
      <GlobalProvider>
        <RouterProvider router={router} />
      </GlobalProvider>
    </ViewProvider>
  </AuthProvider>
);
