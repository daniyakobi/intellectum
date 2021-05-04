const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
  if(req.method === 'OPTIONS') {
    return next()
  }
  try {
    console.log(req.headers.authorization);
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
      res.status(401).json({ 'message': 'Пользователь не авторизован' });
      return false;
    }

    const decoded = jwt.verify(token, config.get('jwtsecret'))
    console.log(decoded.userId);
    req.userToken = decoded
    next()
  } catch(e) {
    res.status(401).json({ message: 'Пользователь не авторизован'})
  }
}