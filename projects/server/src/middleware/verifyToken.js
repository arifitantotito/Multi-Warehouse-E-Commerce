const {validateToken} = require('./../lib/jwt')

module.exports ={
    tokenVerify:async(req,res,next)=>{

        let {token} = req.headers
        // console.log(token)
        
            // console.log(`token is ${token}`)
            if(!token) return res.status(404).send({
            isError:true,
            message:"token not Found",
            data:null
             })
             try {
                const validateTokenResult = validateToken(token)
                req.dataToken = validateTokenResult
                next()
             } catch (error) {
                // console.log(error)
                res.status(500).send({
                    isError:true,
                    message:"Invalid Token",
                    data:null
                })
             }
             
    }
}