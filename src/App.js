import React from "react";
import ReactJson from "react-json-view";
import Requests from "./Requests";
import Json from "./Json";
import Error from "./Error";

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

    const json = JSON.parse(request.request.postData.text);
    const responseJson = request.getContent((c) => {
      const success = request.response.status < 400;
      let response;

      try {
        response = JSON.parse(c);
      } catch(e) {
        response = c;
      }

      const requestObj = {
        method: json.method,
        params: json.params,
        response: response,
        success: success,
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
          <div className="row json-row">
            <Json
              obj={activeRequest.params}
              name="params"
            />

            {activeRequest.success &&
              <Json
                obj={activeRequest.response}
                name="response"
              />
            }

            {!activeRequest.success &&
              <Error error={activeRequest.response} />
            }
          </div>
        }
      </div>
    );
  }
}

export default App;
