const jwt = require('jsonwebtoken')
const UnAutharise = require('../errors/UnAutharize')

const auth = async (req, res, next) => {
 

  if (!req.cookies.token) {
   throw new UnAutharise('You are not Autharised')
   
  }

  const token = req.cookies.token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    res.status(200).json({ sucess: 'true', user: decoded })
  } catch (error) {
    throw new UnAutharise('You are not Autharised')
  }
  next()
}

module.exports = auth
