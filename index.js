const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const password = process.argv[2]
const url = 
    `mongodb+srv://fullstack:${password}@fullstackopen.j10dt.mongodb.net/persons-app?retryWrites=true&w=majority`

mongoose.connect(url)

const peopleSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date,
})

const Person = mongoose.model('Person', peopleSchema)

morgan.token('postData', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return '';
})

app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))
app.use(express.json())
app.use(cors())

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
      "name": "Jack Sparrow",
      "number": "12345",
      "id": 5
    }
  ]


  app.get('/info', (req, res) => {
    const date = new Date()
    res.send(`
    <div>
    <p>Phonebook has info for ${persons.length} people <br> ${date}</p>
    </div>`)
    //Otra forma:
    //res.send(
    //            `
    //<div>
    //<p>Phonebook has info for ${persons.length} people</p>
    //</div>
    //<div>
    //<p>${date})</p>
    //</div>` 
    //)
  })

  app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
    res.json(persons)
    })
  })
  
  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })
  
  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
  
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  
  })
  
  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })
  
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })