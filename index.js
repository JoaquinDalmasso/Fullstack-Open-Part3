require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

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

let persons = []

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
  
    const person = new Person({
      name: body.name,
      number: body.number,
      id: generateId(),
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })
  
  app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
    .then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
  })
  
  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })
  
  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })