<template>
	<v-container fluid>
		<span>{{dialog}}</span><br>
		<span>{{sprintdialog}}</span><br>
		<v-btn @click="dialog.open = true">task</v-btn>
		<v-btn @click="setaddspr(true)">sprint</v-btn>
		<v-text-field label="NAME*" v-model="dialog.task.NAME" />
		<!-- taskDialog component -->
		<v-dialog v-model="dialog.open" max-width="600px">	
			<taskDialog v-bind.sync="dialog"></taskDialog>
		</v-dialog>
		<!-- sprintdialog component -->
		<v-dialog v-model="addspr" max-width="600px" 
				@click:outside="setaddspr(false)">	
			<sprintDialog v-bind.sync="sprintdialog"></sprintDialog>
		</v-dialog>
	</v-container>
</template>

<script>
import taskDialog from '../unit/taskDialog'
import sprintDialog from '../unit/sprintDialog'
import { mapGetters, mapActions } from "vuex"

export default {
	name: 'Seal',
	components: { taskDialog, sprintDialog },
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