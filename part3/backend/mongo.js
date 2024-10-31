const mongoose = require('mongoose')

if (process.argv.length < 3)
{
  console.log('give password as an argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@fullstackopen.lqhu4.mongodb.net/?retryWrites=true&w=majority&appName=fullStackOpen`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5)
{
  const newPerson = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  newPerson
    .save()
    .then(result => {
      const name = result.name
      const number = result.number
      console.log(`Added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
}
else
{
  Person
    .find({})
    .then(result => {
      console.log('Phonebook:')
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })

      mongoose.connection.close()
    })
}
