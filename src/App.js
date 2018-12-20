import React from "react";
import ReactJson from "react-json-view";

class App extends React.Component {
  state = {
    requests: [],
    activeRequest: null,
  }

  componentDidMount() {
    chrome.devtools.network.onRequestFinished.addListener(this.handleRequest);
    chrome.devtools.network.onNavigated.addListener(this.handleNavigation);
  }

  handleRequest = (request) => {
    const isRPC = request.request.url.substr(-4, 4) === "/rpc";
    const isPost = request.request.postData;
    const displayRequest = isRPC && isPost;

    if (!displayRequest) {
      return;
    }

    const json = JSON.parse(request.request.postData.text);
    const responseJson = request.getContent((c) => {
      const requestObj = {
        method: json.method,
        params: json.params,
        response: JSON.parse(c),
      };

      this.setState({ requests: [...this.state.requests, requestObj] });
    });
  }

  handleNavigation = () => this.setState({ requests: [], activeRequest: null });

  setActiveRequest = (req) => this.setState({ activeRequest: req })

  render() {
    const { requests, activeRequest } = this.state;

    return (
      <div className="row">
        <div className="requests">
          {requests.map(req => (
            <div
              className={`request${req == activeRequest ? " active" : ""}`}
              onClick={() => this.setActiveRequest(req)}
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
                displayObjectSize={false}
                name="params"
              />
            </div>

            <div className="json-wrapper">
              <ReactJson
                src={activeRequest.response}
                displayDataTypes={false}
                enableClipboard={false}
                displayObjectSize={false}
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
