const express = require('express')
const app = express()
const port = 4000

const cors = require('cors')
app.use(cors())

const routes = require('./routes/routes')
app.use('/', routes)

app.listen(port, () => {
    console.log(`Сервер работает: http://localhost:${port}`)
})