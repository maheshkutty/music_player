import axios from "axios"
export const spotifyApi = axios.create({
    baseURL: 'https://api.ss.dev/resource/api',
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    }
})