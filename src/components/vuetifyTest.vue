<template>
  <v-app id="inspire">
    <!-- ■■■■ Top Navbar ■■■■ -->
	<v-app-bar app dense color="indigo darken" class="white--text">
		<v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
		<v-toolbar-title>{{navlist[title.page].title}}</v-toolbar-title>
		<v-icon class="ml-4" v-if="title.subsprint != null">mdi-chevron-right</v-icon>								
		<div class="ml-4" v-if="title.subsprint != null">{{title.subsprint}}</div>
		<template v-slot:extension v-if="title.page == 1 || title.page == 2">
			<v-row class="indigo lighten-1 flex-nowrap">
				<v-col v-for="(state, stid) in list.state" :key="stid" style="max-height: 47px;">
					<div class="title white--text" style="min-width: 245px; max-width: 245px;">
						{{state.name}}
					</div>
				</v-col>
				<v-spacer></v-spacer> <!-- SPACER HERE !!! -->
			</v-row>
			<v-tooltip left v-if="title.page == 1">  
				<template v-slot:activator="{ on }">
					<v-btn v-on="on"
							@click="sprintdialog.open = true"
							color="light-green accent-4" 
							class="mr-4 white--text" 
							absolute 
							fab 
							top 
							right>
							<v-icon>mdi-plus</v-icon>
					</v-btn>
				</template>
				<span>Add Sprint</span>
			</v-tooltip>
		</template>
    </v-app-bar>
    <!-- ■■■■ Side drawer ■■■■ -->
    <v-navigation-drawer v-model="drawer" width="139" stateless app>
        <v-list dense>
			<v-list-item-group v-model="title.page" color="primary">
				<v-list-item v-for="(nav, i) in navlist" :key="i" @click="listonclick(i)" :disabled="i == title.page">
					<v-list-item-action>
						<v-icon>{{nav.icon}}</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>{{nav.title}}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list-item-group>
        </v-list>
    </v-navigation-drawer>

    <v-content>
		<!-- ■■■■ Sprint page ■■■■ -->
		<v-container v-if="title.page == 1" class="fill-height d-flex align-start" fluid>
			<v-row no-gutters v-for="(sprint, spid) in sprintfilter()" :key="spid">
				<v-col>
					<v-row>
						<!--● View Detail ●-->
						<v-tooltip top v-if="edit.sprint != sprint">  
							<template v-slot:activator="{ on }">
								<v-btn text color="grey darken-3" class="title" v-on="on"
									@click="title.subsprint == null ? title.subsprint = sprint : title.subsprint = null">
									<v-icon v-if="title.subsprint == null" color="teal darken-2" left>mdi-label</v-icon>
									<v-icon v-if="title.subsprint != null" color="orange darken-2">mdi-arrow-left</v-icon>						
									{{sprint}}
								</v-btn>
							</template>
							<span v-if="title.subsprint == null">View Detail</span>
							<span v-else>Back to List</span>
						</v-tooltip>
						<!--● Edit Sprint ●-->
						<v-tooltip top v-if="edit.sprint == sprint">  
							<template v-slot:activator="{ on }">
								<v-btn text icon v-on="on" @click="editsprint(sprint, edit.value)">							
									<v-icon color="green darken-1">mdi-check</v-icon>
								</v-btn>
							</template>
							<span>check</span>
						</v-tooltip>
						<v-tooltip top>  
							<template v-slot:activator="{ on }">
								<v-btn text icon v-on="on" @click="edit.sprint == null ? edit = {sprint: sprint, value: sprint} : edit.sprint = null">							
									<v-icon v-if="edit.sprint != sprint" color="brown darken-1">mdi-pencil</v-icon>
									<v-icon v-else color="red darken-1">mdi-close</v-icon>
								</v-btn>
							</template>
							<span v-if="edit.sprint == sprint">close</span>
							<span v-else>Edit Sprint</span>
						</v-tooltip>
						<v-card v-if="edit.sprint == sprint" flat min-width='100' height="30">	
							<v-text-field 
								class="title"	
								autofocus						
								dense
								v-model="edit.value" 
							>
							</v-text-field>	
						</v-card>	
						<!--● Add task ●-->
						<v-tooltip top>  
							<template v-slot:activator="{ on }">
								<v-btn text icon v-on="on"
										@click="Addnewtask(sprint)">
									<v-icon color="light-green accent-4">mdi-file-plus</v-icon>													
								</v-btn>
							</template>
							<span>New Task</span>
						</v-tooltip>
						<v-spacer></v-spacer> <!-- SPACER HERE !!!  -->
						<!--● Seal Sprint ●-->
						<v-tooltip top>  
							<template v-slot:activator="{ on }">
								<v-btn v-on="on" color="orange accent-4" class="mr-3 white--text" icon><v-icon>mdi-package-down</v-icon></v-btn>
							</template>
							<span>Seal</span>
						</v-tooltip>
						<!--● Delete Sprint ●-->
						<v-tooltip top>  
							<template v-slot:activator="{ on }">
								<v-btn v-on="on" color="red accent-4" class="mr-3 white--text" icon><v-icon>mdi-trash-can-outline</v-icon></v-btn>
							</template>
							<span>Delete</span>
						</v-tooltip>
					</v-row>
					<!-- ● Task row ● -->	
					<v-row class="flex-nowrap overflow-auto">
						<v-col class="grey lighten-3" v-for="(state, stid) in list.state" :key="stid"
								data-role="drag-drop-container" 
								@drop="drop($event, stid, sprint)" 
								@dragover.prevent
						>
							<!-- ● inner page : View detail ● -->
							<v-row v-if="title.subsprint != null" no-gutters>
								<v-col style="min-width: 245px; max-width: 245px;">
									<v-card class="mx-1" v-for="(task, tkid) in taskfilter(sprint, stid)" :key="tkid" 
										hover width="244" 
										draggable
										@click="dialog = {open: true, task: Object.assign({}, task), target: task}"
										@dragstart="dragstart($event, task)"
                                        @dragend="dragend"
										:style="{borderLeft: `5px ${list.prior[task.PRIORITY].color} solid`}">
										<v-list-item dense>
											<v-list-item-content>
												<div class="overline">{{task.TASKID}}</div>
												<v-list-item-title class="body-1">{{task.NAME}}</v-list-item-title>
											</v-list-item-content>
											<v-list-item-content>
												<div class="overline text-right">
													{{`${task.REMAININGPOINT} / ${task.TOTALPOINT}`}}
												</div>
												<v-list-item-title class="body-1 text-right">{{task.OWNER}}</v-list-item-title>
											</v-list-item-content>
										</v-list-item>
									</v-card>								
								</v-col>								
							</v-row>
							<!-- ● inner page : Index List ● -->
							<v-row v-if="title.subsprint == null" no-gutters>
								<v-col :style="{minWidth: '245px', maxWidth: '245px', maxHeight: '128px', minHeight: '128px'}"
												class="overflow-auto">
									<v-badge v-for="(task, tkid) in taskfilter(sprint, stid)" :key="tkid"
											overlap color="blue-grey lighten-1" 
											:class="{'mt-2': tkid < 1 }" 
											:style="{opacity: focustask(task.OWNER),
													maxWidth: taskfilter(sprint, stid).length * 2 - 6 > tkid ? '47%' : '100%'}"										
											>
										<template v-slot:badge>
											<v-menu offset-y transition="slide-x-transition">
      											<template v-slot:activator="{ on: menu }">
													<v-tooltip top>  
														<template v-slot:activator="{ on: tooltip }">
															<div v-on="{ ...tooltip, ...menu}"
																@mouseover="focus.owner = task.OWNER"
																@mouseleave="focus.owner = null"
																>{{task.OWNER.substr(0,1)}}
															</div>
														</template>
														<span>{{task.OWNER}}</span>
													</v-tooltip>
												</template>
												<v-list dense>
													<v-list-item-group v-model="task.OWNER">
														<v-list-item v-for="(member, mid) in list.member" 
																	:key="mid" 
																	:value="member"
																	@click="UpdateTask('ownertag', task, member)">
															<v-list-item-title>{{ member }}</v-list-item-title>
														</v-list-item>
													</v-list-item-group>
												</v-list>
											</v-menu>	
										</template>
										<v-tooltip top v-model="focus[task.TASKID.trim()]" color="yellow accent-4">  
											<template v-slot:activator="{ on }">											
												<v-chip 											
													:color="list.prior[task.PRIORITY].color"
													:style="{borderLeft: `5px ${list.prior[task.PRIORITY].color} solid`, opacity: focustask(task.OWNER),
																maxWidth: taskfilter(sprint, stid).length * 2 - 6 > tkid ? '88%' : '100%'}"																
													text-color="black"
													class="body-1 mr-1 ml-3 mb-2" 
													outlined								 
													label	
													draggable
													:title="task.NAME"
													@dragstart="dragstart($event, task)"
													@dragend="dragend"	
													@mousemove="focus[task.TASKID.trim()] == true ? focus = {owner: null} : true"																			
													@click="dialog = {open: true, task: Object.assign({}, task), target: task, del: false}"	
												>															
													{{task.NAME}} 
												</v-chip>												
											</template>
											<span v-if="focus[task.TASKID.trim()]">Update</span>
										</v-tooltip>	
									</v-badge>
								</v-col>
							</v-row>
						</v-col>
						<v-spacer class="grey lighten-3"></v-spacer> <!-- SPACER HERE !!! -->
					</v-row>
				</v-col>
			</v-row>
			<!-- ■■ Sprint page : Task Dialog ■■ -->
			<v-dialog v-model="dialog.open" max-width="600px">
				<v-card>
					<v-card-title>
						<span class="headline">Task Profile</span><v-spacer></v-spacer>
						<span class="body-1 mx-2">{{dialog.task.SPRINTID}}</span>
						<span class="body-2 mx-2">{{dialog.task.TASKID}}</span>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-form v-model="rule.valid">	
								<v-row>
									<v-col cols="12" sm="8" md="8">
										<v-text-field 
											label="Task Name*" 
											v-model="dialog.task.NAME" 
											:rules="[v => !!v || 'Name is required']"
											required
											clearable
										>
										</v-text-field>
									</v-col>
									<v-col cols="6" sm="2" md="2">
										<v-text-field 
											label="Remain pt*" 
											type="number" 
											v-model="dialog.task.REMAININGPOINT" 
											required>
										</v-text-field>
									</v-col>
									<v-col cols="6" sm="2" md="2">
										<v-text-field label="Total pt*" type="number" v-model="dialog.task.TOTALPOINT" required></v-text-field>
									</v-col>
									<v-col cols="12" sm="6" md="4"> <!-- Owner slot !!! -->
										<v-select label="Owner*" 
													:items="list.member" 
													:rules="[v => !!v || 'Owner is required']"
													v-model="dialog.task.OWNER"
													@focus="edit.value = ''">
											<template v-slot:prepend-item>
												<v-list-item>	
													<v-text-field
														label="New Member" 
														v-model="edit.value" 
														:rules="[v => v.substr(0, 1) == v.substr(0, 1).toUpperCase() || 'first letter should be UpperCase',
																v => !list.member.map(mb => mb.substr(0, 1)).includes(v.substr(0, 1)) || 'duplicate first letter']"
														append-outer-icon="mdi-plus"
														@click:append-outer="Addmember()"
														dense>
													</v-text-field>
												</v-list-item>	
											</template>
										</v-select>
									</v-col>
									<v-col cols="12" sm="6" md="4">
										<v-select label="Priority" 
													item-text="name"
													item-value="value"
													:items="list.prior"
													v-model="dialog.task.PRIORITY"	
										>
										<template v-slot:item="{ item, index }">
											<span :style="{color: `${item.color}`}">{{item.name}}</span>
										</template>	
										<template v-slot:selection="{ item, index }">										
											<span :style="{color: `${item.color}`}">{{item.name}}</span>
										</template>
										</v-select>									
									</v-col>
									<v-col cols="12" sm="6" md="4">
										<v-select label="Status" 
													item-text="name"
													item-value="value"
													:items="list.state"
													v-model="dialog.task.STATUS"						
										></v-select>									
									</v-col>
									<v-col cols="12">
										<v-textarea label="Description" v-model="dialog.task.DESCRIPTION" rows="3"></v-textarea>
									</v-col>
								</v-row>
							</v-form>	
						</v-container>
						<span class="caption text-right">{{`Last Modify *${dialog.task.MODTIME}`}}</span>
					</v-card-text>
					<v-card-actions> <!-- dialog actions -->
						<v-spacer></v-spacer>
						<v-btn color="red darken-1" text @click="dialog.del = true" 
								:disabled="dialog.target == null">
								Delete
						</v-btn>
						<v-btn color="blue darken-1" text @click="dialog.open = false">
								Close
						</v-btn>
						<v-btn color="blue darken-1" text @click="UpdateTask('dialog', dialog.task, 'update')" 
								:disabled="JSON.stringify(dialog.target) == JSON.stringify(dialog.task) || !rule.valid">
								Save
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<!-- ● delete subdialog ● -->
			<v-dialog v-model="dialog.del" max-width="250">
				<v-card>
        			<v-card-title class="subtitle-1 red--text">Delete Task?</v-card-title>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn
							color="blue darken-1"
							text
							@click="dialog.del = false"
						>
							Cancel
						</v-btn>
						<v-btn
							color="red darken-1"
							text
							@click="UpdateTask('dialog', dialog.task, 'delete')"
						>
							Delete
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<!-- ■■ Sprint page : Sprint Dialog ■■ -->
			<v-dialog v-model="sprintdialog.open" max-width="600px">
				<v-card>
					<v-card-title>
						<span class="headline">New Sprint</span><v-spacer></v-spacer>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-form v-model="rule.valid">	
								<v-row dense>
									<v-col cols="12">
										<v-text-field 
											label="Sprint Name*" 
											v-model="sprintdialog.prename" 
											:rules="[v => !!v || 'Name is required']"
											required
											clearable
										></v-text-field>
									</v-col>
								</v-row>
								<!-- ● pretask ● -->
								<v-row v-for="(task, tid) in sprintdialog.pretask" :key="tid" dense>
									<v-col cols="6">
										<v-text-field 
											label="Task Name*" 
											v-model="task.NAME"
											:rules="[v => !!v || 'required']" 
											required
											clearable
										></v-text-field>
									</v-col>
									<v-col cols="3">
										<v-select label="Owner*" 
													:items="list.member" 
													:rules="[v => !!v || 'required']"
													v-model="task.OWNER"
													@focus="edit.value = ''">
											<template v-slot:prepend-item>
												<v-list-item>	
													<v-text-field
														label="New Member" 
														v-model="edit.value" 
														append-outer-icon="mdi-plus"
														:rules="[v => v.substr(0, 1) == v.substr(0, 1).toUpperCase() || 'first letter should be UpperCase',
																v => !list.member.map(mb => mb.substr(0, 1)).includes(v.substr(0, 1)) || 'duplicate first letter']"
														@click:append-outer="Addmember()"
														dense>
													</v-text-field>
												</v-list-item>	
											</template>									
										</v-select>									
									</v-col>
									<v-col cols="3">
										<v-select label="Priority" 
													item-text="name"
													item-value="value"
													:items="list.prior"
													v-model="task.PRIORITY"	
													:append-outer-icon="tid == 0 ? 'mdi-plus' : 'mdi-minus'"
													@click:append-outer="tid == 0 ? sprintdialog.pretask.push({OWNER: sprintdialog.pretask[0].OWNER, PRIORITY: 2}) 
																					: sprintdialog.pretask.splice(tid, 1)"
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
						<v-btn color="blue darken-1" text @click="sprintdialog.open = false">
								Close
						</v-btn>
						<v-btn color="blue darken-1" text @click="Addnewsprint()" :disabled="!rule.valid">
								Save
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-container>
		<!-- ■■■■ Task page ■■■■ -->
		<v-data-table
			v-if="title.page == 3"
			:headers="list.header"
			:items="list.task"
			:items-per-page="10"
			item-key="TASKID"
			show-select
			class="elevation-1">
			<template v-slot:item.point="{ item }">
        		{{ `${item.REMAININGPOINT} / ${item.TOTALPOINT}` }}
     		 </template>
		</v-data-table>
		<!-- ■■■■ Infomation Tag ■■■■ -->
		<v-snackbar
			v-model="infodialog.info" color="success"
			vertical right top :timeout="infodialog.infotimeout"
			>
			{{ infodialog.infomsg }}
			<v-btn
				color="indigo"
				text
				@click="infodialog.info = false"
			>
				Close
      		</v-btn>
    	</v-snackbar>
    </v-content>
	<v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import { log } from 'util'
