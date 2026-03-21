<<<<<<< HEAD
import "bootstrap/dist/css/bootstrap.min.css";
import "./theme.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
=======
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
>>>>>>> e5787eaa3712cbd3db98aba4651d0d9d80ff319d

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
