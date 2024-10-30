const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

let persons = [
	{ 
		"id": 1,
		"name": "Arto Hellas", 
		"number": "040-123456"
	},
	{ 
		"id": 2,
		"name": "Ada Lovelace", 
		"number": "39-44-5323523"
	},
	{ 
		"id": 3,
		"name": "Dan Abramov", 
		"number": "12-43-234345"
	},
	{ 
		"id": 4,
		"name": "Mary Poppendieck", 
		"number": "39-23-6423122"
	}
]

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

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(loggerFormat))

app.get('/api/persons', (req, res) => {
	res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find(p => p.id === id)

	if (person)
	{
		res.json(person)
	}
	else
	{
		res.status(404).end()
	}
})

app.post('/api/persons', (req, res) => {
	if (!req.body.name || !req.body.number)
	{
		res.status(400).json({error: 'bad request, missing name or number'})
		return
	}

	let person = persons.find(p => p.name === req.body.name)

	if (person)
	{
		res.status(409).json({error: 'person already exists'})
		return
	}

	const id = Math.floor(Math.random() * 1000)

	new_person = {
		id: id,
		...req.body
	}

	console.log('added person:', new_person)

	persons.push(new_person)
	res.status(201).json(new_person)
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	persons = persons.filter(p => p.id !== id)
	res.status(204).end()
})

app.get('/info', (req, res) => {
	res_text = `
		<p>Phonebook has info for ${persons.length} people</p>
		<p>${new Date()}</p>
	`
	res.send(res_text)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})