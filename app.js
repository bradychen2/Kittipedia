const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('app is running')
})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})