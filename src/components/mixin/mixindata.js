import { mapGetters, mapActions } from "vuex"

export default {
	data: () => ({
        mixin: {
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
            value: "",
        },
    }),
    computed:{
		...mapGetters(["tasklist"])
    },
    methods:{
        Addmember(){
            !this.mixin.member.map(mb => mb.substr(0, 1))
                                .includes(this.mixin.value.substr(0, 1)) 
            && this.mixin.value != '' 
            && this.mixin.value.substr(0, 1) == this.mixin.value.substr(0, 1).toUpperCase() 
            && this.mixin.value.substr(0, 1) != ' '?
            this.mixin.member.push(this.mixin.value): 
            this.mixin.value = ''
        },
    },
    mounted(){
        this.mixin.member = Array.from(new Set(this.tasklist.map(task => task.OWNER.trim()).sort()))
    }
}