<template>
	<v-card>
		<v-card-title>
			<span class="headline">New Sprint</span><v-spacer></v-spacer>
		</v-card-title>
		<v-card-text>
			<v-container>
				<v-form v-model="rule.valid">
					<!-- ● presprint  ● -->	
					<v-row dense>
						<v-col cols="12">
							<v-text-field 
								label="Sprint Name*" 
								v-model="presprint.NAME" 
								:rules="[v => !!v || 'Name is required']"
								required
								clearable
							></v-text-field>
						</v-col>
					</v-row>
					<!-- ● pretask ● -->
					<v-row v-for="(task, tid) in pretask" :key="tid" dense>
						<v-col cols="6">                            <!-- Task Name -->
							<v-text-field 
								label="Task Name*" 
								v-model="task.NAME"
								:rules="[v => !!v || ' required']"
								required
								clearable
							></v-text-field>
						</v-col>
						<v-col cols="3">                             <!-- Owner -->
							<v-select  
								label="Owner*" 
								:items="mixin.member" 
								:rules="[v => !!v || 'required']"
								v-model="task.OWNER"
								@focus="mixin.value = ''">
								<template v-slot:prepend-item>
									<v-list-item>	
										<v-text-field
											label="New Member" 
											v-model="mixin.value" 
											append-outer-icon="mdi-plus"
											:rules="[v => v.substr(0, 1) == v.substr(0, 1).toUpperCase() || 'first letter should be UpperCase',
													v => !mixin.member.map(mb => mb.substr(0, 1)).includes(v.substr(0, 1)) || 'duplicate first letter']"
											@click:append-outer="Addmember()"
											dense>
										</v-text-field>
									</v-list-item>	
								</template>									
							</v-select>									
						</v-col>
						<v-col cols="3">                               <!-- Priority -->
							<v-select label="Priority" 
										item-text="name"
										item-value="value"
										:items="mixin.prior"
										v-model="task.PRIORITY"	
										:append-outer-icon="tid == 0 ? 'mdi-plus' : 'mdi-minus'"
										@click:append-outer="tid == 0 ? pretask.push({OWNER: pretask[0].OWNER, PRIORITY: 2}) 
																		: pretask.splice(tid, 1)"
							>
								<template v-slot:item="{ item, index }">
									<span :style="{color: `${item.color}`}">{{item.name}}</span>
								</template>	
								<template v-slot:selection="{ item, index }">										
									<span :style="{color: `${item.color}`}">{{item.name}}</span>
								</template>
							</v-select>										
						</v-col>
					</v-row>																	
				</v-form>
			</v-container>
		</v-card-text>
		<v-card-actions> <!-- dialog actions -->
			<v-spacer></v-spacer>
			<v-btn color="blue darken-1" text @click="setaddspr(false)">
					Close
			</v-btn>
			<v-btn color="blue darken-1" text @click="Addnewsprint()" :disabled="!rule.valid">
					Save
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import mixindata from '../mixin/mixindata'

export default {
	name: 'sprintDialog',
	mixins: [mixindata],
    props: ['presprint', 'pretask'],
	data: () => ({
		rule: {valid: true}, 
	}),
	computed:{
		...mapGetters(["tasklist"])
	},
	methods:{
		Addnewsprint(){
			let templist = this.tasklist
			let tentid = this.tasklist.map(tk => parseInt(tk.TASKID.trim(), 10))
										.reduce((now, next) => next > now ? next : now)						
			let newtask = Object.assign({}, this.preaddtask) 
			newtask.SPRINTID = this.presprint.NAME,
			newtask.MODTIME = new Date().toLocaleString()

			this.pretask.forEach(tk => {
				newtask.TASKID = (tentid - tentid % 100 + 100 + this.sprintdialog.pretask.indexOf(tk) + 1).toString()
				newtask.NAME = tk.NAME
				newtask.OWNER = tk.OWNER
				newtask.PRIORITY = tk.PRIORITY
				templist.push(Object.assign({}, newtask))
			})
			this.mixinUpdater('submitTask', templist, '')		//! => '../mixin/mixindata'
			this.$emit('update:presprint', {})
			this.$emit('update:pretask', {PRIORITY: 2})
			this.setaddspr(false)
		},
		...mapActions(["setaddspr"])
	}
}
</script>