import { mapGetters, mapActions } from "vuex"

  export default {
    name: 'vuetifyTest',
    props: {
      source: String,
    },
    data: () => ({
		focus: {owner: null},
		rule: {valid: true},
		dialog: {open: false, task: {}, target: {}, del: false},
		sprintdialog: {open: false, prename: "", pretask: [{PRIORITY: 2}]},		
		infodialog: {info: false, infomsg: "", infotimeout: 3000},
		list: {sprint: [], state: [], task: [], prior: [], member: [],
				header: [
					{ text: 'Task',		value: 'TASKID', align: 'left', sortable: false},
					{ text: 'Sprint',	value: 'SPRINTID' },
					{ text: 'Name',		value: 'NAME' },
					{ text: 'State',	value: 'STATUS' },
					{ text: 'info' ,  	value: 'DESCRIPTION',   sortable: true},
					{ text: 'Owner' ,   value: 'OWNER',         sortable: true},
					{ text: 'Prior' ,   value: 'PRIORITY',      sortable: true},
					{ text: 'Point' ,   value: 'point' },
					{ text: 'Modify' ,	value: 'MODTIME',       sortable: true},
				] },
		edit: {sprint: null, value: ''},
        title: {page: 1, subsprint: null},
        navlist: [  {title: 'Home', icon: 'mdi-home'}, 
                    {title: 'Sprint', icon: 'mdi-expand-all'},
					{title: 'Owner', icon: 'mdi-account-multiple'},
                    {title: 'Task', icon: 'mdi-file-table-box-multiple'},
					{title: 'Seal', icon: 'mdi-briefcase-edit'},
					{title: 'Timeline', icon: 'mdi-progress-clock'}
				],
		drawer: true,
		overlay: false,
	}), 
	computed:{
		...mapGetters(["tasklist"])
	},
	// sockets: {
	// 	connect: function () {
	// 		console.log('socket connected')
	// 	},
	// 	updateresponse: function (data) {  					// ! <<<< WebSocket Receive!
	// 		this.infodialog.info = false
	// 		console.log(`<<WebSock Receive: ${data}`);
	// 		this.infodialog.infomsg = `User ${data}`
	// 		this.infodialog.info = true
	// 		if(data.substr(0, 6) == 'update')
	// 			this.initlist()		
	// 		this.focus[data.substr(7, 6)] = true	
	// 	}
    // },
    methods:{
        listonclick(page){
            if(page == 0)
				this.$router.push('/helloworld')
		},
		focustask(ow){
			return ow == this.focus.owner || this.focus.owner == null ? 1 : .25
		},
		sprintfilter(){
			return this.title.subsprint != null ? [this.title.subsprint] :this.list.sprint
		},
		taskfilter(sprint, state){
			return this.list.task.filter(task => task.SPRINTID.trim() == sprint && task.STATUS == state)
		},
        // ■■■■ Drag drop handle ■■■■
        dragstart(event, task){
			event.dataTransfer.setData('taskid', task.TASKID)
			event.dataTransfer.setData('status', task.STATUS)
			event.dataTransfer.setData('sprint', task.SPRINTID)
        },
        drop(event, stid, sprint){
            if(event.dataTransfer.getData('status') != stid && event.dataTransfer.getData('sprint') == sprint){
				let tkindex = this.list.task.findIndex(tk => tk.TASKID == event.dataTransfer.getData('taskid'))
				this.list.task[tkindex].STATUS = stid
				this.list.task[tkindex].MODTIME = new Date().toLocaleString()
				this.UpdateTask('drop', this.list.task[tkindex], '')
			}
        },
        dragend(event){
            event.dataTransfer.clearData()
		},
		// ■■■■ Set Sprint  ■■■■
		Addnewsprint(){
			let tentid = this.list.task.map(tk => parseInt(tk.TASKID.trim(), 10))
										.reduce((now, next) => next > now ? next : now)						
			let newtask = {TASKID: '',
							SPRINTID: this.sprintdialog.prename,
							NAME: '',
							STATUS: 0,
							DESCRIPTION: '',
							OWNER: '',
							PRIORITY: '',
							REMAININGPOINT: 20,
							TOTALPOINT: 20,
							MODTIME: new Date().toLocaleString()
						}
			this.sprintdialog.pretask.forEach(tk => {
				newtask.TASKID = (tentid - tentid % 100 + 100 + this.sprintdialog.pretask.indexOf(tk) + 1).toString()
				newtask.NAME = tk.NAME
				newtask.OWNER = tk.OWNER
				newtask.PRIORITY = tk.PRIORITY
				this.list.task.push(Object.assign({}, newtask))
			})
			this.list.sprint = new Set(this.list.task.map(task => task.SPRINTID.trim()).sort())
			this.sprintdialog = {open: false, prename: "", pretask: [{PRIORITY: 2}]}
		},
		editsprint(spr, newspr){
			this.list.task.filter(tk => tk.SPRINTID == spr).forEach(tk => tk.SPRINTID = newspr)
			this.list.sprint = new Set(this.list.task.map(task => task.SPRINTID.trim()).sort())
			this.edit.sprint = null
			this.UpdateTask('editsprint', {NAME: newspr, TASKID: ''}, '')
		},
		// ■■■■ Set task ■■■■
		Addnewtask(sprint){
			let tentid = this.list.task.filter(tk => tk.SPRINTID.trim() == sprint)
										.map(tk => parseInt(tk.TASKID.trim(), 10))
										.reduce((now, next) => next > now ? next : now)
			this.dialog.target = null
			this.dialog.task = {TASKID: (tentid+1).toString(),
								SPRINTID: sprint,
								NAME: "",
								STATUS: 0,
								DESCRIPTION: "",
								OWNER: "",
								PRIORITY: 3,
								REMAININGPOINT: 20,
								TOTALPOINT: 20,
								MODTIME: ""}
			this.dialog.open = true
		},
		// ■■■■ Set member ■■■■
		Addmember(){
			!this.list.member.map(mb => mb.substr(0, 1)).includes(this.edit.value.substr(0, 1)) 
			&& this.edit.value != '' 
			&& this.edit.value.substr(0, 1) == this.edit.value.substr(0, 1).toUpperCase() 
			&& this.edit.value.substr(0, 1) != ' '?
			this.list.member.push(this.edit.value): 
			this.edit.value = ''
		},
		// ■■■■ Data Access ■■■■
		UpdateTask(type, task, offset){
			if(type == 'dialog'){ 
				if(this.dialog.target != null){  														// *upadate task from dialog
					if(offset == "update"){
						let index = this.list.task.findIndex(tk => tk.TASKID == this.dialog.target.TASKID) 
						this.list.task[index] = this.dialog.task
						this.list.task[index].MODTIME = new Date().toLocaleString()
					}
					else{																				// *delete task from dialog
						let index = this.list.task.findIndex(tk => tk.TASKID == this.dialog.target.TASKID) 
						this.list.task.splice(index, 1)
					}
				}
				else{																					// *create task from dialog
					this.dialog.task.MODTIME = new Date().toLocaleString()
					this.list.task.push(this.dialog.task)
				}
				this.dialog.del = false
				this.dialog.open = false
			}
			else if(type == 'ownertag'){
				task.OWNER = offset																	// *upadate task from Tag
				task.MODTIME = new Date().toLocaleString()
			}
				this.updatelist(this.list.task)
				// this.$socket.emit('update', `update ${task.TASKID} ${task.NAME}`) 		// ! WebSocket Send! >>>>
		},

		// ■■■■ Initialize ■■■■		
		async initlist(){
			this.overlay = true	
			let getList
			do{	getList = await this.gettaskinfo(0)}
			while( JSON.stringify(getList) == JSON.stringify(this.list.task) )
			this.list.task = getList
			this.list.sprint = new Set(this.list.task.map(task => task.SPRINTID.trim()).sort())
			this.list.member = Array.from(new Set(this.list.task.map(task => task.OWNER.trim()).sort()))
			this.title.extend = true
			
			this.list.state = [
				{value: 0, name: "to do", color: "teal accent-4"}, 
				{value: 1, name: "in process", color: "light-blue accent-4"}, 
				{value: 2, name: "checking", color: "amber accent-4"}, 
				{value: 3, name: "done", color: "light-green accent-4"}, 
				] 	
			this.list.prior = [
				{value: 0, name: 'Highest', color: '#E53935'}, 
				{value: 1, name: 'High',    color: '#FFB300'}, 
				{value: 2, name: 'Mid',     color: '#1565C0'}, 
				{value: 3, name: 'Low',     color: '#37474F'}
				]				
			this.overlay = false
		},
		...mapActions(["gettaskinfo", "updatelist","bindListRef"])
	},
	created(){
		this.initlist()
		// this.$socket.emit('update', 'login') // ! WebSocket Send! >>>>
		
	},
  }


  		//■■■■ pure WebSocket ■■■■
	// 	initWebSocket(){
	// 		const wsuri = "ws://127.0.0.1:55688/Laputa";
	// 		this.websock = new WebSocket(wsuri);
	// 		this.websock.onmessage = this.websocketonmessage;
	// 		this.websock.onopen = this.websocketonopen;
	// 		this.websock.onerror = this.websocketonerror;
	// 		this.websock.onclose = this.websocketclose;
    //   },
	// 	websocketonopen(){ //create ws
	// 		// this.websocketsend("BALUS");
	// 	},
	// 	websocketonerror(){	//reconnect
	// 		this.initWebSocket();
	// 	},
	// 	websocketonmessage(e){ //Receive data
	// 		if(e.data != this.dialog.prevmsg ){
	// 			this.dialog.prevmsg = e.data
	// 			console.log(`<<WebSock Receive: ${e.data}`);
	// 			this.dialog.infomsg = `User update ${e.data}`
	// 			this.dialog.info = true
	// 			this.initlist()
	// 		}
	// 	},
	// 	websocketsend(Data){//Send data
	// 		console.log(`>>WebSock Send: ${Data}`);
	// 		this.websock.send(Data);
	// 	},
	// 	websocketclose(e){  //Close WS
	// 		console.log('closeWS',e);
	// 		this.initWebSocket();
	// 	},
</script>

<style scoped>
::-webkit-scrollbar{
  width: 2px;
  transform: translateX(7px);}
::-webkit-scrollbar-track{ 
  background: #f1f1f1;}
::-webkit-scrollbar-thumb{ 
  background: #888}
</style>

