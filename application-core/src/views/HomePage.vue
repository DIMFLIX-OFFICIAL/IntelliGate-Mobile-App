<script setup>
import {getUsername, logout} from "@/modules/auth";
import {onMounted, ref} from "vue";
import LogoutSvg from "@/components/logout-svg.vue";
import BarrierImage from "@/components/barrier-image.vue";

const name = "Дмитрий"
const username = ref('');

onMounted(async () => {
    username.value = await getUsername();
});
</script>

<template>
	<div class="homepage">

		<div class="header">
			<div style="display: flex; align-items: center">
				<div class="user-image"></div>
				<div class="text-union">
					<p class="greetings">Приветствую вас,</p>
					<p class="username">{{ name }} 👋</p>
				</div>
			</div>
			<logout-svg class="logout" @click="logout"/>
		</div>

		<div class="banner-barrier">
			<barrier-image/>
		</div>

		<div class="manage-barriers">
			<div class="header">
				<p>👇 Вы управляете</p>
			</div>
			<div class="body">

			</div>
		</div>

	</div>

</template>

<style scoped>
.homepage {
	display: grid;
	grid-template-rows: 25% 60% 50%;
}

.logout {
	fill: var(--button);
	cursor: pointer;
}

.manage-barriers {
}

.manage-barriers .header {
	background: var(--sbg);
	height: 70px;
	width: 100%;
	border-radius: 15px 15px 5px 5px;
	padding-left: 15px;
	box-sizing: border-box;
	margin-bottom: 10px;
}

.manage-barriers .header p{
	color: var(--text);
	font-size: 22px;
	font-weight: 600;
}

.manage-barriers .body {
	background: var(--sbg);
	width: 100%;
	height: 100%;
	border-radius: 5px 5px 15px 15px;
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
}
.user-image {
	width: 56px;
	height: 56px;
	background: var(--sbg);
	border-radius: 28px;
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
}
</style>