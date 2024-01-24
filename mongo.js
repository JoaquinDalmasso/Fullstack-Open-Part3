const mongoose = require('mongoose')
if (process.argv.length < 6 && process.argv.length > 3) {

  const password = process.argv[2]
  const personName = process.argv[3]
  const personNumber = process.argv[4]

  const url = 
    `mongodb+srv://fullstack:${password}@fullstackopen.j10dt.mongodb.net/persons-app?retryWrites=true&w=majority`

  mongoose.connect(url)

  const peopleSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: Date,
  })

  const Person = mongoose.model('Person', peopleSchema)

  const people = new Person({
    name: personName,
    number: personNumber,
    date: new Date()
  })

  people.save().then(result => {
    console.log(`added ${personName} number ${personNumber} to phonebook`)
    mongoose.connection.close()
  })
  }
else if(process.argv.length == 3){
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

  console.log("phonebook")
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name + " " + person.number)
    })
    mongoose.connection.close()
  })
}
else{
  console.log('Please provide the password as an argument: node mongo.js <password> or node mongo.js <password> <name> <number> if you want to add a person')
  process.exit(1)
}

// const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//   console.log('Please provide the password as an argument: node mongo.js <password>')
//   process.exit(1)
// }

// const password = process.argv[2]

// const url =
//   `mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`

// mongoose.connect(url)

// const noteSchema = new mongoose.Schema({
//   content: String,
//   date: Date,
//   important: Boolean,
// })

// const Note = mongoose.model('Note', noteSchema)

// const note = new Note({
//   content: 'HTML is Easy',
//   date: new Date(),
//   important: true,
// })

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })