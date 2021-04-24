import React, { useState, useEffect } from 'react';
import phoneService from './services/phonebook';

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

const Person = ({id, name, phone, deleteHandler}) => {
    return(
      <div>
        <label>{name} {phone}</label><button onClick={() => deleteHandler(id)}>Delete</button><br/>
      </div>
    )
}

const Notification = ({message, type}) => {
    
  if(message == ''){
      return null;
  }

  return (
      <div className={type}>
      {message}
      </div>
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([]); 
  const [ newName, setNewName ] = useState('');
  const [ newPhone, setNewPhone ] = useState('');
  const [ filteredPersons, setFilteredPersons ] = useState([]);
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState({message:'', type:''});

  useEffect(() =>{
    phoneService.getAll().then(response => {
      console.log("Promise fulfilled");
      setPersons(response.data);
      setFilteredPersons(response.data);
    });
  }, []);
  
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

  const deleteButton = (id) => {
    if(window.confirm("Do you really want to delete this person from phonebook?")){
      phoneService.deletePerson(id).then(response =>{
        console.log("Person deleted:", response);
        setNewName('');
        setNewPhone('');
        setPersons(persons.filter((element) => element.id != id));
        setFilteredPersons(persons.filter((element) => element.id != id));
        let newMessage = {message:`Record was deleted from phonebook.`, type:'successful'}
        setMessage(newMessage);
        setTimeout(() => {
            setMessage({message:'', type:''});
        }, 5000);
      });
    }  
  }

  const addName = (event) => {
    event.preventDefault();
    const nameObject = {
     name: newName,
     number: newPhone
    }
    
    if(persons.some(person => person.name === newName)){
    if(window.confirm(`${newName} is already added to phonebook. Replace the old number with a new one?`)){
      let id = persons.find(element => element.name === newName).id;
      phoneService.update(id, nameObject).then(response => {
        setNewName('');
        setNewPhone('');
        setFilter('');
        let updatedPersons = persons.map(element => {
          if(element.name == newName){
              let updatedObject = {
                ...element,
                number : newPhone
              }
              return updatedObject;
          } else{
              return element;
          }
        });
        setPersons(updatedPersons);
        setFilteredPersons(updatedPersons);
        let newMessage = {message:`'${newName}' was updated in phonebook.`, type:'successful'}
        setMessage(newMessage);
        setTimeout(() => {
            setMessage({message:'', type:''});
        }, 5000);
      }).catch(error => {
        let newMessage = {message:`The record you tried to delete has already been deleted from server.`, type:'error'}
        setMessage(newMessage);
        setTimeout(() => {
            setMessage({message:'', type:''});
        }, 5000);
        setPersons(persons.filter(person => person.id != id));
        setFilteredPersons(persons.filter(person => person.id != id));
      });
    }
    }else{
      setPersons(persons.concat(nameObject));
      setNewName('');
      setNewPhone('');
      setFilter('');
      setFilteredPersons(persons.concat(nameObject));
      //filteredPersons = persons;
      phoneService.create(nameObject).then(response => {
        console.log("New contact added to phonebook:", response);
        let newMessage = {message:`'${newName}' was added to phonebook.`, type:'successful'}
        setMessage(newMessage);
        setTimeout(() => {
            setMessage({message:'', type:''});
        }, 5000);
      }).catch(error => {
        setMessage({message:error.response.data.error, type:'error'});
        setTimeout(() => {
          setMessage({message:'', type:''});
      }, 5000);
        console.log("Error al intentar agregar:",error.response.data.error);
      });
    }
    
    console.log("Clicked on submit button", event.target);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message.message} type={message.type}/>
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
        <Person key={person.id} id={person.id} name={person.name} phone={person.number} deleteHandler={deleteButton}/>
      )
      }
      ...
    </div>
  )
}

export default App

