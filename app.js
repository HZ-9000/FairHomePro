const express = require('express')
const app = express()
const port = 3000

//static files
app.use(express.static('public'))
app.use(express.json())
app.use("/css", express.static(__dirname + 'public/css'))

app.set('view engine', 'ejs')

app.get('', (req, res) => {
  res.render("index")
})

app.get('/login', (req, res) => {
  res.render("login")
})

app.get('/register', (req, res) => {
  res.render("register")
})

app.get('/services', (req, res) => {
  res.render("services")
})

app.listen(port, () => {console.log(`Listening on Port: ${port}`)})
