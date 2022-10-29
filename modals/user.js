const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    unique: [true, 'email already registered'],
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
  },
  password: {
    type: String,
  },
  profileImg: {
    type: String,
  },
  source: { type: String, default: '' },
  lastVisited: { type: Date, default: new Date() },
})

// UserSchema.pre('save', async function (next) {
//   if (this.source == '') {
//   }
//    console.log("hello")
//       const salt = await bcrypt.genSalt(10)
//       this.password = await bcrypt.hash(this.password, salt)

// })

UserSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password)
  return isMatch
}

module.exports = mongoose.model('Users', UserSchema)
