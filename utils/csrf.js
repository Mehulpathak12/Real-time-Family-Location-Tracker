const csrf = require('@sailshq/csurf')
require("dotenv").config()
// const csrfProtection = csrf({ cookie: true })
const csrfProtection = csrf({
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 5 * 60 * 1000, // 5 minutes
    }
  });
  
module.exports = csrfProtection