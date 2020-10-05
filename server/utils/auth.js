const jwt = require('jsonwebtoken');

const secret = 'mysecrestsshhhhhh';
const expiration = '2h';

module.exports = {
  // arguments to signToken get added to the encoded token
  signToken: function({ username, email, _id }) {
    const payload = { username, email, _id }

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration })
  },

  authMiddleware: function({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // separate "Bearer" from "<tokenvalue>"
    if (req.headers.authorization) {
      token = token 
        .split(' ')
        .pop()
        .trim();
    }

    // if no token, return request as is
    if (!token) {
      return req;
    }

    // we don't want error thrown if user has an invalid token...they should still be able to request and see all thoughts.  so use try...catch to mute the error
    try {
      // decode and attach user data to request object
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      console.log(data);
      req.user = data;
    } catch {
      console.log('Invalid token')
    }

    // return updated request object
    return req;
  }
}