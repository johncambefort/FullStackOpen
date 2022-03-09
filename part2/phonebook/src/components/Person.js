import React from "react";

const Person = ({ person, onClick }) => (
  <li>
    {person.name} {person.phone}
  </li>
);

export default Person;
