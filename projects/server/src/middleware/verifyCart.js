const {validateToken} = require('./../lib/jwt')

module.exports ={
    tokenVerify:async(req,res,next)=>{
        
        let dataCart = req.body
        // console.log(dataCart)

             try {
                const validateTokenResult = validateToken(dataCart.token)
                
                req.cartToPush = {
                    'dataCart': dataCart.cart,
                    'user_id' : validateTokenResult.id
                }
                next()

             } catch (error) {
    
                res.status(500).send({
                    isError:true,
                    message:"Invalid Token",
                    data:null
                })
             }
    }
}