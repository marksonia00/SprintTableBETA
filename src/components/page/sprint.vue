<template>
<!-- ■■■■ Sprint page ■■■■ -->
    <v-container class="fill-height d-flex align-start" fluid>
        <v-row no-gutters 
            v-for="(sprint, spid) 
                    in (subtitle != null ? [subtitle] 
                        : Array.from(new Set(tasklist.map(task => task.SPRINTID.trim())
                                                    .filter(sp => !seallist.includes(sp) )
                                                    .sort())))"     
                                                    :key="spid">
            <v-col>
                <!-- ● Title action row ● -->
                <v-row>
                    <!--● View Detail ●-->
                    <v-tooltip top v-if="edit.sprint != sprint">  
                        <template v-slot:activator="{ on }">
                            <v-btn text color="grey darken-3" class="title" v-on="on"
                                @click="subtitle == null ? setvxprop({muta: 'subtitle', data: sprint}) : setvxprop({muta: 'subtitle', data: null})">
                                <v-icon v-if="subtitle == null" color="teal darken-2" left>mdi-label</v-icon>
                                <v-icon v-if="subtitle != null" color="orange darken-2">mdi-arrow-left</v-icon>						
                                {{sprint}}
                            </v-btn>
                        </template>
                        <span v-if="subtitle == null">View Detail</span>
                        <span v-else>Back to List</span>
                    </v-tooltip>
                    <!--● Edit Sprint : check ●-->
                    <v-tooltip top v-if="edit.sprint == sprint">  
                        <template v-slot:activator="{ on }">
                            <v-btn text icon v-on="on" @click="sprintaction('edit', sprint, edit.value)">							
                                <v-icon color="green darken-1">mdi-check</v-icon>
                            </v-btn>
                        </template>
                        <span>check</span>
                    </v-tooltip>
                    <!--● Edit Sprint : open & close ●-->                    
                    <v-tooltip top v-if="!($vuetify.breakpoint.smAndDown && $store.state.subtitle == null)">  
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
                    <v-tooltip top v-if="!($vuetify.breakpoint.smAndDown && $store.state.subtitle == null)">  
                        <template v-slot:activator="{ on }">
                            <v-btn text icon v-on="on"
                                    @click="dialog = {open: true, task: Object.assign({}, mixin.preaddtask), target: sprint, del: false}">
                                <v-icon color="light-green accent-4">mdi-file-plus</v-icon>													
                            </v-btn>
                        </template>
                        <span>New Task</span>
                    </v-tooltip>
                    <v-spacer v-if="!$vuetify.breakpoint.smAndDown"></v-spacer> <!-- SPACER HERE !!!  -->
                    <!--● Seal Sprint ●-->
                    <v-tooltip top v-if="!($vuetify.breakpoint.smAndDown && $store.state.subtitle == null)">  
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on" 
                                color="orange accent-4" 
                                class="mr-3 white--text" 
                                @click="setvxlist({muta: 'seallist', data: seallist.concat([sprint])})"
                            >
                                <v-icon>mdi-package-down</v-icon>
                            </v-btn>
                        </template>
                        <span>Seal</span>
                    </v-tooltip>
                    <!--● Delete Sprint ●-->
                    <v-tooltip top v-if="!($vuetify.breakpoint.smAndDown && $store.state.subtitle == null)">  
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
                <!-- ● RWD trail ● -->
                <v-row v-if="$vuetify.breakpoint.smAndDown" no-gutters>
                    <v-col v-if="subtitle == null"
                            @click="setvxprop({muta: 'subtitle', data: sprint})">
                        <v-chip-group >
                            <v-chip v-for="(state, stid) in mixin.state" :key="stid"
                                    :color="state.color" outlined>
                                <v-icon left :color="state.color">{{state.icon}}</v-icon>
                                {{ taskfilter(sprint, stid).length }}
                            </v-chip>
                        </v-chip-group>                    
                    </v-col>
                    <v-col v-if="subtitle != null">                    
                        <v-carousel 
                            class="grey lighten-3" 
                            v-model="carousel"
                            light 
                            hide-delimiters
                            :style="{maxHeight: '64vh'}"
                        >
                            <v-carousel-item v-for="(state, stid) in mixin.state" :key="stid">
                                <v-col class="overflow-auto">
                                    <v-card class="mx-auto" width="257" 
                                            v-for="(task, tkid) in taskfilter(sprint, stid)" :key="tkid" 
                                        @click="dialog = {open: true, task: Object.assign({}, task), target: task, del: false}"
                                        :style="{borderLeft: `5px ${mixin.prior[task.PRIORITY].color} solid`}">
                                        <v-list-item dense>
                                            <v-list-item-content>
                                                <v-row no-gutters class="overline">
                                                    <v-col> {{`${task.REMAININGPOINT} / ${task.TOTALPOINT}`}} </v-col>
                                                    <v-col class="text-right">{{task.OWNER}}</v-col>
                                                </v-row>
                                                <v-list-item-title class="body-1">{{task.NAME}}</v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-card>								
                                </v-col>				                        
                            </v-carousel-item>
                        </v-carousel>
                    </v-col>
                </v-row>
                <!-- ● Task row ● -->	
                <v-row v-if="!$vuetify.breakpoint.smAndDown" class="flex-nowrap overflow-auto">
                    <v-col 
                        v-for="(state, stid) in mixin.state" :key="stid"
                        class="grey lighten-3" 
                        data-role="drag-drop-container" 
                        @drop="drop($event, stid, sprint)" 
                        @dragover.prevent
                    >
                        <!-- ● inner page : View detail ● -->
                        <v-row v-if="subtitle != null" no-gutters>
                            <v-col :style="{minWidth: style.chipwmd, maxWidth: style.chipwmd}">
                                <v-card class="mx-1" 
                                    v-for="(task, tkid) in taskfilter(sprint, stid)" 
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
                                                <v-col> {{`${task.REMAININGPOINT} / ${task.TOTALPOINT}`}} </v-col>
                                                <v-col class="text-right">{{task.OWNER}}</v-col>
                                            </v-row>
                                            <v-list-item-title class="body-1">{{task.NAME}}</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-card>								
                            </v-col>								
                        </v-row>
                        <!-- ● inner page : Index List ● -->
                        <v-row v-if="subtitle == null" no-gutters>  <!-- breakpoint -->
                            <v-col 
                                                              
                                :style="{minWidth: style.chipwmd, maxWidth: style.chipwmd, 
                                        maxHeight: '128px', minHeight: '128px',}"
                                        class="overflow-auto">
                                <v-badge v-for="(task, tkid) in taskfilter(sprint, stid)" :key="tkid"
                                        overlap 
                                        :color="logininfo.substr(0, 1).toUpperCase() == task.OWNER.substr(0,1).toUpperCase()?
                                                 'indigo' : 'blue-grey lighten-1' " 
                                        :class="{'mt-2': tkid < 1 }"
                                        :style="{opacity: task.OWNER == focus.owner || focus.owner == null ? '1' : '.25',
                                                maxWidth: taskfilter(sprint, stid).length * 2 - 6 > tkid ? '47%' : '88%',}"										
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
                                                                @click="mixinUpdater('ownerTag', {list: null, id: task.TASKID}, member)">
                                                        <v-list-item-title>{{ member }}</v-list-item-title>
                                                    </v-list-item>
                                                </v-list-item-group>
                                            </v-list>
                                        </v-menu>	
                                    </template>
                                    <v-tooltip 
                                        top
                                        v-model="isUpdate[task.TASKID.trim()]" 
                                        color="yellow darken-4">  
                                        <template v-slot:activator="{ on }">											
                                            <v-chip 											
                                                :color="mixin.prior[task.PRIORITY].color"
                                                :style="{border: `1px ${mixin.prior[task.PRIORITY].color} solid`,
                                                            borderLeft: `5px ${mixin.prior[task.PRIORITY].color} solid`, 
                                                            opacity: task.OWNER == focus.owner || focus.owner == null ? '1' : '.25',
                                                            maxWidth: taskfilter(sprint, stid).length * 2 - 6 > tkid ? '88%' : '93%',
                                                            backgroundColor: 'white'}"																
                                                text-color="black"
                                                class="body-1 mr-1 ml-3 mb-2" 
                                                label	
                                                draggable
                                                :title="task.NAME"
                                                @dragstart="dragstart($event, task)"
                                                @dragend="dragend"	
                                                @mouseover="isUpdate[task.TASKID.trim()] ? 
                                                            setvxlist({muta: 'notify', data: {news: notify.news, msg: notify.msg, act: notify.act, id: null}})
                                                             : false"																			
                                                @click="dialog = {open: true, task: Object.assign({}, task), target: task, del: false}"	
                                            >															
                                                <span :class="{transitionname: taskfilter(sprint, stid).length * 2 - 6 > tkid}"
                                                        :style="{maxWidth: '100%'}">
                                                    {{task.NAME}}
                                                </span>        <!-- transitionname HERE !!! -->
                                            </v-chip>												
                                        </template>
                                        <span class="subtitle-1"><v-icon>mdi-hand-pointing-down</v-icon> &emsp; Update</span>
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
            max-width="600px"
            :style="{maxHeight: $vuetify.breakpoint.smAndDown? '373px' : '773px'}">
			<taskDialog v-bind.sync="dialog" />
		</v-dialog>
        
        <!-- ■■ Sprintdialog component ■■ -->
        <v-dialog 
            v-model="addspr" 
            max-width="600px" 
            @click:outside="setvxprop({muta: 'addspr', data: false})">
			<sprintDialog v-bind.sync="sprintdialog" />
		</v-dialog>

        <!-- ● delete dialog ● -->
        <v-dialog v-model="dialog.del" max-width="250">
            <delDialog 
				@callback="sprintaction('delete')" 
				@dismiss="dialog.del=false"
			/>
        </v-dialog>
        
        <v-overlay :value="overlay">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
    
    </v-container>
