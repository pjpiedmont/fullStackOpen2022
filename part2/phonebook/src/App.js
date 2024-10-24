import { useState, useEffect } from 'react'
import personService from './services/person'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const personsToShow =
    filter === ''
      ? persons
      : persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )

  const addPerson = (event) => {
    event.preventDefault()

    let existingPerson = persons.find((person) => person.name === newName)

    if (existingPerson && window.confirm(`${newName} is already in the phonebook. Do you want to update the phone number?`))
    {
      updatePerson(existingPerson, newNumber)
      return
    }
    
    const newPersonObject = {
      name: newName,
      number: newNumber,
    }

    personService
      .add(newPersonObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  const updatePerson = (person, number) => {
    const newPersonObject = {
      ...person,
      number: number
    }

    personService
      .update(newPersonObject.id, newPersonObject)
      .then(updatedPerson => {
        console.log(`person ${updatedPerson.name}'s phone number updated to ${updatedPerson.number}`)
        let newPersons = persons.map(person => person.id === updatedPerson.id ? updatedPerson : person)
        setPersons(newPersons)
        setNewName('')
        setNewNumber('')
      })
  }

  const removePerson = ({ id, name }) => {
    if (!window.confirm(`Delete ${name}?`))
    {
      return
    }

    if (!persons.find(person => person.id === id))
    {
      alert(`Error, ${name} is not in the list`)
      return
    }

    personService
      .remove(id)
      .then(res => {
        console.log(res)
        let newPersons = persons.filter(person => person.id !== id)
        setPersons(newPersons)
      })
  }

  const handleFormChange = (event) => {
    if (event.target.name === 'name') {
      setNewName(event.target.value)
      return
    }

    if (event.target.name === 'number') {
      setNewNumber(event.target.value)
      return
    }
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter text={filter} handleChange={handleFilterChange} />

      <h2>Add a New</h2>
      <PersonForm
        name={newName}
        number={newNumber}
        handleChange={handleFormChange}
        handleSubmit={addPerson}
      />

      <h2>Numbers</h2>
      <Persons
        persons={personsToShow}
        deleteHandler={removePerson}
      />
    </div>
  )
}

export default App
