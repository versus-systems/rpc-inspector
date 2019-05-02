import React from "react";
import ReactJson from "react-json-view";
import Json from "./Json";

const Requests = ({ requests, activeRequest, onSelect }) => (
  <div className="requests">
    {requests.map(req => (
      <div
        style={{ color: req.success ? "#000" : "#f00" }}
        className={`request${req == activeRequest ? " active" : ""}`}
        onClick={() => onSelect(req)}
      >
        {req.method}
      </div>
    ))}
  </div>
);

export default Requests;
