if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const bcrypt = require('bcrypt')
const initializePassport = require('./public/js/login.js')
const app = express()
const port = 3000
const login_succesful = false;
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const mongoose = require('mongoose')
const User = require('./models/Users')
const dbURI = process.env.DBURI
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => app.listen(port, () => {console.log(`Listening on Port: ${port}`)}))
  .catch((err) => console.log(err))
//temporary
const users = []

initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

//static files
app.use(express.static('public'))
app.use(express.json())
app.use("/css", express.static(__dirname + 'public/css'))
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.set('view engine', 'ejs')

//------------general site---------------------

app.get('/', checkNotAuthenticated, (req, res) => {
  res.render("index")
})

app.get('/about',checkNotAuthenticated, (req, res) => {
  res.render("about")
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render("login")
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/services',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render("register",{login_succesful})
})

app.post('/register', async(req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    //---------insert data base------------
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })

    user.save()

    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
  console.log(users)
})

//------------Main user hub-----------------

app.get('/services', checkAuthenticated, (req, res) => {
  res.render("services",{name: req.user.name})
})

app.get('/settings', checkAuthenticated, (req, res) => {
  res.render("settings",{name: req.user.name})
})

app.get('/complaints', checkAuthenticated, (req, res) => {
  res.render("complaints",{name: req.user.name})
})

//---------authentication checks--------------

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/services')
  }

  next()
}
