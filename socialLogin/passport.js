const passport = require('passport')
const User = require('../modals/user')

passport.serializeUser((user, done) => {
  done(null, user.email)
})

passport.deserializeUser(async (email, done) => {
  const currentUser = await User.findOne({ email })
  done(null, currentUser)
})
