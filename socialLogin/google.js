const passport = require('passport')
const User = require('../modals/user')
const GoogleStrategy = require('passport-google-oauth20').Strategy

passport.use(
  new GoogleStrategy(
    {
      callbackURL: process.env.CALLBACK_URL,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      const id = profile.id
      const email = profile.emails[0].value
      const firstName = profile.name.givenName
      const lastName = profile.name.familyName
      const name = profile.displayName
      const profileImg = profile.photos[0].value
      const source = 'google'

      const currentUser = await User.findOne({ email })
      if (!currentUser) {
        const newUser = await User.create({
          name,
          email,
          profileImg,
          source: 'google',
        })
        return done(null, newUser)
      }

      if (currentUser.source != 'google') {
        //return error
        return done(null, false, {
          message: `You have previously signed up with a different signin method`,
        })
      }

      currentUser.lastVisited = new Date()
      return done(null, currentUser)
    }
  )
)
