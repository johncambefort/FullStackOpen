const Header = (props) => (
  <h1>{props.course}</h1>
);

const Part = (props) => {
  return (
    <p>
      {props.part} {props.exercises}
    </p>
  );
}

// const Content = (props) => {
//   return (
//     <div>
//       <Part part={props.part1.name} exercises={props.part1.exercises} />
//       <Part part={props.part2.name} exercises={props.part2.exercises} />
//       <Part part={props.part3.name} exercises={props.part3.exercises} />
//     </div>
//   );
// }

const Content = (props) => {
  return (
    <div>
      <Part part={props.parts[0].name} exercises={props.parts[0].exercises} />
      <Part part={props.parts[1].name} exercises={props.parts[1].exercises} />
      <Part part={props.parts[2].name} exercises={props.parts[2].exercises} />
    </div>
  );
}

const Total = (props) => (
  <p>
    Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}
  </p>
)

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}

export default App