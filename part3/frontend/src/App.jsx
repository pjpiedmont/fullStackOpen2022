import { useState, useEffect } from 'react'
import personService from './services/person'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import PersonList from './components/PersonList'
import Notification from './components/Notification'

import './index.css'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')
    const [successMessage, setSuccessMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    const personsToShow =
        filter === ''
            ? persons
            : persons.filter((person) =>
                person.name.toLowerCase().includes(filter.toLowerCase())
            )

    const addPerson = (event) => {
        event.preventDefault()

        let existingPerson = persons.find((person) => person.name === newName)

        if (existingPerson && window.confirm(`${newName} is already in the phonebook. Do you want to update the phone number?`)) {
            updatePerson(existingPerson, newNumber)
            return
        }

        const newPersonObject = {
            name: newName,
            number: newNumber,
        }

        console.log(newPersonObject)

        personService
            .add(newPersonObject)
            .then(returnedPerson => {
                console.log(returnedPerson)
                
                setPersons(persons.concat(returnedPerson))

                setNewName('')
                setNewNumber('')

                setSuccessMessage(`${newName} was successfully added to the phonebook.`)
                setTimeout(() => {
                    setSuccessMessage(null)
                }, 5000)
            })
            .catch(err => {
                setErrorMessage(`${newName} could not be added to the phonebook. Error message: ${err}`)
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)
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

                setSuccessMessage(`${updatedPerson.name}'s phone number was successfully updated.`)
                setTimeout(() => {
                    setSuccessMessage(null)
                }, 5000)
            })
            .catch(err => {
                setErrorMessage(`${newName}'s phone number could not be updated. Error message: ${err}`)
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)
            })
    }

    const removePerson = (id, name) => {
        if (!window.confirm(`Delete ${name}?`)) {
            return
        }

        if (!persons.find(person => person.id === id)) {
            setErrorMessage(`${name} is not in the phonebook.`)
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
            return
        }

        personService
            .remove(id)
            .then(res => {
                console.log(res)
                let newPersons = persons.filter(person => person.id !== id)
                setPersons(newPersons)

                setSuccessMessage(`${name} was successfully removed from the phonebook.`)
                setTimeout(() => {
                    setSuccessMessage(null)
                }, 5000)
            })
            .catch(err => {
                setErrorMessage(`${name} could not be removed from the phonebook. Error message: ${err}`)
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)
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
            <Notification
                message={successMessage}
                type="success"
            />
            <Notification
                message={errorMessage}
                type="error"
            />
            <Filter
                text={filter}
                handleChange={handleFilterChange}
            />

            <h2>Add a New</h2>
            <PersonForm
                name={newName}
                number={newNumber}
                handleChange={handleFormChange}
                handleSubmit={addPerson}
            />

            <h2>Numbers</h2>
            <PersonList
                persons={personsToShow}
                deleteHandler={removePerson}
            />
        </div>
    )
}

export default App
