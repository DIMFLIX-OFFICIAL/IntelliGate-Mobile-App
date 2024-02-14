<script setup>

</script>

<template>
	<RouterView/>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');

:root {
    --bg: #3C3656;
    --dark-sbg: #423B5E;
    --sbg: #4C446D;
    --light-sbg: #564D7A;
	--button: #B088FF;
	--hint: #FFFFFF70; /* #857D96 */
    --text: #FFFFFF;

	text-rendering: optimizeLegibility;
	-webkit-font-smoothing: antialiased;
	-webkit-text-size-adjust: 100%;
	font-family: 'Montserrat', sans-serif;
}

body {
	margin: 0;
	padding: 0;
	background: var(--bg);
}

#app {
	width: 100%;
	height: 100vh;
	padding: 0 20px;
	box-sizing: border-box;
}

.custom-swal2-popup {
    background-color: var(--sbg) !important;
    border-radius: 20px;
    width: 80%;
    max-width: 300px;
    max-height: 410px;
}

.custom-swal2-title {
    color: var(--text) !important;
    margin: 0 !important;
}

.custom-swal2-html-container{
    color: var(--text) !important;
    margin: .9em 1.6em 1.2em !important;
    text-align: center !important;
}

.custom-swal2-icon {
    font-size: 1.5em !important;
}
</style>
