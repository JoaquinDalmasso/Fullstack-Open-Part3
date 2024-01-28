const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = "mongodb+srv://fullstack:123@fullstackopen.j10dt.mongodb.net/persons-app?retryWrites=true&w=majority"

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const peopleSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: Date,
  })

peopleSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', peopleSchema)