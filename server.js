const express = require('express')
const fs = require('fs')
const https = require('https')
const bodyParser = require('body-parser')
const session = require('express-session')
const Passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passport = require('passport')
const { Cookie } = require('express-session')
const app = express()

var user={
    username:'user',
    password:'pass'
}

const privateKey  = fs.readFileSync('./server.key', 'utf8');
const certificate = fs.readFileSync('./server.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};

app.set('views', './views')
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ 
    secret: 'mysecret',
    cookie:{
        maxAge:1000*60*60*24*3
    }
}))
app.use(Passport.initialize())
app.use(Passport.session())

app.route('/')
    .get((req, res) => {
        res.render('login')
    })
    .post(Passport.authenticate('local', {
        // dieu huong chung thuc
        failureRedirect: '/',
        successRedirect: '/ok',
    }))

app.get('/ok', (req, res) => {
    if (req.isAuthenticated()){
        res.render('loginok')
    }else{
        res.render('login')
    }
})

Passport.use(new LocalStrategy(
    // phuong thuc chung thuc
    (username, password, done) => {
        if (username == user.username && password == user.password) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    }
))

Passport.serializeUser((user, done) => {
    done(null, user.username)
    // ghi vao cookie
})

Passport.deserializeUser((name, done) => {
    // lay cookie so sanh
    if (name == user.username) {
        return done(null, user)
    } else {
        return done(null, false)
    }
})
const port = 3000
var server = https.createServer(credentials, app);
server.listen(port, () => {
    console.log(`app listen on port : ${port}`)
})