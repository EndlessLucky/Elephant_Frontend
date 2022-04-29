import { StrictMode } from "react";
import App from "./App";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);

reportWebVitals();