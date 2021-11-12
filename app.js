if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
//----------------Setup-------------------
const express = require('express')
const app = express()
const port = 3000
app.use(express.static('public'))
app.use(express.json())
app.use("/css", express.static(__dirname + 'public/css'))
app.set('view engine', 'ejs')

//----------------MongoDB-------------------
const mongoose = require('mongoose')
const User = require('./models/Users')
const Bank = require('./models/Bank')
const Home = require('./models/Home')
const dbURI = process.env.DBURI
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => app.listen(port, () => {console.log(`Listening on Port: ${port}`)}))
  .catch((err) => console.log(err))

//----------------Login---------------------
const passport = require('passport')
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')
const initializePassport = require('./public/js/login.js')

initializePassport(
  passport,
  email => User.find({email : email}).then(result => result[0]),
  id => User.find({_id : id}).then(result => result[0])
)

app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

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
  res.render("register")
})

app.post('/register', async(req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    var name ="";
    var email ="";
    var type ="";
    var phone ="";
    //---------insert data base------------
    if(req.body.info_switch ? true : false) {
      //BuisnessOwner
      name = req.body.BuisnessName;
      email= req.body.BuisnessEmail;
      type= "BuisnessOwner";
      phone= req.body.BuisnessPhone;

      console.log("Business")
    }
    else {
      //Home Owner
      name = req.body.name;
      email= req.body.email;
      type= "HomeOwner";
      phone= req.body.phone;

      const home = new Home({
        email: req.body.email,
        typeOfHome: req.body.HomeType,
        sqft: req.body.Sqft,
        floors: req.body.Floors,
        consType: req.body.ConsType,
        yardSize: req.body.YardSize
      })

      home.save()
      console.log("home owner")
    }

    const user = new User({
      name: name,
      email: email,
      phone: phone,
      password: hashedPassword,
      typeOfUser: type
    })

    user.save()
    console.log("save successful")

    const bank = new Bank({
      email: req.body.email,
      creditcard: req.body.CreditCard,
      exp: req.body.exp,
      cvv: req.body.CVV,
      zipcode: req.body.Zipcode,
    })

    bank.save()

    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
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

app.get('/notifications', checkAuthenticated, (req, res) => {
  res.render("notifications",{name: req.user.name})
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
