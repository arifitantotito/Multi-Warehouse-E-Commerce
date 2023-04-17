const jwt = require('jsonwebtoken')

//import .env
// require('dotenv').config()

const jwtVerify = (req,res,next) =>{
    const token = req.headers.auth
    // console.log(token)

    if(!token) return res.status(406).send({error:true, message:"Token Not Found!"})

    jwt.verify(token, '123abc', (err, dataToken) =>{
        try {
            if(err)throw err
            req.dataToken = dataToken
            next()
        } catch (error) {
            res.status(500).send({
                isError:true,
                message:error.message
            })
        }
    })
}

module.exports = jwtVerify