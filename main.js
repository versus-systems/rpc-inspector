import React from "react";
import { render } from "react-dom";
import App from "./src/App.js";

require("@babel/polyfill");

const rootElement = document.getElementById("root");

render(
  <App />,
  rootElement
);

function log(content) {
  chrome.devtools.inspectedWindow.eval(
    'console.log("Request: " + unescape("' + escape(content) + '"))');
}

function logObject(obj) {
  chrome.devtools.inspectedWindow.eval(`console.log(${obj})`)
}
