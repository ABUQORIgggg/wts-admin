import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PrivateRoute from "../src/components/PrivateRoute"; // Import PrivateRoute component

import Home from "../src/pages/Home";
import Products from "../src/pages/Products";
import Login from "../src/pages/Login"; 
import store, { persistor } from "./redux/store";
import Applications from "./pages/Applications";
import News from "./pages/News";
import Advertising from "./pages/Advertising";
import Layout from "./pages/Layout";
import Category from "./pages/Category";

const router = createBrowserRouter([
  {
    path: "/app",
    element: 
    <PrivateRoute >
      <App />
    </PrivateRoute>
    ,
    children: [
      {
        path: "home", 
        element: 
        <PrivateRoute >
        <Home />
        </PrivateRoute>,
      },
      {
        path: "products", 
        element: <PrivateRoute >
        <Products />
        </PrivateRoute>,
      },
      {
        path: "applications", // Убираем слэш
        element: <PrivateRoute >
        <Applications />
        </PrivateRoute>,
      },
      {
        path: "news", // Убираем слэш
        element: <PrivateRoute >
        <News />
        </PrivateRoute>,
      },
      {
        path: "advertising", // Убираем слэш и приводим путь к нижнему регистру
        element: <PrivateRoute >
        <Advertising />
        </PrivateRoute>,
      },
      {
        path: "layout", // Убираем слэш и приводим путь к нижнему регистру
        element: <PrivateRoute >
        <Layout />
        </PrivateRoute>,
      },
      {
        path: "category", // Убираем слэш и приводим путь к нижнему регистру
        element: <PrivateRoute >
        <Category />
        </PrivateRoute>,
      }
    ],
  },
  {
    path: "/",
    element: (
        <Login />
    ),
  },
]);


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
);

reportWebVitals();
