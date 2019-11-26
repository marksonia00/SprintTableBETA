import { mapGetters, mapActions } from "vuex"

export default {
	data: () => ({
        mixin: {    // static data storage
            member: [],
            state: [
				{value: 0, name: "to do",       rwdn: "to do",     color: "#757575", icon: "mdi-format-list-bulleted"}, 
				{value: 1, name: "in process",  rwdn: "process",   color: "#0277BD", icon: "mdi-tools"}, 
				{value: 2, name: "checking",    rwdn: "checking",  color: "#FF6D00", icon: "mdi-message-alert"}, 
				{value: 3, name: "done",        rwdn: "done",      color: "#00C853", icon: "mdi-checkbox-marked-outline"}, 
			], 
            prior: [
				{value: 0, name: 'Highest', color: '#E53935'}, 
				{value: 1, name: 'High',    color: '#FFB300'}, 
				{value: 2, name: 'Mid',     color: '#1565C0'}, 
                {value: 3, name: 'Low',     color: '#37474F'}
            ],
            preaddtask: {    //default data prepared for new task 
                TASKID: "",
                SPRINTID: "",
                NAME: "",
                STATUS: 0,
                DESCRIPTION: "",
                OWNER: "",
                PRIORITY: 3,
                REMAININGPOINT: 20,
                TOTALPOINT: 20,
                MODTIME: ""
            },
            value: "",      // temp member name
        },
    }),
    computed:{
		...mapGetters(["tasklist"])
    },
    methods:{
        Addmember(){     //temporarily add a new member for select
            !this.mixin.member.map(mb => mb.substr(0, 1))
                                .includes(this.mixin.value.substr(0, 1)) 
            && this.mixin.value != '' 
            && this.mixin.value.substr(0, 1) == this.mixin.value.substr(0, 1).toUpperCase() 
            && this.mixin.value.substr(0, 1) != ' '?
            this.mixin.member.push(this.mixin.value): 
            this.mixin.value = ''
        },

        // ■■■■ Drag drop handle ■■■■
        dragstart(event, task){
			event.dataTransfer.setData('taskid', task.TASKID)
			event.dataTransfer.setData('status', task.STATUS)
			event.dataTransfer.setData('sprint', task.SPRINTID)
        },
        drop(event, stid, sprint){
            if(event.dataTransfer.getData('status') != stid 
                && (event.dataTransfer.getData('sprint') == sprint || sprint == null)){
				    this.mixinUpdater('dropStatus', {list: null, id: event.dataTransfer.getData('taskid')}, stid)   //! => '../mixin/mixindata'
			}
        },
        dragend(event){
            event.dataTransfer.clearData()
        },

		// ■■■■ Data Access ■■■■
		mixinUpdater(type, data, offset){   // update center => vuex
            let templist = this.tasklist
            let index = null
            let msg = ""
            let act = null  // 0:Create 1:Update 2:Delete
            data.id != null ? index = this.tasklist.findIndex(tk => tk.TASKID == data.id) : true
            if(type == 'submitTask'){                   // *data from dialog & sprintActionBtn
                templist = data.list
                msg = offset
                offset.includes('create')? act = 0 : ( offset.includes('delete')? act = 2 : act = 1)               
            }
			else if(type == 'ownerTag'){                // *data from ownerTag		        
                templist[index].OWNER = offset
                templist[index].MODTIME = new Date().toLocaleString()
                msg = `${templist[index].NAME} change Owner to ${offset}`
                act = 1       
            }
            else if(type == 'dropStatus'){              // *data from dragdrop
                templist[index].STATUS = offset
                templist[index].MODTIME = new Date().toLocaleString()
                msg = `${templist[index].NAME} change Status to ${this.mixin.state[offset].name}`
                act = 1
            }            
            this.updatelist({tasklist: templist, msg: msg, act: act, id: data.id})   //! => 'VUEX'
				// this.$socket.emit('update', `update ${task.TASKID} ${task.NAME}`)
        },
        ...mapActions(["updatelist"])
    },
    mounted(){
        this.mixin.member = Array.from(new Set(this.tasklist.map(task => task.OWNER.trim()).sort()))
    }
}