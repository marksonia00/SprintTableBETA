<template>
	<v-container class="fill-height d-flex align-start" fluid>
		<v-row	v-if="!$vuetify.breakpoint.smAndDown" 
				class="flex-nowrap overflow-auto">
			<v-col  class="grey lighten-3" v-for="(state, stid) in mixin.state" :key="stid"
					data-role="drag-drop-container"
					:style="{minWidth: style.chipwmd, maxWidth: style.chipwmd}" 
					@drop="drop($event, stid, null)" 
					@dragover.prevent
			>
				<!-- ● inner page : View detail ● -->
				<v-row no-gutters>
					<v-col :style="{minWidth: style.chipwmd, maxWidth: style.chipwmd}">
						<v-card class="mx-1" 
							v-for="(task, tkid) in taskfilter(stid)" 
							:key="tkid" 
							hover width="244" 
							draggable
							@click="dialog = {open: true, task: Object.assign({}, task), target: task, del: false}"
							@dragstart="dragstart($event, task)"
							@dragend="dragend"
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
		</v-row>
		<v-row v-if="$vuetify.breakpoint.smAndDown">
			<v-carousel 
				class="grey lighten-3" 
				v-model="carousel"
				light 
				hide-delimiters
			>
				<v-carousel-item v-for="(state, stid) in mixin.state" :key="stid">
					<v-col>
						<v-card class="mx-auto" width="257" 
							v-for="(task, tkid) in taskfilter(stid)" 
							:key="tkid" 
							@click="dialog = {open: true, task: Object.assign({}, task), target: task, del: false}"
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
					</v-col>				</v-carousel-item>
			</v-carousel>
			<v-spacer class="grey lighten-3"></v-spacer> <!-- SPACER HERE !!! -->								
		</v-row>
        <!-- ■■ taskDialog component ■■ -->
        <v-dialog v-model="dialog.open" max-width="600px">
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
		style: {chipwmd: '270px', chipwsm: '75px'},
		dialog: {open: false, task: {}, target: {}, del: false},    //Sync data => task dialog component
	}),
	computed:{
        carousel: {
            get () {
                return this.$store.state.statetab
            },
            set (value) {
                this.setvxprop({muta: 'statetab', data: value}) 
            }        
        },
		...mapGetters(["logininfo", "tasklist", "seallist"])
	},
	methods:{
		taskfilter(state){
			return this.tasklist.filter(tk => tk.OWNER.substr(0, 1).toUpperCase() == this.logininfo.substr(0, 1).toUpperCase() 	// filter OWNER
												&& tk.STATUS == state 													// Sort STATUS
												&& !this.seallist.includes(tk.SPRINTID) )								// Not Sealed	
		},
		...mapActions(["setvxprop"])
	}
}
</script>