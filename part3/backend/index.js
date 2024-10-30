require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const Person = require('./models/person')

const app = express()

morgan.token('body', (req, res) => {
	if (Object.keys(req.body).length > 0)
	{
		return JSON.stringify(req.body)
	}
	else
	{
		return ''
	}
})

const loggerFormat = (tokens, req, res) => {
	return [
		tokens.method(req, res),
		tokens.url(req, res),
		tokens.status(req, res),
		tokens.res(req, res, 'content-length'), '-',
		tokens['response-time'](req,res), 'ms',
		tokens.body(req, res),
	].join(' ')
}

const errorHandler = (err, req, res, next) => {
	console.error(err.message)

	if (err.name === 'CastError')
	{
		return res.status(400).send({error: 'malformed ID'})
	}

	next(error)
}

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(loggerFormat))

app.get('/api/persons', (req, res, next) => {
	Person.find({}).then(persons => {
		res.json(persons)
	})
})

app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id)
		.then(person => {
			if (person)
			{
				res.json(person)
			}
			else
			{
				res.status(404).end()
			}
		})
		.catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
	const body = req.body

	if (!body.name || !body.number)
	{
		return res.status(400).json({error: 'bad request, missing name or number'})
	}

	const newPerson = new Person({
		name: body.name,
		number: body.number
	})

	newPerson.save().then(savedPerson => {
		res.status(201).json(savedPerson)
	})

	// TODO: Handle duplicate person
})

app.put('/api/persons/:id', (req, res, next) => {
	const body = req.body

	const newPerson = {
		name: body.name,
		number: body.number
	}

	Person.findByIdAndUpdate(req.params.id, newPerson, {new: true})
		.then(updatedPerson => {
			res.json(updatedPerson)
		})
		.catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndDelete(req.params.id)
		.then(result => {
			res.status(204).end()
		})
		.catch(err => next(err))
})

app.get('/info', (req, res, next) => {
	Person.find({}).then(persons => {
		res_text = `
			<p>Phonebook has info for ${persons.length} people</p>
			<p>${new Date()}</p>
		`
		res.send(res_text)
	})
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})