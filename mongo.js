const mongoose = require('mongoose')

// El código también asume que se le pasará la contraseña de las credenciales que creamos en MongoDB Atlas, como un parámetro de línea de comando. 
// Podemos acceder al parámetro de la línea de comandos así:
const password = process.argv[2]

const url = `mongodb+srv://mikefdez:${password}@fsopen.kjizgei.mongodb.net/?retryWrites=true&w=majority&appName=FSOpen`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// Código para generar una nueva entrada en la BBDD:
// const person = new Person({
//   name: 'Alejandro Magno',
//   number: '89234925',
// })

// Código para buscar todas las entradas en la BBDD:
// Person.find({}).then(result => {
//     result.forEach(person => {
//       console.log(person)
//     })
//     mongoose.connection.close()
//   })

if (process.argv.length<3) {
    console.log('No password given. Please, give password as argument.')
    process.exit(1)
} else if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log("Your phonebook has the following contacts:")
        result.forEach(person => {
            console.log(person.name, person.number)
        })
    mongoose.connection.close()
    })
} else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(result => {
        console.log(`Added ${person.name} with number ${person.number} to the phonebook.`)
        mongoose.connection.close()
        })
}

