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
      <div>
        {requests.map(req => (
          <div onClick={() => this.setActiveRequest(req)}>{req.method}</div>
        ))}

        {activeRequest &&
          <React.Fragment>
            <ReactJson
              src={activeRequest.params}
              displayDataTypes={false}
              name="params"
            />

            <ReactJson
              src={activeRequest.response}
              displayDataTypes={false}
              name="response"
            />
          </React.Fragment>
        }
      </div>
    );
  }
}

export default App;
