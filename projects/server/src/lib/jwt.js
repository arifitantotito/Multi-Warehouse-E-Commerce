const jwt = require('jsonwebtoken')

module.exports = {
    //key atas sama bawah harus sama
    //key = 123abc
       createToken: (payload) =>{
        return jwt.sign(payload, '123abc',{
            expiresIn: '1d'
        })
       },

       validateToken: (token) =>{
        return jwt.verify(token, '123abc')
       }
}