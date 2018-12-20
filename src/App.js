import React from "react";
import ReactJson from "react-json-view";

class App extends React.Component {
  state = {
    requests: [],
    activeRequest: null,
  }

  handleRequest = (request) => {
    if (request.request.url.substr(-4, 4) === "/rpc" && request.request.postData) {
      const json = JSON.parse(request.request.postData.text);
      const responseJson = request.getContent((c) => {
        const requestObj = {
          method: json.method,
          params: json.params,
          response: JSON.parse(c),
        };

        this.setState({ requests: [...this.state.requests, requestObj]});
      });
    }
  }

  setActiveRequest = (req) => this.setState({ activeRequest: req })

  componentDidMount() {
    chrome.devtools.network.onRequestFinished.addListener(this.handleRequest);
  }

  render() {
    const { requests, activeRequest } = this.state;

    return (
      <div className="row">
        <div className="requests">
          {requests.map(req => (
            <div
              className="request"
              onClick={() => this.setActiveRequest(req)}
              style={{
                background: (req == activeRequest ? "#1e80f0" : null),
                color: (req == activeRequest ? "white" : null)
              }}
            >
              {req.method}
            </div>
          ))}
        </div>

        {activeRequest &&
          <div className="row">
            <div className="json-wrapper">
              <ReactJson
                src={activeRequest.params}
                displayDataTypes={false}
                enableClipboard={false}
                name="params"
              />
            </div>

            <div className="json-wrapper">
              <ReactJson
                src={activeRequest.response}
                displayDataTypes={false}
                enableClipboard={false}
                name="response"
              />
            </div>
          </div>
        }
      </div>
    );
  }
}

export default App;
