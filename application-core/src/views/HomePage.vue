<script setup>
import {onMounted, ref} from "vue";
import * as api from "@/modules/api";
import {get_my_gates} from "@/modules/api";
import Loader from "@/views/Loader.vue";
import GatesListPage from "@/views/GatesListPage.vue";
import GatePage from "@/views/GatePage.vue";
import {Preferences} from "@capacitor/preferences";
import SettingsPage from "@/views/SettingsPage.vue";
import {isAuthenticated, refreshTokens} from "@/modules/auth";


//==> Настроечки
///////////////////////////////////////
var ws;

async function start_ws() {
	if (await isAuthenticated()) { await refreshTokens() }
	let token = JSON.parse((await Preferences.get({key: "access_token"})).value)["token"]
	ws = new WebSocket(process.env.VUE_APP_SERVER_WS + `/api/protected/ws/${token}`);

	ws.onopen = function () {
		console.log("ws opened successfully")
	}
	ws.onmessage = async function(event) {
		console.log(event.data)
		let data;
	    try { data = JSON.parse(event.data) }
		catch (e) { return false; }

		if (!("method" in data)) { return false; }

		switch (data["method"]) {
			case 'retry_auth':
				await refreshTokens()
				let token = JSON.parse((await Preferences.get({key: "access_token"})).value)["token"]
				ws.send(JSON.stringify({method: "auth_extension",access_token: token}))
				console.log("отправляю новый токен в ws")
				break;
			default:
				console.log(`Метод ${data["method"]} не найден!`)
		}
	};

	ws.onclose = function (event) {
		console.log("соединение закрыто :(((")
	}

	ws.onerror = function(error) {
	  console.log("WS Ошибка " + error.message);
	};
}




const loaderPageOpened = ref(true)
const gatesListPageOpened = ref(false)
const gatePageOpened = ref(false)
const settingsPageOpened = ref(false)

const account_info = ref({email: String, username: String, name: String})
const user_avatar_url = ref('')

const my_gates = ref({})
const gate_selected = ref(null)

const openPage = (page) => {
	loaderPageOpened.value = false
	gatesListPageOpened.value = false
	gatePageOpened.value = false
	settingsPageOpened.value = false
	page.value = true
}

const refresh_avatar_img = async () => {
	user_avatar_url.value = `${user_avatar_url.value}?${Date.now()}`
}

const open_gate_page = async (gate_id) => {
	gate_selected.value = gate_id;
	openPage(gatePageOpened)
}

const open_settings_page = async () => {
	openPage(settingsPageOpened)
}

const back_to_gates_list = async () => { openPage(gatesListPageOpened) }

onMounted(async () => {
	// Узнаем данные об аккаунте
	account_info.value = await api.get_my_account_info();

	// Обновляем аватар
	user_avatar_url.value = '/api/users_avatars/' + account_info.value.username + '.png'
	await refresh_avatar_img()

	// Устанавливаем связь с вебсокетом
	////////////////////////////////////////////
	await start_ws()

	// Обновляем список шлагбаумов
	let gates = await get_my_gates()
	if (gates !== null) {
		for (let i in gates) {
			let val = gates[i]
			my_gates.value[val.gate_id] = val
		}
	}

	// Мини задержка и открытие главной страницы
	await new Promise(resolve => setTimeout(resolve, 300));
	openPage(gatesListPageOpened)
});
</script>

<template>
	<Loader v-if="loaderPageOpened"/>
	<GatesListPage
		v-if="gatesListPageOpened"
		:account_info="account_info"
		:my_gates="my_gates"
		:user_avatar_url="user_avatar_url"
		@update_avatar_value="refresh_avatar_img"
		@open_gate_page="open_gate_page"
	/>
	<GatePage
		:gate_id="gate_selected"
		:gate_info="my_gates[gate_selected]"
		v-if="gatePageOpened"
		@open_gates_list_page="back_to_gates_list"
		@open_settings_page="open_settings_page"
	/>
	<SettingsPage
		:gate_id="gate_selected"
		v-if="settingsPageOpened"
		@back_to_gate="open_gate_page"
	/>
</template>

