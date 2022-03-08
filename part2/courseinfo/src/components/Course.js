import React from "react";
import Header from "./Header"; // in same directory

const Total = ({ sum }) => <b>Total of {sum} exercises</b>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => (
  <>
    {parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </>
);

const Course = ({ course }) => {
  const calcSum = (parts) =>
    parts.reduce((sum, part) => {
      return sum + part.exercises;
    }, 0);

  return (
    <>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total sum={calcSum(course.parts)} />
    </>
  );
};

export default Course;
