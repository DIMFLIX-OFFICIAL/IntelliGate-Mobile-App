import axios from 'axios'
import {err_popup, succ_popup} from "./swal2";
import {SetAuth} from "@/modules/auth";



export const login = async (username, password) => {
    return axios.post("/api/auth/login", {username: username, password: password})
        .then(response => {
            SetAuth(response.data['access_token'], response.data['refresh_token'], response.data['access_token_exp']);
            return response.data;
        })
        .catch(_ => {
            err_popup("Не удалось связаться с сервером...")
            return null;
        })
}
