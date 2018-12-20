function log(content) {
  chrome.devtools.inspectedWindow.eval(
    'console.log("Request: " + unescape("' + escape(content) + '"))');
}

function logObject(obj) {
  chrome.devtools.inspectedWindow.eval(`console.log(${obj})`)
}

chrome.devtools.panels.create("RPC",
    "icon.png",
    "left-panel.html",
    function(panel) {
      // code invoked on panel creation
      console.log("this panel happened");
    }
);

chrome.devtools.network.onRequestFinished.addListener(
  function(request) {
    if (request.request.url.substr(-4, 4) === "/rpc" && request.request.postData) {
      const json = JSON.parse(request.request.postData.text);
      const responseJson = request.getContent((c) => logObject(c));
      log(json.method);
      logObject(JSON.stringify(json.params));

    }
  }
);