</template>

<script>
import taskDialog from '../unit/taskDialog'
import sprintDialog from '../unit/sprintDialog'
import delDialog from '../unit/delDialog'
import { mapGetters, mapActions } from "vuex"
import mixindata from '../mixin/mixindata'

  export default {
    name: 'Sprint',
    components: { taskDialog, sprintDialog, delDialog },
    mixins: [mixindata],
    data: () => ({
        style: {chipwmd: '245px', chipwsm: '75px'},
		focus: {owner: null},
		dialog: {open: false, task: {}, target: {}, del: false},    //Sync data => task dialog component
		sprintdialog: {presprint: {}, pretask: [{PRIORITY: 2}]},	//Sync data => sprint dialog component	
        edit: {sprint: null, value: ''},
		overlay: false,
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
        isUpdate: function(){
            let noti = {}
            noti[this.notify.id] = true 
            return noti       
        },
		...mapGetters(["logininfo", "tasklist", "seallist", "subtitle", "addspr", "notify"])
	},
    methods:{
        // ■■■■ task filter by "sprint" & "status" ■■■■
		taskfilter(sprint, state){
			return this.tasklist.filter(task => task.SPRINTID.trim() == sprint && task.STATUS == state)
		},
		// ■■■■ Title Action row ■■■■   type: edit, delete
		sprintaction(type, spr, newspr){ 
            let msg = ''
            let templist = this.tasklist 
            if(this.dialog.task.SPRINTID != '1_STB維護'){
                if(type == 'edit'){
                    templist.filter(tk => tk.SPRINTID == spr).forEach(tk => tk.SPRINTID = newspr)
                    this.edit.sprint = null
                    msg = `${spr} update name to ${newspr}`
                }
                else if(type == 'delete'){
                    templist.filter(tk => tk.SPRINTID.trim() == this.dialog.task.SPRINTID)
                                    .forEach(ftk => templist.splice(templist.findIndex(tk => tk.TASKID == ftk.TASKID), 1))
                    msg = `${this.dialog.task.SPRINTID} delete` 
                    this.setvxprop({muta: 'subtitle', data: null})                   
                    this.dialog = {open: false, task: {}, target: {}, del: false}
                }
                this.mixinUpdater('submitTask', {list: templist, id: null}, msg)                     //! => '../mixin/mixindata'
            }//hhh
        },       
		...mapActions(["setvxprop", "setvxlist"])
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