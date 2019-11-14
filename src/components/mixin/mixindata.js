import { mapGetters, mapActions } from "vuex"

export default {
	data: () => ({
        mixin: {    // static data storage
            member: [],
            state: [
				{value: 0, name: "to do", color: "teal accent-4"}, 
				{value: 1, name: "in process", color: "light-blue accent-4"}, 
				{value: 2, name: "checking", color: "amber accent-4"}, 
				{value: 3, name: "done", color: "light-green accent-4"}, 
			], 
            prior: [
				{value: 0, name: 'Highest', color: '#E53935'}, 
				{value: 1, name: 'High',    color: '#FFB300'}, 
				{value: 2, name: 'Mid',     color: '#1565C0'}, 
                {value: 3, name: 'Low',     color: '#37474F'}
            ],
            preaddtask: {    //prepare for new task default data
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
		// ■■■■ Data Access ■■■■
		mixinUpdater(type, data, offset){
            let templist = this.tasklist
            if(type == 'submitTask'){                   // *data from dialog & sprintActionBtn
                templist = Object.assign({}, data)
			}
			else if(type == 'ownerTag'){                // *data from ownerTag		        
                let index = this.tasklist.findIndex(tk => tk.TASKID == data.TASKID) 
                templist[index].OWNER = offset
                templist[index].MODTIME = new Date().toLocaleString()
            }
            else if(type == 'dropStatus'){
                let index = this.tasklist.findIndex(tk => tk.TASKID == data) 
                templist[index].STATUS = offset
                templist[index].MODTIME = new Date().toLocaleString()
            }
            
            this.updatelist(templist)   //! => 'VUEX'
				// this.$socket.emit('update', `update ${task.TASKID} ${task.NAME}`) 		// ! WebSocket Send! >>>>
        },
        ...mapActions(["updatelist"])
    },
    mounted(){
        this.mixin.member = Array.from(new Set(this.tasklist.map(task => task.OWNER.trim()).sort()))
    }
}