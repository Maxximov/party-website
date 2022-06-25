const express = require("express")
const bcrypt = require("bcrypt")
const { sessionChecker } = require("../middleware/auth")
const User = require("../models/users")
const Party = require("../models/party")

const saltRounds = 10 
const router = express.Router()


router.get("/", sessionChecker, (req, res) => {  
  res.redirect("/login")
})


router
  .route("/signup")

  .get((req, res) => {
    if (req.session.user) {
      res.redirect("/homepage")
    } else {
      res.render("signup")
    }
  })

  .post(async (req, res, next) => {
    try {
      const { username, email, password } = req.body
      const user = new User({
        username,
        email,
        password: await bcrypt.hash(password, saltRounds)
      })
      await user.save()

      req.session.user = user 
      res.redirect("/homepage")
    } catch (error) {
      next(error)
    }
  })

router
  .route("/login")

  .get(sessionChecker, (req, res) => {
    res.render("login")
  })

  .post(async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = user 
      res.redirect("/homepage")
    } else {
      res.redirect("/login")
    }
  })

router.get("/homepage", async (req, res) => {
  if (req.session.user) {
    const card = await Party.find()
    const { user } = req.session
    res.render("homepage", { name: user.username, card })
  } else {
    res.redirect("/login")
  }
})

router.get("/logout", async (req, res, next) => {
  if (req.session.user) {
    try {
      await req.session.destroy()
      res.clearCookie("user_sid")
      res.redirect("/")
    } catch (error) {
      next(error)
    }
  } else {
    res.redirect("/login")
  }
})

router.get("/account", async (req, res) => {
  const card = await Party.find()
  if (req.session.user) {
    const { user } = req.session
    res.render("account", { name: user.username, card})
  } else {
    res.redirect("/login")
  }
})

router.get("/hostaparty", (req, res) => {

  if (req.session.user) {
    const { user } = req.session
    res.render("hostaparty", { name: user.username })
    
  } else {
    res.redirect("/login")
  }
})

router.post('/hostaparty', async function (req, res) {
  let {description, partyname, location, startsat, endsat} = req.body;
  Party.create({
    partyname,
    location,
    startsat,
    endsat,
    description,
  })
  res.redirect("/account")
})

router.delete('/party/delete/:id', async function (req, res) {
  console.log(req.params.id);
  await Party.deleteOne({_id:req.params.id}) 
  res.redirect("/account")
}) 

router.get("/party/edit/:id", async (req, res) => {
  const mybestitem = await Party.findOne({_id: req.params.id})
  res.render("edit", {_id: req.params.id, mybestitem})
})

router.post('/party/edit', async (req, res) => {
  const {mypartyname, mylocation,  mystartsat, myendsat, mydescription, _id} = req.body
  console.log(req.body)
 const editparty = await Party.findOne({_id})
  editparty.partyname = req.body.partyname
  editparty.location = req.body.location
  editparty.startsat = req.body.startat
  editparty.endsat = req.body.endat
  editparty.description = req.body.desc
 await editparty.save()
console.log(editparty);
return res.redirect('/account')
}) 


module.exports = router

