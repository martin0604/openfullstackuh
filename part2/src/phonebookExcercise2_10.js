import React, { useState } from 'react';

const Filter = (props) => {
  const {filter, filterHandler} = props;
  return(
  <div>
      filter shown with: <input value={filter} onChange={filterHandler}/>
  </div>
  )
}

const PersonForm = (props) => {
  const {addName, name, phone, handleName, handlePhone} = props;
  return(
    <form onSubmit={addName}>
        <div>
          name: <input value={name} onChange={handleName}/><br/>
          number: <input value={phone} onChange={handlePhone}/>
        </div>
        <div>debug: {name}</div> 
        <div>
          <button type="submit">add</button>
        </div>
    </form>
  )
}

const Person = ({name, phone}) => {
    return(
      <div>
        <label>{name} {phone}</label><br/>
      </div>
    )
}

const App = () => {
  const [ persons, setPersons ] = useState([
    { name: 'Arto Hellas', phone: '3043787299' }
  ]); 
  const [ newName, setNewName ] = useState('');
  const [ newPhone, setNewPhone ] = useState('');
  const [ filteredPersons, setFilteredPersons ] = useState([
    { name: 'Arto Hellas', phone: '3043787299' }
  ]);
  const [filter, setFilter] = useState('');

  //New Name field handler
  const handleNewName = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  }

  //New Phone field handler
  const handleNewPhone = (event) => {
    setNewPhone(event.target.value);
  }

  const handleFilterField = (event) => {
    console.log(event.target.value);
    setFilter(event.target.value);
    setFilteredPersons(persons.filter(person => person.name.includes(event.target.value)));
    //console.log(persons.filter(person => person.name.includes(event.target.value)));
  }

  const addName = (event) => {
    event.preventDefault();
    const nameObject = {
     name: newName,
     phone: newPhone
    }
    
    if(persons.some(person => person.name === newName)){
    alert(`${newName} is already added to phonebook`);
    }else{
      setPersons(persons.concat(nameObject));
      setNewName('');
      setNewPhone('');
      setFilter('');
      setFilteredPersons(persons.concat(nameObject));
      //filteredPersons = persons;
    }
    
    console.log("Clicked on submit button", event.target);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} filterHandler={handleFilterField}/>      
      <h3>Add new Contact</h3>
      <PersonForm 
        addName={addName}
        name={newName}
        phone={newPhone}
        handleName={handleNewName}
        handlePhone={handleNewPhone}
      />
      <h2>Numbers</h2>
      { filteredPersons.map(person => 
        <Person name={person.name} phone={person.phone}/>
      )
      }
      ...
    </div>
  )
}

export default App
