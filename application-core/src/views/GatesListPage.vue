<script setup>
import {Camera, CameraResultType} from "@capacitor/camera";
import {logout} from "@/modules/auth";
import * as api from "@/modules/api";

import LogoutSvg from "@/components/svg/logout-svg.vue";
import BarrierImage from "@/components/svg/barrier-image.vue";
import GateSvg from "@/components/svg/gate-svg.vue";
import AdminGateSvg from "@/components/svg/admin-gate-svg.vue";
import ArrowSvg from "@/components/svg/arrow-svg.vue";
import {ref} from "vue";


const gates_list_expanded = ref(false)
const emit = defineEmits(["update_avatar_value", "open_gate_page"])
const props = defineProps({
	account_info: {
		type: Object,
		required: true
	},
	my_gates: {
		type: Object,
		required: true
	},
	user_avatar_url: {
		type: String,
		required: true
	}
})

const change_avatar = async () => {
	try {
		const image = await Camera.getPhoto({
			quality: 90,
			allowEditing: true,
			resultType: CameraResultType.Base64
		})
		let new_avatar = await api.change_avatar(image.base64String)
		if (new_avatar) { emit("update_avatar_value") }
	} catch (err) {}
}
</script>

<template>
<div :class="{homepage: !(gates_list_expanded), 'homepage-gates-list-expanded': gates_list_expanded}">
	<div class="header">
		<div style="display: flex; align-items: center; max-width: 80%; overflow: hidden;">
			<img class="user-image" :src="user_avatar_url"  @click="change_avatar" alt=""/>
			<div class="text-union" style="max-width: 80%">
				<p class="greetings">Приветствую вас,</p>
				<div style="display: flex; align-items: center">
					<p class="username">{{ props.account_info.name }}</p>
					<p class="username"> 👋</p>
				</div>

			</div>
		</div>
		<logout-svg class="logout" @click="logout"/>
	</div>

	<div class="banner-barrier">
		<barrier-image width="75%"/>
	</div>

	<div class="manage-barriers">
		<div class="header" @click="gates_list_expanded = !(gates_list_expanded)">
			<p class="count-circle">{{Object.keys(props.my_gates).length}}</p>
			<p class="title">👇 Вы управляете</p>
			<arrow-svg/>
		</div>
		<div class="body">
			<div class="gate" v-for="gate in props.my_gates" @click="emit('open_gate_page', gate.gate_id)">
				<admin-gate-svg class="gate-icon" v-if="gate.is_admin"/>
				<gate-svg v-else/>

				<div class="gate-content-block">
					<p class="name">{{gate.gate_name}}</p>
					<p class="address">{{gate.address}}</p>
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<style scoped>
.homepage {
	display: grid;
	grid-template-rows: 15% 30% 350px;
	height: 100%;
	box-sizing: border-box;
	transition: all .3s ease;
}

.homepage-gates-list-expanded {
	display: grid;
	grid-template-rows: 0 0 98%;
	height: 100%;
	padding: 10px 0;
	box-sizing: border-box;
	transition: all .3s ease;
}

.logout {
	fill: var(--button);
	cursor: pointer;
}

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
	padding-right: 25px;
	position: relative;
	overflow: visible;
}

.manage-barriers .header .title{
	color: var(--text);
	font-size: 22px;
	font-weight: 600;
}

.count-circle {
	padding: 5px;
	height: 20px;
	border-radius: 10px;
	background: var(--button);
	position: absolute;
	right: 0;
	top: -25px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 600;
	color: var(--text);
	font-size: 17px;
	box-sizing: border-box;
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
	height: 100%;
	border-radius: 5px 5px 15px 15px;
	overflow: scroll;
}

.manage-barriers .body .gate {
	background: var(--light-sbg);
	min-height: 70px;
	max-height: 70px;
	border-radius: 15px;
	display: flex;
	align-items: center;
	padding-left: 10px;
	gap: 15px;
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

.gate .gate-content-block .address {
	color: var(--hint);
	font-size: 10px;
	font-weight: 600;
	margin: 0;
}


.banner-barrier {
	width: 100%;
	background: #E8E4FB;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 20px;
	overflow: hidden;
}

.header {
	width: 100%;
	display: flex;
	align-items: center;
	margin-top: 20px;
	justify-content: space-between;
	margin-bottom: 40px;
	overflow: hidden;
}
.user-image {
	width: 56px;
	height: 56px;
	background: var(--sbg);
	border-radius: 28px;
	border: none;
	outline: none;
}
.user-image:before {
    content: attr(alt);
	display: block;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: var(--sbg);
	font-weight: 300;
	text-align: center;
}
.header .text-union {
	padding-left: 15px;
}
.greetings {
	margin: 0;
	color: var(--text);
	font-size: 14px;
	font-weight: 500;
}
.username {
	margin: 0;
	color: var(--text);
	font-size: 25px;
	font-weight: 500;
	background: none;
	border: none;
	min-height: 10%;
	max-width: 80%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
</style>