const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

// const password = process.argv[2]
// cpn .env como ya incluimos el password podemos dejar comentada la linea anterior.


// Middlewares. Using a predefined format string:
app.use(morgan('tiny'))
app.use(cors())

app.use(express.json()) 
// La línea anterior la necesitamos ya que es el json-parser de Express. 
// Sin json-parser, la propiedad body no estaría definida. El json-parser funciona para que tome los datos JSON de una solicitud, 
// los transforme en un objeto JavaScript y luego los adjunte a la propiedad body del objeto request antes de llamar al controlador de ruta.



app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})



// app.get('/info', (request, response) => {
//     const now = Date()
//     // Solo puede haber una declaración response.send()
//     response.send(`
//         <p>
//         Phonebook has info for ${Person.length} people
//         </p>
//         <br/>
//         <p>${now}</p>
//         `)
//   })

app.get('/api/persons/:id', (request, response, next) => {
    // const id = Number(request.params.id)
    // const person = persons.find(person => person.id === id)
    Person.findById(request.params.id)
      .then(person => {
        if (person) {
          response.json(person)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
      // .catch(error => {
      //   console.log(error)
      //   response.status(400).send({ error: 'malformatted id' })
      // })
  })

app.delete('/api/persons/:id', (request, response) => {
    // const id = Number(request.params.id)
    // persons = persons.filter(person => person.id !== id)
    Person.findByIdAndDelete(request.params.id).then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  
  })

// function getRandomArbitrary(min, max) {
//     return Math.floor(Math.random() * (max - min) + min);
//     }

// const generateId = () => {
//     const newId = persons.length > 0
//       ? getRandomArbitrary(persons.length + 1, 101)
//       : 1
//     return newId
//   }
  
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({ 
            error: 'content missing' 
        })
    }

    const person = new Person({
        // id: generateId(),
        name: body.name,
        number: body.number,
      })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// controlador de solicitudes con endpoint desconocido
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(errorHandler)


// persons = persons.concat(person)

    // } else if (persons.map(person => person.name).includes(body.name)) {
    //     return response.status(400).json({ 
    //         error: 'name must be unique' 
    //     })

// Setting the PORT and start the server:
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})