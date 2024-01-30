const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const peopleSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: [3,'The name is shorter than the minimum allowed length (3)'],
      unique: true
    },
    number: {
    type: String,
    minlength: [8,'The number is shorter than the minimum allowed length (8)'],
    required: true,
  },
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