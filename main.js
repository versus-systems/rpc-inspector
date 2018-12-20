import React from "react";
import { render } from "react-dom";

require("@babel/polyfill");

const rootElement = document.getElementById("root");

render(
  <div>
    this is a React element
  </div>,
  rootElement
);

function log(content) {
  chrome.devtools.inspectedWindow.eval(
    'console.log("Request: " + unescape("' + escape(content) + '"))');
}

function logObject(obj) {
  chrome.devtools.inspectedWindow.eval(`console.log(${obj})`)
}

chrome.devtools.network.onRequestFinished.addListener(
  function(request) {
    if (request.request.url.substr(-4, 4) === "/rpc" && request.request.postData) {
      console.log("JFHGKFJHG");
      const json = JSON.parse(request.request.postData.text);
      const responseJson = request.getContent((c) => logObject(c));
      log(json.method);
      logObject(JSON.stringify(json.params));
    }
  }
);
