import React from "react";

const Header = ({ course, big }) => {
  if (big) {
    return <h1>{course.name}</h1>;
  } else {
    return <h3>{course.name}</h3>;
  }
};

export default Header;
