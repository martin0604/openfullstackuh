const { response } = require('express');
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

let persons = [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      },
      {
        "name": "Disney Santos",
        "number": "3154143630",
        "id": 5
      }
];

app.use(express.json());
app.use(cors());
app.use(express.static('build'));
morgan.token('req_body_content', function(req, res){
  return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req_body_content'));
//app.use(morgan('text'));

app.get('/info', (req, res) => {
    let today = new Date();
    Person.countDocuments({}).then(count =>{
      res.send(`<h3>Phonebook has info for ${count} people</h3>
              <h3>${today}</h3>`);
    })
    .catch(error => {
      console.log(error);
      res.status(500);
    });
});

//Get all persons from the phonebook
/*app.get('/api/persons', (req, res) => {
    res.json(persons);
});*/
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons);
  });
});

//Get a person from the phonebook by id
/*app.get('/api/persons/:id', (req, res) => {
  let id = Number(req.params.id);
  let person = persons.find(person => person.id === id);
  if(person){
    res.json(person);
  } else{
    res.status(404).end();
  }
});*/

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person =>{
    if(person) { //If person is not null or undefined which means it exists in the database
      res.json(person);
    } else{
      res.status(404).end();
    }
  })
  .catch(error => {
    console.log(error);
    res.status(400).send({error:'Malformatted id'});
  });
});

//Add a new person to phonebook
/*app.post('/api/persons', (req, res) => {
  const body = req.body;
  //const maxId = persons.length > 0 ? Math.max(...persons.map(person => person.id)):0;
  if(!body.name || !body.number){
    res.status(409).json({error: "Name or number is missing"});
  } else if(persons.some((element) => element.name === req.body.name)){
    res.status(409).json({error: "Name must be unique"});
  } else{
    const person = req.body;
    //person.id = maxId+1;
    person.id = Math.floor((Math.random() * (1000 - 1) + 1));
    persons = persons.concat(person);
    res.json(person);
  }
});*/

app.post('/api/persons', (req, res, next) => {
  const body = req.body;
  if(!body.name || !body.number){
    return response.status(400).json({error: 'Name or number is missing!'});
  }

  const person = new Person({
    name:body.name ,
    number: body.number
  });

  person.save().then(newPerson => {
    console.log(`Added ${body.name} number ${body.number} to phonebook`);
    res.json(newPerson);
  })
  .catch(error => next(error));
});

//Remove a person from the phonebook
/*app.delete('/api/persons/:id', (req, res) => {
  let id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});*/
app.delete('/api/persons/:id', (req, res, next) =>{
  let id = Number(req.params.id);
  Person.findByIdAndRemove(id).then(result =>{
    response.status(204).end();
  })
  .catch(error => next(error));
});

//Update a person's name when a PUT request is sent to the server
app.put('/api/persons/:id', (req, res, next) =>{
  const body = req.body;
  const person = {
    name: body.name,
    number: body.number 
  }

  Person.findByIdAndUpdate(req.params.id, person, {new: true})
  .then(updatedPerson => {
    console.log(`Modified ${person.name} with new number ${person.number}`);
    res.json(updatedPerson);
  })
  .catch(error => next(error));
});

const errorHandler = (error, req, res, next) =>{
  console.error(error.message);
  if(error.name === 'CastError'){
    return res.status(400).send({error:'Malformatted id'});
  } else if(error.name === 'ValidationError'){
    return res.status(400).json({error: error.message});
  }
  next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
