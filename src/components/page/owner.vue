<template>
	<v-container class="fill-height d-flex align-start" fluid>
		<v-row class="flex-nowrap overflow-auto">
			<v-col class="grey lighten-3" v-for="(state, stid) in mixin.state" :key="stid"
					data-role="drag-drop-container" 
					@drop="drop($event, stid)" 
					@dragover.prevent
			>
				<!-- ● inner page : View detail ● -->
				<v-row no-gutters>
					<v-col style="min-width: 245px; max-width: 245px;">
						<v-card class="mx-1" 
							v-for="(task, tkid) in taskfilter(stid)" 
							:key="tkid" 
							hover width="244" 
							draggable
							@click="dialog = {open: true, task: Object.assign({}, task), target: task, del: false}"
							@dragstart="dragstart($event, task)"
							@dragend="dragend()"
							:style="{borderLeft: `5px ${mixin.prior[task.PRIORITY].color} solid`}">
							<v-list-item dense>
								<v-list-item-content>
									<v-row no-gutters class="overline">
										<v-col>{{task.SPRINTID}}</v-col>
										<v-col class="text-right"> {{`${task.REMAININGPOINT} / ${task.TOTALPOINT}`}} </v-col>
									</v-row>
									<v-list-item-title class="body-1">{{task.NAME}}</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-card>								
					</v-col>
				</v-row>
			</v-col>
			<v-spacer class="grey lighten-3"></v-spacer> <!-- SPACER HERE !!! -->								
		</v-row>
        <!-- ■■ taskDialog component ■■ -->
        <v-dialog 
            v-model="dialog.open" 
            max-width="600px">
			<taskDialog v-bind.sync="dialog" />
		</v-dialog>
	</v-container>
</template>

<script>
import taskDialog from '../unit/taskDialog'
import { mapGetters, mapActions } from "vuex"
import mixindata from '../mixin/mixindata'

export default {
	name: 'Owner',
    components: { taskDialog },
    mixins: [mixindata],
	props: {
	source: String,
	},
	data: () => ({
		dialog: {open: false, task: {}, target: {}, del: false},    //Sync data => task dialog component
	}),
	computed:{
		...mapGetters(["logininfo", "tasklist", "seallist"])
	},
	methods:{
		taskfilter(state){
			return this.tasklist.filter(tk => tk.OWNER.trim() == this.logininfo 			// filter OWNER
												&& tk.STATUS == state 						// Sort STATUS
												&& !this.seallist.includes(tk.SPRINTID) )	// Not Sealed	
		},
        // ■■■■ Drag drop handle ■■■■
        dragstart(event, task){
			event.dataTransfer.setData('taskid', task.TASKID)
			event.dataTransfer.setData('status', task.STATUS)
        },
        drop(event, stid){
            if(event.dataTransfer.getData('status') != stid )
				this.mixinUpdater('dropStatus', event.dataTransfer.getData('taskid'), stid)   //! => '../mixin/mixindata'
        },
        dragend(event){
            event.dataTransfer.clearData()
        },
	}
}
</script>