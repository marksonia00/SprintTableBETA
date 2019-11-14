<template>
<!-- ■■■■ Sprint page ■■■■ -->
    <v-container class="fill-height d-flex align-start" fluid>
        <v-row no-gutters 
            v-for="(sprint, spid) 
                    in (title.subsprint != null ? [title.subsprint] 
                        : Array.from(new Set(tasklist.map(task => task.SPRINTID.trim()).sort())))" :key="spid">
            <v-col>
                <!-- ● Title action row ● -->
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
                    <!--● Edit Sprint : check ●-->
                    <v-tooltip top v-if="edit.sprint == sprint">  
                        <template v-slot:activator="{ on }">
                            <v-btn text icon v-on="on" @click="sprintaction('edit', edit.value)">							
                                <v-icon color="green darken-1">mdi-check</v-icon>
                            </v-btn>
                        </template>
                        <span>check</span>
                    </v-tooltip>
                    <!--● Edit Sprint : open & close ●-->                    
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
                    <!--● Edit Sprint : input ●-->                                        
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
                                    @click="dialog = {open: true, task: Object.assign({}, mixin.preaddtask), target: sprint, del: false}">
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
                            <v-btn icon v-on="on" @click="dialog = {open: false, task: {SPRINTID: sprint}, target: {STATUS: 'DELETE'}, del: true}"
                                    color="red accent-4" 
                                    class="mr-3 white--text">
                                <v-icon>mdi-trash-can-outline</v-icon>
                            </v-btn>
                        </template>
                        <span>Delete</span>
                    </v-tooltip>
                </v-row>
                <!-- ● Task row ● -->	
                <v-row class="flex-nowrap overflow-auto">
                    <v-col class="grey lighten-3" v-for="(state, stid) in mixin.state" :key="stid"
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
                                    @click="dialog = {open: true, task: Object.assign({}, task), target: task, del: false}"
                                    @dragstart="dragstart($event, task)"
                                    @dragend="dragend"
                                    :style="{borderLeft: `5px ${mixin.prior[task.PRIORITY].color} solid`}">
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
                                        :style="{opacity: task.OWNER == focus.owner || focus.owner == null ? '1' : '.25',
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
                                                    <v-list-item v-for="(member, mid) in Array.from(new Set(tasklist.map(task => task.OWNER.trim()).sort()))" 
                                                                :key="mid" 
                                                                :value="member"
                                                                @click="mixinUpdater('ownerTag', task.TASKID, member)">
                                                        <v-list-item-title>{{ member }}</v-list-item-title>
                                                    </v-list-item>
                                                </v-list-item-group>
                                            </v-list>
                                        </v-menu>	
                                    </template>
                                    <v-tooltip top v-model="focus[task.TASKID.trim()]" color="yellow accent-4">  
                                        <template v-slot:activator="{ on }">											
                                            <v-chip 											
                                                :color="mixin.prior[task.PRIORITY].color"
                                                :style="{borderLeft: `5px ${mixin.prior[task.PRIORITY].color} solid`, 
                                                            opacity: task.OWNER == focus.owner || focus.owner == null ? '1' : '.25',
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
                                                <span :class="{transitionname: taskfilter(sprint, stid).length * 2 - 6 > tkid}"
                                                        :style="{maxWidth: '100%'}">
                                                    {{task.NAME}}
                                                </span>
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
        
        <!-- ■■ taskDialog component ■■ -->
        <v-dialog 
            v-model="dialog.open" 
            max-width="600px">
			<taskDialog v-bind.sync="dialog" />
		</v-dialog>
        
        <!-- ■■ Sprintdialog component ■■ -->
        <v-dialog 
            v-model="addspr" 
            max-width="600px" 
            @click:outside="setaddspr(false)">
			<sprintDialog v-bind.sync="sprintdialog" />
		</v-dialog>

        <!-- ● delete dialog ● -->
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
                        @click="dialog.target.STATUS == 'DELETE' ?
                                sprintaction('delete') : deletetask()"                                   
                    >
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        
        <v-overlay :value="overlay">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
    
    </v-container>
