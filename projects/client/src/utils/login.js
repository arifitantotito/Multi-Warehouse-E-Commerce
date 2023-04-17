import axios from "axios"

export const LoginAccount = async (inputEmail, inputPassword, toogle) => {


    try {
        let response = toogle == true ?

            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/admin/login`, { email: inputEmail, password: inputPassword })
            :
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/login`, { email: inputEmail, password: inputPassword })
        // console.log('user') // taro disini buat API user

        // console.log(response)

            return{
                response:response.data.message,
                id:response.data.data.token,
                username:response.data.data.username,
                role:response.data.data.role,
                photo_profile:response.data.data.photo_profile,
                warehouse_id:response.data.data.warehouse_id,
                warehouse:response.data.data.warehouse
                
            }  
        }
    
    catch (error) {
        return {
            response: error.response.data.message
        }
    }
}