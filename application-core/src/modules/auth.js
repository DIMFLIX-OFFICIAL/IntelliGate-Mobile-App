import {Preferences} from '@capacitor/preferences';
import axios from "axios";
import router from "@/router";

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
    let exp = new Date(data['exp'])
    let is_auth2 = data['token'] && exp && exp > Date.now()
    console.log(data)
    console.log(`Авторизован? ${is_auth2}`)
    return is_auth2
}

export async function refreshTokens() {
    let refresh_token = (await Preferences.get({key: "refresh_token"})).value
    console.log(refresh_token)
    return axios.post("/api/auth/refresh", {refresh_token: refresh_token})
        .then(response => {
            console.log("Пара токенов была обновлена!")
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