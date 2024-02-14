import {Preferences} from '@capacitor/preferences';
import axios from "axios";
import router from "@/router";
import {err_popup} from "@/modules/swal2";


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

export const getUsername = async () => {
    return (await Preferences.get({key: "username"})).value
}

export function SetAuth(access_token, refresh_token, access_token_exp, username) {
    Preferences.set({
        key: "access_token",
        value: JSON.stringify({token: access_token, exp: access_token_exp})
    });

    Preferences.set({key: "refresh_token", value: refresh_token});
    Preferences.set({key: "username", value: username});
}

export async function isAuthenticated() {
    let data = JSON.parse((await Preferences.get({key: "access_token"})).value)

    if (data !== null) {
        let exp = new Date(data.exp)
        const currentTime = new Date()
        return currentTime <= exp;
    } else {
        return false;
    }
}

export async function refreshTokens() {
    let refresh_token = (await Preferences.get({key: "refresh_token"})).value
    return axios.post("/api/auth/refresh", {refresh_token: refresh_token})
        .then(response => {
            SetAuth(
				response.data['access_token'],
	            response.data['refresh_token'],
	            response.data['access_token_exp'],
	            response.data['username']
            );
            return true;
        })
        .catch(_ => {
            return false;
        })
}

export function logout() {
    SetAuth(null, null, null, null)
    router.push("/auth/login")
}