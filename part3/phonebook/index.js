const express = require('express')
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

app.use(express.json())
app.use(morgan(loggerFormat))

app.get('/api/persons', (req, res) => {
	res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find(p => p.id === id)

	// console.log(id, person)

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
	// console.log(req.body)

	if (!req.body.name || !req.body.number)
	{
		// console.log('bad request, missing name or number')
		res.status(400).json({error: 'bad request, missing name or number'})
		return
	}

	let person = persons.find(p => p.name === req.body.name)

	if (person)
	{
		// console.log('person already exists')
		res.status(409).json({error: 'person already exists'})
		return
	}

	const id = Math.floor(Math.random() * 1000)

	new_person = {
		id: id,
		...req.body
	}

	// console.log(new_person)

	persons.push(new_person)
	res.status(201).end()
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id)
	persons = persons.filter(p => p.id !== id)
	res.status(204).end()
})

app.get('/info', (req, res) => {
	// console.log(req)
	res_text = `
		<p>Phonebook has info for ${persons.length} people</p>
		<p>${new Date()}</p>
	`
	res.send(res_text)
})

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})