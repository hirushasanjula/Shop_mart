import axios from "axios";
import  SummaryApi, { baseURL } from '../api/SummaryApi'

const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true
})

Axios.interceptors.request.use(
    async(config) => {
        const accesstoken = localStorage.getItem('accesstoken')
        
        if(accesstoken) {
            config.headers.Authorization = `Bearer ${accesstoken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }

)

//refresh token
Axios.interceptors.request.use(
    (response) => {
        return response
    },
    async(error) => {
        let originalRequest = error.config

        if(error.response.status === 401 && !originalRequest.retry) {
            originalRequest.retry = true

            const refreshtoken = localStorage.getItem('refreshtoken')

            if(refreshtoken) {
                const newAccessToken = await refreshAccessToken(refreshtoken)

                if(newAccessToken) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                    return Axios(originalRequest)
                }
            }
        }

        return Promise.reject(error)
    }
)

const refreshAccessToken = async(refreshtoken) => {
    try {
        const response = await Axios({
            ...SummaryApi.refreshToken,
            headers: {
                Authorization: `Bearer ${refreshtoken}`
            }
        })

        const accesstoken = response.data.data.accesstoken
        localStorage.setItem('accesstoken', accesstoken)
        return accesstoken
    } catch (error) {

    }
}

export default Axios