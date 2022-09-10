const express = require('express')
const app = express()

const bodyParser = require('body-parser')

const cors = require('cors')
app.use(cors())
app.use(bodyParser.json())

const routes = require('./routes/routes')
app.use('/', routes)

app.listen(process.env.PORT || 4000, () => {
    console.log(`Сервер работает: http://localhost:${process.env.PORT || 4000}`)
})
