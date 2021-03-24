const { response } = require('express');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
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
morgan.token('req_body_content', function(req, res){
  return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req_body_content'));
//app.use(morgan('text'));

app.get('/info', (req, res) => {
    let today = new Date();
    res.send(`<h3>Phonebook has info for ${persons.length} people</h3>
              <h3>${today}</h3>`);
});

//Get all persons from the phonebook
app.get('/api/persons', (req, res) => {
    res.json(persons);
});

//Get a person from the phonebook by id
app.get('/api/persons/:id', (req, res) => {
  let id = Number(req.params.id);
  let person = persons.find(person => person.id === id);
  if(person){
    res.json(person);
  } else{
    res.status(404).end();
  }
});

//Add a new person to phonebook
app.post('/api/persons', (req, res) => {
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
});

//Remove a person from the phonebook
app.delete('/api/persons/:id', (req, res) => {
  let id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
