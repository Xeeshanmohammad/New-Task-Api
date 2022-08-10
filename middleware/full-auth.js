const jwt = require('jsonwebtoken')
const User = require('../Models/user')

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization')
    // console.log(token)
  const decoded = jwt.verify(token, 'thisismyanothernodejsproject')
  const user = await User.findOne({ _id:decoded.id, 'token.token':token})
  if(!user){
    throw new Error()
  }
  req.token = token;
  req.user = user
  next()
  } catch (error) {
    res.status(401).send('Error: Please Authenticate')
  }
}

module.exports = authenticateUser