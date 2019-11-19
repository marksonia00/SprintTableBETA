<template>
	<v-container fluid>
		<v-row no-gutters 
			v-for="(sprint, spid) 
				in (Array.from(new Set(tasklist.map(task => task.SPRINTID.trim())
												.filter(sp => seallist.includes(sp) )
												.sort())))"     
			:key="spid"
		>
			<v-col>
				<!--● Seal Sprint ●-->
				<v-tooltip top>  
					<template v-slot:activator="{ on }">
						<v-btn v-on="on" 
							color="cyan" 
							class="mr-3 white--text" 
							icon
							@click="unseal(sprint)"
						>
							<v-icon>mdi-package-up</v-icon>
						</v-btn>
					</template>
					<span>Unseal</span>
				</v-tooltip>
				<!--● Delete Sprint ●-->
				<v-tooltip top>  
					<template v-slot:activator="{ on }">
						<v-btn icon v-on="on" @click="dialog = {open: false, task: {SPRINTID: sprint}, target: {STATUS: 'DELETE'}, del: true}"
								color="red accent-4" 
								class="mr-3 white--text">
							<v-icon>mdi-trash-can-outline</v-icon>
						</v-btn>
					</template>
					<span>Delete</span>
				</v-tooltip>
				<span class="title">{{sprint}}</span>
				<v-spacer></v-spacer> <!-- SPACER HERE !!!  -->			
			</v-col>
		</v-row>
        <!-- ● delete dialog ● -->
        <v-dialog v-model="dialog.del" max-width="250"
		>
            <delDialog 
				@callback="sprintaction()" 
				@dismiss="dialog.del=false"
			/>
        </v-dialog>
	</v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import delDialog from '../unit/delDialog'

export default {
	name: 'Seal',
    components: { delDialog },
	props: {
		source: String,
	},
	data: () => ({
		dialog: {open: false, task: {}, target: {}, del: false},
		sprintdialog: {presprint: {}, pretask: [{PRIORITY: 2}]},		
	}),
	computed:{
		...mapGetters(["tasklist", "seallist", "addspr"])
	},
	methods:{
		//● unseal Sprint ●
		unseal(spr){
			let templist = this.seallist
			let index = templist.findIndex(sp => sp == spr)
			templist.splice(index, 1)
			this.setseallist(templist)
		},
		sprintaction(){ 
            let msg = ''
            let templist = this.tasklist 
            if(this.dialog.task.SPRINTID != '1_STB維護'){
				templist.filter(tk => tk.SPRINTID.trim() == this.dialog.task.SPRINTID)
								.forEach(ftk => templist.splice(templist.findIndex(tk => tk.TASKID == ftk.TASKID), 1))
				msg = `${this.dialog.task.SPRINTID} delete`  
				this.unseal(this.dialog.task.SPRINTID)               
				this.dialog = {open: false, task: {}, target: {}, del: false}
			}
            this.mixinUpdater('submitTask', templist, msg)                     //! => '../mixin/mixindata'
		},
		...mapActions(["setseallist"])
    },       
}
</script>