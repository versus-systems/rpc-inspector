import React from "react";
import { render } from "react-dom";
import App from "./App.js";

require("@babel/polyfill");

const rootElement = document.getElementById("root");
render(<App />, rootElement);
