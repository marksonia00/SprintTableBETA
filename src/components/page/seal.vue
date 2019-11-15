<template>
	<v-container fluid>

	</v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
	name: 'Seal',
	props: {
		source: String,
	},
	data: () => ({
		dialog: {open: false, task: {}, target: {}, del: false},
		sprintdialog: {presprint: {}, pretask: [{PRIORITY: 2}]},		
	}),
	computed:{
		...mapGetters(["addspr"])
	},
	methods:{
		...mapActions(["setaddspr"])
	}
}
</script>