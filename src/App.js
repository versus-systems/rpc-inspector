import React from "react";
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
    const isPost = request.request.method === "POST";
    const displayRequest = isRPC && isPost;

    if (!displayRequest) {
      return;
    }

    const { status } = request.response;
    const success = status > 0 && status < 400;
    const { method, params } = JSON.parse(request.request.postData.text);

    const responseJson = request.getContent((content) => {
      let response = this.formatResponse(content, request.response);
      const requestObj = { method, params, response, success };

      this.setState({ requests: [...this.state.requests, requestObj] });
    });
  }

  formatResponse = (content, response) => {
    if (content) {
      try {
        return JSON.parse(content);
      } catch(e) {
        return { error: "Unable to parse response from server" };
      }
    } else if (response._error) {
      return { error: response._error };
    } else {
      return { error: "Unable to parse response from server" };
    }
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
          <div className="row json-row">
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
