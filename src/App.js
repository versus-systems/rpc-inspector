import React from "react";

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
          <div>{JSON.stringify(activeRequest.params)}</div>
        }


        {activeRequest &&
          <div>{JSON.stringify(activeRequest.response)}</div>
        }
      </div>
    );
  }
}

export default App;
