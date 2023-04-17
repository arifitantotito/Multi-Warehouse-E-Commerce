import axios from "axios"
export const CheckLogin = async () => {
        try {
                let getTokenId = localStorage.getItem('token')
                if(!getTokenId) return{
                        id: null,
                        username: null
                }
                let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/keep-login?`, {

                        headers: {
                                token: getTokenId
                        }
                })
                // console.log(response)
                return {
                        id: response.data.data.token,
                        username: response.data.data.username,
                        role: response.data.data.role,
                        warehouse: response.data.data.warehouse,
                        warehouse_id: response.data.data.warehouse_id,
                        photo_profile: response.data.data.photo_profile
                }
        } catch (error){
                return {
                        id: null,
                        username: null
                }
        }

}