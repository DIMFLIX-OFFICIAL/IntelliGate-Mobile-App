<script setup>
import axios from "axios";
import {SetAuth} from "@/modules/auth";
import router from "@/router";
import {ref} from "vue";

const username = ref('');
const email = ref('');
const password = ref('');
const name = ref('');
const errors = ref([]);

function register() {
	errors.value = []
	axios.post(
		"/api/auth/register",
		{email: email.value, username: username.value, password: password.value, name: name.value}
	)
        .then(response => {
            SetAuth(
				response.data['access_token'],
	            response.data['refresh_token'],
	            response.data['access_token_exp'],
	            response.data['username']
            );
            router.push("/")
        })
        .catch(err => {
            errors.value.push(err.response.data.detail || "Не удалось соединиться с сервером...")
        })
}
</script>

<template>
	<div class="bg">
		<div class="auth-container">
			<div class="block">
				<p class="title">Регистрация</p>
				<input placeholder="Почта" v-model="email" type="email">
				<input placeholder="Имя" v-model="name">
				<input placeholder="Логин" v-model="username">
				<input placeholder="Пароль" v-model="password" type="password">
			</div>

			<div class="block">
				<button class="auth-btn" @click="register">Зарегистрироваться</button>
				<p v-for="err in errors" class="errors">{{err}}</p>
				<router-link to="/auth/login" class="another-way">Уже есть аккаунт?</router-link>
			</div>
		</div>
	</div>
</template>

<style scoped>
.bg {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
}

.auth-container {
	background: var(--sbg);
	width: 80%;
	border-radius: 15px;
	padding: 15px 0 20px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 20px;
}

.block {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.title {
	font-size: 23px;
	font-weight: 700;
	margin-bottom: 30px;
	color: var(--text)
}

.auth-container input {
	background: var(--light-sbg);
	width: 90%;
	height: 60px;
	border-radius: 15px;
	border: none;
	padding-left: 10px;
	box-sizing: border-box;
	color: var(--text);
	font-weight: 600;
	font-size: 16px;
	outline: none;
	margin-bottom: 15px;
}

.auth-container input::placeholder {
	color: var(--button);
}

.errors {
	color: red;
	margin-bottom: 0;
}

.auth-btn {
	background: var(--button);
	border-radius: 15px;
	border: none;
	width: 90%;
	height: 60px;
	color: var(--text);
	font-weight: 600;
	font-size: 18px;
}

.another-way {
	color: var(--button);
	font-size: 14px;
	font-weight: 600;
	text-decoration: none;
	margin-top: 10px;
}
</style>
