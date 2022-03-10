import React from "react";
import Button from "./Button";

const Person = ({ person, onDelete }) => (
  <li>
    {person.name} {person.phone} 
    <Button text={"delete"} onClick={onDelete} />
  </li>
);

export default Person;
