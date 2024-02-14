<script setup>
import {onMounted, ref} from "vue";
import ArrowSvg from "@/components/svg/arrow-svg.vue";
import Ai_avatar_svg from "@/components/svg/ai_avatar_svg.vue";
import SettingsSvg from "@/components/svg/settings-svg.vue";
import * as api from "@/modules/api";
import AdminGateSvg from "@/components/svg/admin-gate-svg.vue";
import CitySvg from "@/components/svg/city-svg.vue";
import BoxSvg from "@/components/svg/box-svg.vue";
import EditSvg from "@/components/svg/edit-svg.vue";
import SaveSvg from "@/components/svg/save-svg.vue";
import CamSvg from "@/components/svg/cam-svg.vue";

const props = defineProps({
	gate_id: {
		type: Number,
		required: true
	}
})

const emit = defineEmits(["back_to_gate"])
const members_list_expanded = ref(false);
const gate_name_edit_mode = ref(false);
const address_edit_mode = ref(false);
const gate_settings = ref(Object);
const button_ai_is_active = ref(false);

onMounted(async () => {
	gate_settings.value = await api.get_gate_settings(props.gate_id)
	gate_settings.value["cam"] = JSON.parse(gate_settings.value["cam"])
	gate_settings.value["managers"] = JSON.parse(gate_settings.value["managers"])
	console.log(gate_settings.value)
})
</script>

<template>
	<div :class="{'page': !(members_list_expanded), 'page-members-list-expanded': members_list_expanded}">
		<!-- Header с кнопкой назад -->
		<div class="header">
			<div class="back" @click="emit('back_to_gate', props.gate_id)">
				<arrow-svg class="icon"/>
			</div>
			<div class="settings">
				<div class="Union">
					<p class="name">Мой дом</p>
					<p class="address">Москва, ул Шоссейная, д25</p>
				</div>
				<settings-svg style="width: 30px"/>
			</div>
		</div>

		<div class="info">
			<div class="info-object">
				<div class="Union">
					<admin-gate-svg class="icon"/>
					<input class="hidden-input" v-model="gate_settings['name']" :readonly="!(gate_name_edit_mode)">
				</div>
				<edit-svg @click="gate_name_edit_mode = !(gate_name_edit_mode)" v-if="!(gate_name_edit_mode)"/>
				<save-svg style="width: 24px" @click="gate_name_edit_mode = !(gate_name_edit_mode)" v-else/>
			</div>
			<div class="info-object">
				<div class="Union">
					<city-svg class="icon"/>
					<input class="hidden-input" v-model="gate_settings['address']" :readonly="!(address_edit_mode)">
				</div>
				<edit-svg @click="address_edit_mode = !(address_edit_mode)" v-if="!(address_edit_mode)"/>
				<save-svg style="width: 24px" @click="address_edit_mode = !(address_edit_mode)" v-else/>
			</div>
			<div class="info-object">
				<div class="Union">
					<cam-svg class="icon"/>
					<div>
						<p class="cam-title">Камера</p>
						<p class="cam-status-ok">Подключено</p>
					</div>
				</div>
				<edit-svg/>
			</div>
			<div class="info-object">
				<div class="Union" style="max-width: 100%; width: 100%">
					<box-svg class="icon"/>
					<input class="hidden-input" :value="'Серийный номер: '+gate_settings['serial_number']" readonly>
				</div>
			</div>
		</div>

		<!-- История открытий/закрытий шлагбаума -->
		<div class="manage-members">
			<div class="header" @click="members_list_expanded = !(members_list_expanded)">
				<p class="title">Пользователи</p>
				<arrow-svg/>
			</div>
			<div class="body">
				<div class="user" v-for="(value, key) in gate_settings['managers']">
					<div class="user-avatar">
						<img :src="'/api/users_avatars/' + value['username'] + '.png'" alt="">
					</div>

					<div class="user-content-block">
						<p class="name">{{ value['name'] }}</p>
						<p class="username">Username: {{ value['username'] }}</p>
					</div>
				</div>
			</div>
		</div>


		<button
			:class="{'main-btn': true,
					'main-btn-active': button_ai_is_active,
					'main-btn-unactive': !(button_ai_is_active)}
				   "
			@click="button_ai_is_active = !(button_ai_is_active)"
			v-if="!(members_list_expanded)"
		>
			<ai_avatar_svg/>
			<p v-if="button_ai_is_active">Выключить нейросеть</p>
			<p v-else>Включить нейросеть</p>
		</button>
	</div>
</template>

<style scoped>
.page {
	display: grid;
	grid-template-rows: 70px 264px 330px;
	gap: 15px;
	height: 100%;
	width: 100%;
	max-height: 100%;
	padding: 20px 0;
	box-sizing: border-box;
	overflow: hidden;
	position: relative;
	transition: all .3s ease;
}

