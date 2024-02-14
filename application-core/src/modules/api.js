import axios from 'axios'
import {err_popup} from "./swal2";
import {isAuthenticated, logout, refreshTokens} from "@/modules/auth";
import {Preferences} from "@capacitor/preferences";

export const apiClient = axios.create({baseURL: process.env.VUE_APP_SERVER_URL});

apiClient.interceptors.request.use(async config => {
      let is_auth = await isAuthenticated();
      if (!(is_auth)) {
          let refresh = await refreshTokens();
          if (!(refresh)) {
              await logout()
          }
      }
      let access_token = JSON.parse((await Preferences.get({key: "access_token"})).value)
      config.headers["Authorization"] = "Bearer " + access_token.token;
      return config;
      },
        error => Promise.reject(error)
);

export const get_my_account_info = async () => {
    return apiClient.post("/api/protected/get_my_account_info")
        .then(response => {
            return response.data
        })
        .catch(e => {
            console.log(e)
            err_popup("Не удалось связаться с сервером...")
            return null;
        })
}


export const get_my_gates = async () => {
    return apiClient.post("/api/protected/get_my_gates")
        .then(response => {
            return response.data
        })
        .catch(e => {
            err_popup("Не удалось получить ваши шлагбаумы...")
            return null;
        })
}

export const change_avatar = async (base64_string) => {
    return apiClient.post("/api/protected/change_my_avatar",{new_avatar: base64_string})
        .then(response => {
            return true
        })
        .catch(e => {
            err_popup("Не удалось обновить аватарку...")
            return false;
        })
}

export const get_gate_settings = async (gate_id) => {
    return apiClient.post("/api/protected/get_gate_settings",{gate_id: gate_id})
        .then(response => {
            return response.data
        })
        .catch(e => {
            console.log(e)
            err_popup("Не удалось получить информацию о настройках...")
            return false;
        })
}