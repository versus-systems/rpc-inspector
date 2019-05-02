import React from "react";
import PropTypes from "prop-types";

const Error = ({ error }) => (
  <div className="json-wrapper error">
    {error}
  </div>
);

Error.propTypes = {
  error: PropTypes.string,
};

export default Error;
