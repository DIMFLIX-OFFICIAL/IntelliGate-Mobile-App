<script setup>
import ArrowSvg from "@/components/svg/arrow-svg.vue";
import BarrierImage from "@/components/svg/barrier-image.vue";
import {ref} from "vue";
import SettingsSvg from "@/components/svg/settings-svg.vue";
import Ai_avatar_svg from "@/components/svg/ai_avatar_svg.vue";

const props = defineProps({
	gate_id: {
	  type: Number,
	  required: true
	},
	gate_info: {
		type: Object,
		required: true
	}
})

const emit = defineEmits(["open_gates_list_page", "open_settings_page"])
const history_list_expanded = ref(false);
const button_is_active = ref(false);
const history = ref([
	{id: 1, gate: 1, is_opened: false, username: 'ai', name: 'AI', is_ai: true, date: new Date()},
	{id: 2, gate: 1, is_opened: true, username: 'ai', name: 'AI', is_ai: true, date: new Date()},
	{id: 3, gate: 1, is_opened: false, username: 'dimflix', name: 'DIMFLIX', is_ai: false, date: new Date()}
])

function formatDate(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hour = String(date.getHours()).padStart(2, '0');
	const minute = String(date.getMinutes()).padStart(2, '0');
	const second = String(date.getSeconds()).padStart(2, '0');
	return `${day}.${month}.${year} ${hour}:${minute}:${second}`;
}
</script>

<template>
	<div :class="{'page': !(history_list_expanded), 'page-history-list-expanded': history_list_expanded}">
		<!-- Header с кнопкой назад -->
		<div :class="{'header': true, 'header-with-settings': gate_info.is_admin, 'header-without-settings': !(gate_info.is_admin)}">
			<div class="back" @click="emit('open_gates_list_page')">
				<arrow-svg class="icon"/>
				<div class="Union">
					<p class="name">Мой дом</p>
					<p class="address">Москва, ул Шоссейная, д25</p>
				</div>
			</div>
			<div class="settings" v-if="gate_info.is_admin" @click="emit('open_settings_page')">
				<settings-svg style="width: 30px"/>
			</div>
		</div>

		<!-- Баннер -->
		<div class="banner-barrier">
			<barrier-image width="75%"/>
		</div>

		<!-- История открытий/закрытий шлагбаума -->
		<div class="manage-barriers">
			<div class="header" @click="history_list_expanded = !(history_list_expanded)">
				<p class="title">История</p>
				<arrow-svg/>
			</div>
			<div class="body">
				<div
					:class="{'gate': true, 'unactive-gate': !(record.is_opened), 'active-gate': record.is_opened}"
					v-for="record in history"
				>
					<div class="history-avatar">
						<ai_avatar_svg v-if="record.is_ai"/>
						<img :src="'/api/users_avatars/' + record.username + '.png'" alt="" v-else>
					</div>

					<div class="gate-content-block">
						<p class="name">{{record.is_opened ? 'Открытие' : 'Закрытие'}}</p>
						<p class="datetime-and-nickname">{{formatDate(record.date) + ' - ' + record.name}}</p>
					</div>

				</div>
			</div>
		</div>



		<button
			:class="{'main-btn': true,
					'main-btn-active': button_is_active,
					'main-btn-unactive': !(button_is_active)}
				   "
			v-if="!(history_list_expanded)"
			@click="button_is_active = !(button_is_active)"
		>
			<p v-if="button_is_active">Выключить нейросеть</p>
			<p v-else>Включить нейросеть</p>
		</button>
	</div>
</template>

<style scoped>
.page {
	display: grid;
	grid-template-rows: 70px 30% 330px;
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

.page-history-list-expanded {
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
	overflow: hidden;
}
.header-with-settings {
	grid-template-columns: auto 70px;
}

.header-without-settings {
	grid-template-columns: 100%;
}

.header .back {
	background: var(--sbg);
	display: flex;
	gap: 20px;
	align-items: center;
	padding-left: 20px;
	border-radius: 15px;
}
.header .back .icon { transform: scale(-1, 1); }
.header .back .Union .name {
	margin: 0;
	font-size: 21px;
	font-weight: 600;
	color: var(--text)
}
.header .back .Union .address {
	margin: 0;
	font-size: 11px;
	font-weight: 600;
	color: var(--hint);
}
.header .settings {
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--sbg);
	border-radius: 15px;
}
/* -------------------- HEADER -------------------------- */






/* -------------------- BANNER -------------------------- */
.banner-barrier {
	top: 0;
	width: 100%;
	background: #E8E4FB;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 20px;
	overflow: hidden;
}
/* -------------------- BANNER -------------------------- */









.manage-barriers {
	max-height: 100%;
	overflow: hidden;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
}

.manage-barriers .header {
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

.manage-barriers .header .title{
	color: var(--text);
	font-size: 22px;
	font-weight: 600;
}
.manage-barriers .body {
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

.manage-barriers .body .gate {
	min-height: 70px;
	max-height: 70px;
	border-radius: 15px;
	display: flex;
	align-items: center;
	padding-left: 10px;
	gap: 15px;
}

.unactive-gate { background: var(--light-sbg) }
.active-gate { background: var(--button) }

.manage-barriers .body .gate .history-avatar {
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

.manage-barriers .body .gate .history-avatar img {
	width: 44px;
	height: 44px;
}


.gate .gate-content-block {
	display: flex;
	flex-direction: column;
	gap: 3px;
}
.gate .gate-content-block .name {
	color: var(--text);
	font-size: 21px;
	font-weight: 600;
	margin: 0;
}

.gate .gate-content-block .datetime-and-nickname {
	color: var(--hint);
	font-size: 10px;
	font-weight: 600;
	margin: 0;
}


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