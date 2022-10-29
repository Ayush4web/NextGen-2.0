const express = require('express')
const connectDb = require('./db/connect')
const path = require('path')

const app = express()
const cors = require('cors')
const cookie = require('cookie-parser')

require('dotenv').config()
require('express-async-errors')

// Sequrity Packages
const xss = require('xss-clean')
const helmet = require('helmet')
const mongoSanatize = require('express-mongo-sanitize')

// Cloudinary Config
const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

const passengerRouter = require('./routes/passengerRoute')
const authRouter = require('./routes/userRoute')

// middlewares
const errorHandlerMiddleware = require('./middlewares/errorHandler')
const notFoundMiddleware = require('./middlewares/notFound')

app.use(express.json())
app.use(cors())
app.use(cookie())

const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header')
app.use(
  expressCspHeader({
    policies: {
      'default-src': [expressCspHeader.NONE],
      'img-src': [expressCspHeader.SELF],
    },
  })
)

// Serving Static Build of react for Deployment

app.use(express.static(path.join(__dirname, './client/build')))

app.use('/', passengerRouter)
app.use('/localauth', authRouter)

// social login

const passport = require('passport')
const session = require('express-session')
const jwt = require('jsonwebtoken')

require('./socialLogin/google')
require('./socialLogin/passport')

app.use(
  session({
    secret: 'secr3t',
    resave: false,
    saveUninitialized: true,
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)

app.get(
  '/auth/google/callback',
  passport.authenticate('google'),
  (req, res) => {
    if (!req.user) {
      res.status(401).json({ success: 'false', msg: 'Authentication Failed' })
    }

    const { name, email, profileImg } = req.user
    const token = jwt.sign(
      { name, email, profileImg },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.cookie('token', token)
    res.redirect(`${process.env.URL}/home`)
  }
)

//  handles react router

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'))
})

const port = process.env.PORT || 5000
const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI).then(
      console.log('Connected to DB...')
    )
    app.listen(port, console.log(`Server is listening on port:${port}`))
  } catch (error) {
    console.log(error)
  }
}
start()

app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)
