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
//collections
const User = require('./models/Users')
const Bank = require('./models/Bank')
const Home = require('./models/Home')
const Area = require('./models/Areas')
const Complaint = require('./models/Complaints')
const Contract = require('./models/Contracts')
const License = require('./models/License')
const Service = require('./models/Services')
const Specialtie = require('./models/Specialties')

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
  saveUninitialized: true,
  cookie: {maxAge: 60 * 60 * 100 }
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
  successRedirect: '/notifications',
  failureRedirect: '/login',
  failureFlash: true,
  session: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render("register")
})

app.post('/register', async(req, res) => {
  try {

    User.find()

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    var name ="";
    var email ="";
    var type ="";
    var phone ="";
    var address ="";
    //---------insert data base------------
    if(req.body.info_switch ? true : false) {
      //BuisnessOwner
      name = req.body.BuisnessName;
      email= req.body.BuisnessEmail;
      type= "BuisnessOwner";
      phone= req.body.BuisnessPhone;
      address= req.body.BuisnessAddress;

      //add new services

      //add service areas
      if(typeof req.body.areas == 'object' && req.body.areas != null){
        req.body.areas.forEach(temp => {
          const area = new Area({
            email: email,
            ServiceArea: temp
          })

          area.save();
          console.log("saved areas ");
        });
      }
      else if(req.body.areas != null){
        const area = new Area({
          email: email,
          ServiceArea: req.body.areas
        })
        console.log("saved areas ");
        area.save();
      }

      //add licenses
      if(typeof req.body.licenses == 'object' && req.body.licenses != null){
        req.body.licenses.forEach(temp => {
          const license = new License({
            email: email,
            LicenseName: temp
          })
          console.log("saved licenses ");
          license.save();
        });
      } else if(req.body.licenses != null){
        const license = new License({
          email: email,
          LicenseName: req.body.licenses
        })

        license.save();
      }
      //add specialties
      if(typeof req.body.specialties == 'object' && req.body.specialties != null){
      req.body.specialties.forEach(temp => {
        const specialtie = new Specialtie({
          email: email,
          SpecialtieName: temp
        })
        console.log("saved specialties ");
        specialtie.save();
      });
    } else if(req.body.specialties != null){
      const specialtie = new Specialtie({
        email: email,
        SpecialtieName: req.body.specialties
      })

      specialtie.save();
    }
      console.log("Business")
    }
    else {
      //Home Owner
      name = req.body.name;
      email= req.body.email;
      type= "HomeOwner";
      phone= req.body.phone;
      address= req.body.PrimaryAddress;

      const home = new Home({
        email: req.body.email,
        typeOfHome: req.body.HomeType,
        sqft: req.body.Sqft,
        floors: req.body.Floors,
        consType: req.body.ConsType,
        yardSize: req.body.YardSize,
        plants: req.body.plants,
        address: req.body.HomeAddress
      })

      home.save()
      console.log("home owner")
    }

    const user = new User({
      name: name,
      email: email,
      phone: phone,
      password: hashedPassword,
      typeOfUser: type,
      PrimaryAddress: address
    })

    user.save()
    console.log("save successful")

    const creditcard = await bcrypt.hash(req.body.CreditCard, 10)
    const cvv = await bcrypt.hash(req.body.CVV, 10)
    const zipcode = await bcrypt.hash(req.body.Zipcode, 10)
    if(req.body.PIN != null){
      const pin1 = await bcrypt.hash(req.body.PIN, 10);
    }else{
      const pin1 = null;
    }

    const bank = new Bank({
      email: email,
      creditcard: creditcard,
      exp: req.body.exp,
      cvv: req.body.CVV,
      zipcode: req.body.Zipcode,
      pin: req.body.PIN
    })

    bank.save()

    console.log("save successful")

    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

//------------Main user hub-----------------

app.get('/services', checkAuthenticated, (req, res) => {
  Service.find()
    .then((result) => {
      res.render("services",{name: req.user.name, type: req.user.typeOfUser, services: result})
    })
    .catch((err) => {
      condole.log(err)
    })
})

app.post('/services', checkAuthenticated, (req, res) => {
  Contract.find({date: req.body.date, time: req.body.time})
    .then((result) => {
      if(result.date == req.body.date){
        window.alert("Date Taken");
      }else{
        const contract = new Contract({
          EmailBuisness: req.body.provider,
          EmailHome: req.user.email,
          TypeOfService: req.body.service,
          status: 'pending',
          price: req.body.price,
          unit: req.body.unit,
          date: req.body.date,
          time: req.body.time
        })

        contract.save();

        res.redirect('/services');
      }
    })
    .catch((err) => {

    })
})

app.get('/settings', checkAuthenticated, (req, res) => {
  res.render("settings",{name: req.user.name, type: req.user.typeOfUser})
})

app.get('/complaints', checkAuthenticated, (req, res) => {
  res.render("complaints",{name: req.user.name, type: req.user.typeOfUser,})
})

app.post('/complaints', checkAuthenticated, (req, res) => {
    User.find({name : req.body.BuisnessName})
    .then((result) => {
      const complaint = new Complaint({
        RecipiantEmail: req.body.BuisnessName,
        SenderEmail: req.user.email,
        Description: req.body.Complaint_des,
        status: 'unresolved'
      })

      complaint.save();
      res.redirect('/services');
    })
    .catch((err) => {
      window.alert(err);
      res.redirect('/complaints');
    })
})

app.get('/notifications', checkAuthenticated, (req, res) => {
  if(req.user.typeOfUser == 'HomeOwner'){
    Contract.find({ EmailHome: req.user.email })
      .then((result) => {
        res.render("notifications",{name: req.user.name, type: req.user.typeOfUser, contracts: result})
      })
      .catch((err) => {
        console.log(err)
      })
  } else {
    Contract.find({ EmailBuisness: req.user.email })
      .then((result) => {
        res.render("notifications",{name: req.user.name, type: req.user.typeOfUser, contracts: result})
      })
      .catch((err) => {
        console.log(err)
      })
  }
})

app.post('/notifications', checkAuthenticated, (req, res) => {
  if(req.body.accept == 'on'){
    Contract.findOneAndUpdate({ EmailBuisness: req.user.email, date: req.body.date , time: req.body.time },{ status: "Accepted" }, (error, data) => {
      if(error){
        console.log(error)
      }else{
        console.log(data)
      }
    })
  }else {
    Contract.findOneAndUpdate({ EmailBuisness: req.user.email, date: req.body.date, time: req.body.time },{ status: "Declined" }, (error, data) => {
      if(error){
        console.log(error)
      }else{
        console.log(data)
      }
    })
  }

  res.redirect('/notifications');
})

app.get('/add_services', checkAuthenticated, (req, res) => {
  Service.find({email: req.user.email})
    .then((result) => {
      res.render("add_services",{name: req.user.name, type: req.user.typeOfUser, services: result})
    })
    .catch((err) => {
      console.log(err)
    })
})

app.post('/add_services', checkAuthenticated, (req, res) => {
  const service = new Service({
    email: req.user.email,
    TypeOfService: req.body.service_name,
    pricePerUnit: req.body.price,
    unit: req.body.unit,
    Description: req.body.service_des
  })

  service.save();

  res.redirect('/add_services');
})

app.get('/logout', checkAuthenticated, (req, res) => {
  req.logout()
  res.redirect('/login')
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
