import React from "react";
import Button from "./Button";

const Person = ({ person, onDelete }) => (
  <li>
    {person.name} {person.number} 
    <Button text={"delete"} onClick={onDelete} />
  </li>
);

export default Person;