.page-members-list-expanded {
	display: grid;
	grid-template-rows: 0 0 98%;
	height: 100%;
	width: 100%;
	max-height: 100%;
	padding: 20px 0;
	box-sizing: border-box;
	overflow: hidden;
	position: relative;
	transition: all .3s ease;
}

/* -------------------- HEADER -------------------------- */
.header {
	display: grid;
	width: 100%;
	gap: 10px;
	grid-template-columns: 70px auto;
	overflow: hidden;
}

.header .back {
	background: var(--sbg);
	display: flex;
	gap: 20px;
	align-items: center;
	justify-content: center;
	height: 70px;
	border-radius: 15px;
}
.header .back .icon { transform: scale(-1, 1); }

.header .settings {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 20px;
	background: var(--sbg);
	border-radius: 15px;
}
.header .settings .Union .name {
	margin: 0;
	font-size: 21px;
	font-weight: 600;
	color: var(--text)
}
.header .settings .Union .address {
	margin: 0;
	font-size: 11px;
	font-weight: 600;
	color: var(--hint);
}
/* -------------------- HEADER -------------------------- */


/* -------------------- INFO ---------------------------- */
.info {
	display: flex;
	flex-direction: column;
	gap: 8px;
	border-radius: 15px;
	overflow: hidden;
}

.info .info-object {
	background: var(--sbg);
	border-radius: 5px;
	display: flex;
	padding: 0 20px;
	align-items: center;
	justify-content: space-between;
	min-height: 60px;
	max-height: 60px;
}

.info .info-object .Union {
	display: flex;
	gap: 15px;
	max-width: 80%;
	overflow: hidden;
	align-items: center;
}

.info .info-object .icon {
	width: 35px;
	height: 35px;
}

.info .info-object .hidden-input {
	background: transparent;
	border: none;
	height: 100%;
	width: 100%;
	outline: none;
	color: var(--text);
	font-size: 18px;
	font-weight: 600;
}

.info .info-object .cam-title {
	font-size: 18px;
	color: var(--text);
	font-weight: 600;
	margin: 0;
}

.info .info-object .cam-status-ok {
	font-size: 11px;
	color: #74FFB0;
	font-weight: 600;
	margin: 0;
}

.info .info-object .cam-status-err {
	font-size: 11px;
	color: #FF748C;
	font-weight: 600;
	margin: 0;
}

/* -------------------- INFO ---------------------------- */



/* ------------------ MANAGE MEMBERS --------------------*/
.manage-members {
	max-height: 100%;
	overflow: hidden;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
}

.manage-members .header {
	background: var(--sbg);
	height: 70px;
	width: 100%;
	border-radius: 15px 15px 5px 5px;
	padding-left: 15px;
	box-sizing: border-box;
	margin-bottom: 10px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-right: 25px;
	overflow: visible;
}

.manage-members .header .title{
	color: var(--text);
	font-size: 22px;
	font-weight: 600;
}
.manage-members .body {
	display: flex;
	flex-direction: column;
	gap: 10px;
	align-content: center;
	padding: 10px 10px;
	box-sizing: border-box;
	background: var(--sbg);
	width: 100%;
	border-radius: 5px 5px 15px 15px;
	height: 100%;
	overflow: scroll;
}

.manage-members .body .user {
	display: flex;
	gap: 10px;
	align-content: center;
	padding: 10px 10px;
	min-height: 70px;
	max-height: 70px;
	box-sizing: border-box;
	background: var(--light-sbg);
	width: 100%;
	border-radius: 15px;
	height: 100%;
	overflow: scroll;
}

.manage-members .body .user-avatar {
	width: 43px;
	height: 43px;
	max-width: 43px;
	max-height: 43px;
	border: 2px #FFFFFF solid;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}

.manage-members .body .user-avatar img {
	width: 44px;
	height: 44px;
}


.manage-members .user-content-block {
	display: flex;
	flex-direction: column;
	gap: 3px;
	align-items: center;
}
.manage-members .user-content-block .name {
	color: var(--text);
	font-size: 21px;
	font-weight: 600;
	margin: 0;
}

.manage-members .user-content-block .username {
	color: var(--hint);
	font-size: 10px;
	font-weight: 600;
	margin: 0;
}
/* ------------------ MANAGE MEMBERS --------------------*/




/* ------------------------ MAIN BTN ----------------------------- */
.main-btn {
	width: 100%;
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
	border-radius: 10px;
	color: var(--text);
	border: none;
	font-size: 18px;
	font-weight: 600;
	height: 60px;
	bottom: 20px;
	transition: all .3s ease;
}
.main-btn-active {
	background: var(--button);
}
.main-btn-unactive {
	background: var(--sbg);
}
/* ------------------------ MAIN BTN ----------------------------- */
</style>