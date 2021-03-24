import React from 'react';

const Part = ({name, exercises}) => {
    return (
          <div>
              <p>{name} {exercises}</p>
          </div>
      )
  }
  
  const Content = ({parts}) => {
    return (
      <div>
        {parts.map(part => <Part key={part.id} name={part.name} exercises={part.exercises}/>)}
      </div>
    )
  }
  
  const Header = (props) => {
    console.log(props.name);
    return <h1>{props.name}</h1>
  }
  
  const Course = ({ course }) => {
    const sumofexercises = course.parts.map(part => part.exercises).reduce((s,p) => {
      return s+p;
    });
    /*course.parts.forEach(element => {
      sumofexercises += element.exercises;
    });*/
  
    return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts}  />
      <div>Total of {sumofexercises} exercises</div>
    </div>
    )
  }

  export default Course;

  /* Content of App.js for exercises in section a of part 2

  import React from 'react';
import ReactDOM from 'react-dom';
import Course from  './components/Course';

const App = () => {
    const courses = [
    {
      id: 1,
      name: 'Half Stack application development',
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
    ];
  
    return (
      <div>
      {courses.map(course => 
      <Course key={course.id} course={course}/>
      )}
      </div>
    )
    //return <Course course={course} />
}

ReactDOM.render(<App />, document.getElementById('root'));


  */