</template>

<script>
import { log } from 'util'
import taskDialog from '../unit/taskDialog'
import sprintDialog from '../unit/sprintDialog'
import { mapGetters, mapActions } from "vuex"
import mixindata from '../mixin/mixindata'

  export default {
    name: 'Sprint',
    components: { taskDialog, sprintDialog },
    mixins: [mixindata],
    data: () => ({
		focus: {owner: null},
		rule: {valid: true},
		dialog: {open: false, task: {}, target: {}, del: false},
		sprintdialog: {presprint: {}, pretask: [{PRIORITY: 2}]},		
		list: {task: []},
		edit: {sprint: null, value: ''},
        title: {subsprint: null},
		overlay: false,
	}), 
	computed:{
		...mapGetters(["tasklist", "titleinfo", "addspr"])
	},
    methods:{
        // ■■■■ Filter task by "sprint" & "status" ■■■■
		taskfilter(sprint, state){
			return this.tasklist.filter(task => task.SPRINTID.trim() == sprint && task.STATUS == state)
		},
        // ■■■■ Drag drop handle ■■■■
        dragstart(event, task){
			event.dataTransfer.setData('taskid', task.TASKID)
			event.dataTransfer.setData('status', task.STATUS)
			event.dataTransfer.setData('sprint', task.SPRINTID)
        },
        drop(event, stid, sprint){
            if(event.dataTransfer.getData('status') != stid 
                && event.dataTransfer.getData('sprint') == sprint){
				    this.mixinUpdater('dropStatus', event.dataTransfer.getData('taskid'), stid)   //! => '../mixin/mixindata'
			}
        },
        dragend(event){
            event.dataTransfer.clearData()
        },
        // ■■■■ Delete dialog ■■■■
        deletetask(){                                                                           //! => '../mixin/mixindata'
            this.mixinUpdater('dialogDelete', this.dialog.task.TASKID, '')
            this.dialog = {open: false, task: {}, target: {}, del: false}
        },
		// ■■■■ Title Action row ■■■■
		sprintaction(type, spr, newspr){ 
            let templist = this.tasklist               
            if(type == 'edit'){
                templist.filter(tk => tk.SPRINTID == spr).forEach(tk => tk.SPRINTID = newspr)
                this.edit.sprint = null
            }
            else if(type == 'delete'){
                if(this.dialog.task.SPRINTID != '1_STB維護' && this.dialog.task.SPRINTID != '2_學習地圖' && this.dialog.task.SPRINTID != '3_線上任務' )
                    templist.filter(tk => tk.SPRINTID.trim() == this.dialog.task.SPRINTID)
                                    .forEach(ftk => templist.splice(templist.findIndex(tk => tk.TASKID == ftk.TASKID), 1))
                this.dialog = {open: false, task: {}, target: {}, del: false}
            }
            this.mixinUpdater('submitTask', templist, '')                                       //! => '../mixin/mixindata'
        },       
		// ■■■■ Initialize ■■■■		
		async initlist(){
			this.overlay = true	
			// let getList
			// do{	getList = await this.gettaskinfo(0)}
			// while( JSON.stringify(getList) == JSON.stringify(this.list.task) )
            // this.list.task = getList
            await this.gettaskinfo(0)			
			this.overlay = false
		},
		...mapActions(["gettaskinfo", "setaddspr"])
	},
	created(){
		this.initlist()		
	},
  }
</script>

<style scoped>
::-webkit-scrollbar{
    height: 2px;
    width: 2px;
    transform: translateX(7px);}
::-webkit-scrollbar-track{ 
    background: #f1f1f1;}
::-webkit-scrollbar-thumb{ 
    background: #888}

.transitionname{
    background: linear-gradient(to right, #000000, #000000 75%, #B0BEC5 90%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
}
</style>