import React from "react";

const Notification = ({ text }) => {
  if (text === null) {
    return null;
  }

  return <div className="added">{text}</div>;
};

export default Notification;