import React from "react";
import ReactJson from "react-json-view";
import Requests from "./Requests";
import Json from "./Json";

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
        <Requests
          requests={requests}
          activeRequest={activeRequest}
          onSelect={this.setActiveRequest}
        />

        {activeRequest &&
          <div className="row">
            <Json
              obj={activeRequest.params}
              name="params"
            />

            <Json
              obj={activeRequest.response}
              name="response"
            />
          </div>
        }
      </div>
    );
  }
}

export default App;
