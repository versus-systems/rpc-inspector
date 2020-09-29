# RPC Network Inspector

## About
The RPC Network Inspector is a React Devtools extension optimized for RPC network requests
![Alt](images/demo.png "Demo")


## Installation

1. `npm install`
2. `npm run build`
3. Visit `chrome://extensions/`, turn on Developer Mode, click the "Load Unpacked" button, and select the `release` folder of this project


## Development

1. Run all steps in `Installation` above
2. Run `npm watch` to listen for changes to any javascript files in `src` and automatically re-build
3. After making changes and building, you will need to right-click the RPC Inspector window in Chrome and select "Reload Frame"


## Releasing

1. Update the version number in `release/manifest.json`
1. Run `npm run release` to create a zip file `release.zip`
2. Upload the zip file in the Chrome Web Store Developer Dashboard
