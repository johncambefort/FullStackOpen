import React from "react";

const Notification = ({ text }) => {
  if (text === null) {
    return null;
  } else if (text.includes("Error")) {
    return <div className="error">{text}</div>;
  }

  return <div className="added">{text}</div>;
};

export default Notification;
