import React from "react";
import PropTypes from "prop-types";
import ReactJson from "react-json-view";

const Json = ({ obj, name }) => (
  <div className="json-wrapper">
    <ReactJson
      src={obj}
      name={name}
      displayDataTypes={false}
      enableClipboard={false}
      displayObjectSize={false}
    />
  </div>
);

Json.propTypes = {
  obj: PropTypes.object,
  name: PropTypes.string,
};

export default Json;
