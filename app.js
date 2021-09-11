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

app.listen(port, () => {console.log(`Listening on Port: ${port}`)})
