const express = require('express');
const app = express();
const eS = require("express-session")
const expressSession = eS({ secret:'djfdfjdkjf',resave:false,saveUninitialized:false});
const passport = require('passport');
const Strategy = require('passport-local').Strategy
const db = require('./db');
const bcrypt = require('bcrypt')
//saltRounds is how thoroughly the password gets encrypted
const saltRounds = 10
app.use(express.urlencoded({ extended: true }))
app.use(expressSession)
app.use(passport.initialize())
app.use(passport.session())
passport.use(new Strategy((username,password,callback)=>{
    db.one(`SELECT * FROM students WHERE username = '${username}'`)
    .then(
        
        u=>{
            console.log(u.password)
            bcrypt.compare(password,u.password)
            .then(result => {
                if(!result) return callback(null,false)
                return callback(null,u)
        })})
    .catch(()=>{
        callback(null, false)
    })
    //since the password is encrypted, it has to compare the hashed
    //password to the user password
    
    //DO NO INCLUDE THE LINE BELOW OR ANYTHING THE USER TYPES IN FOR PASSWORD WILL WORK
    // return callback(null,user)
}))
// serialize creates a session from the user and puts that user into a session
// pop this user into a "session"
passport.serializeUser((user,callback)=>callback(null,user.id))
// deserialize finds the session from the user.id
passport.deserializeUser((id,callback)=>{
    
    //searches the db to see if a user with that id exists
    db.one(`SELECT * FROM students WHERE id = '${id}'`)
    .then(students=>callback(null,students))
    .catch(()=>callback({'not-found':'No User With That ID Is Found'}))
    
})
const port = 4578
//use this function instead of the "ensureLoggedIn" module
const checkIsLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()) return next()
    return res.redirect('/login')
}
// const checkIfInDB = async (req,res,next) => {
//     let user = await db.one(`SELECT * FROM students WHERE username = ${req.body.username}`)
//     .then(u=>console.log(u.username))
//     .catch(()=>next())
//     if(user) return res.send("user already exists")
// }
const createUser = (req,res,next) => {
    bcrypt.hash(req.body.password, saltRounds)
    .then(hash=>{
        db.none(`INSERT INTO students (username,password) VALUES ('${req.body.username}','${hash}')`)
        .then(()=>next())
        .catch(err=>{
            res.send("user already exists")
            console.log('error',err)
    })
    })
    .catch(err=>{
        res.send("user already exists")
        console.log('error',err)
})
    
}
app.get("/",checkIsLoggedIn,(req,res,next)=>res.send("You're authenticated"))
app.get("/login",(req,res,next) => {res.sendFile(__dirname + '/login.html')})
//here is where the user is authenticated
//in the html file, you'll see a "post" method for the form
// when the submit button is clicked, it will send the info typed into
// the form through the line below, which will trigger the serialization and deserialization
app.post("/login",passport.authenticate('local'),(req,res) => {
    res.redirect("/")
})
app.get("/register",(req,res,next) => {res.sendFile(__dirname + '/register.html')})
app.post("/register",createUser,(req,res) => {
    res.redirect("/login")
})
app.listen(port)