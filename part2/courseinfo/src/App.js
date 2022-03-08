const Header = ({ course, big }) => {
  if (big) {
    return <h1>{course.name}</h1>;
  } else {
    return <h3>{course.name}</h3>;
  }
};

const Total = ({ sum }) => <b>Total of {sum} exercises</b>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => (
  <>
    {parts.map(
      (
        part // to handle arbitrary number of Parts
      ) => (
        <Part part={part} />
      )
    )}
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

const App = () => {
  const courses = [
    {
      name: "Half Stack application development",
      id: 1,
      parts: [
        {
          name: "Fundamentals of React",
          exercises: 10,
          id: 1,
        },
        {
          name: "Using props to pass data",
          exercises: 7,
          id: 2,
        },
        {
          name: "State of a component",
          exercises: 14,
          id: 3,
        },
        {
          name: "Redux",
          exercises: 11,
          id: 4,
        },
      ],
    },
    {
      name: "Node.js",
      id: 2,
      parts: [
        {
          name: "Routing",
          exercises: 3,
          id: 1,
        },
        {
          name: "Middlewares",
          exercises: 7,
          id: 2,
        },
      ],
    },
  ];

  return (
    <>
      <Header course={{ name: "Web development curriculum" }} big={true} />
      {courses.map((course) => (
        <Course course={course} />
      ))}
    </>
  );
};

export default App;
