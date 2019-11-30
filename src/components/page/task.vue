<template>
<!-- ■■■■ Task page ■■■■ -->
    <v-container fluid>
        <v-row no-gutters>	
			<!-- ● date-picker ● -->
			<v-col cols="12" sm="4" md="3">	
				<v-menu
					v-model="date.menu"
					:close-on-content-click="false"
					:nudge-right="40"
					transition="scale-transition"
					offset-y
					min-width="290px"
				>
					<template v-slot:activator="{ on }">
						<v-text-field
							:value="date.value[1]? date.value.join(' ~ ') : ` < ${date.value[0]}`"
							label="Date range"
							prepend-icon="mdi-calendar-range"
							readonly
							:style="{maxWidth: '238px'}" 
							v-on="on"
						></v-text-field>
					</template>
					<v-date-picker range v-model="date.value" no-title scrollable />
				</v-menu>
			</v-col>
			<!-- ● done checker ● -->	
			<v-col cols="6" sm="3" md="1"> 
				<v-checkbox
					v-model="done"
					label="done"
					color="#00C853"
					hide-details
				></v-checkbox>
			</v-col>
			<!-- ● Point Box ● -->
			<v-col	cols="12" sm="12" md="6"
				class="ml-4 pointbox flex-nowrap overflow-auto"
				@mouseover="focus.point = true" @mouseleave="focus.point = false" 
				:style="{maxWidth: $vuetify.breakpoint.mdAndUp?'53vw':'99vw',  
						maxHeight: focus.point || $vuetify.breakpoint.smAndDown?'313px':'67px', 
						border: focus.point && $vuetify.breakpoint.mdAndUp?'1px #3949AB solid':'0px #3949AB solid',
						padding: '0 1%',
						position: $vuetify.breakpoint.mdAndUp && focus.point?'absolute':'stactic',
						right: '1%',
						zIndex: $vuetify.breakpoint.mdAndUp && focus.point?'100':'0',
						}">
					<v-row no-gutters>
						<v-col> 
							<v-text-field
								:value="pointclac(null)"
								label="Total"
								prepend-icon="mdi-clock"
								readonly
								:style="{maxWidth: style.pointwidth, minWidth: style.pointwidth}" 
							></v-text-field>
						</v-col>
						<v-col
							v-for="(member, mid) in Array.from(new Set(tasklist.map(task => task.OWNER.trim()).sort()))" 
							:key="mid" 						
						>
							<v-text-field
								:value="pointclac(member)"
								:label="member"
								:prepend-icon="`mdi-alpha-${member.substr(0,1).toLowerCase()}-circle`"
								readonly
								@focus="focus.member = member" @blur="focus.member = null"
								:style="{maxWidth: style.pointwidth, minWidth: style.pointwidth, opacity: pointclac(member) != '0 / 0'? '1': '.4'}" 
							></v-text-field>
						</v-col>
						<v-spacer /><v-spacer /><v-spacer /> 
					</v-row>
			</v-col>
        </v-row>
		<v-row no-gutters>
			<v-col>
				<v-data-table
					v-model="list.selected"
					:headers="list.header"
					:items="taskfilter()"
					:items-per-page="10"
					item-key="TASKID"
					show-select
					class="elevation-1">
					<template v-slot:item.REMAININGPOINT="{ item }">		<!-- point slot -->		
						{{ `${item.REMAININGPOINT} / ${item.TOTALPOINT}` }}
					</template>
					<template v-slot:item.NAME="{ item }">					<!-- name slot -->	
						{{ item.NAME.substr(0, 12) }}
					</template>
					<template v-slot:item.info="{ item }">					<!-- info slot -->	
						{{ item.DESCRIPTION.substr(0, 10) }}
					</template>
					<template v-slot:item.STATUS="{ item }">				<!-- status slot -->
						<v-chip :color="mixin.state[item.STATUS].color" dark>
							<v-icon v-if="item.STATUS == 3" left color="white">mdi-check</v-icon>
							{{ mixin.state[item.STATUS].name }}
						</v-chip>
					</template>            
					<template v-slot:item.PRIORITY="{ item }">				<!-- prior slot -->
						<v-icon left :color="mixin.prior[item.PRIORITY].color">
							{{item.PRIORITY == 0 ? 'mdi-bell-alert' : (item.PRIORITY == 1 ? 'mdi-bell' : 'mdi-circle-medium')}}
						</v-icon>
						<span :style="{color: `${mixin.prior[item.PRIORITY].color}`}">{{mixin.prior[item.PRIORITY].name}}</span>            
					</template> 
					  
					<template v-slot:item.modtimeparse="{ item }">			<!-- modtime slot -->
						{{ item.MODTIME.substr(0, 10) }}
					</template>					         
				</v-data-table>
			</v-col>
		</v-row>
    </v-container>
</template>

<script>
import { log } from 'util'
import { mapGetters } from "vuex"
import mixindata from '../mixin/mixindata'

  export default {
    name: 'Task',
    mixins: [mixindata],
    props: {
      source: String,
    },
    data: () => ({
		style: {pointwidth: '119px'},
		focus: {point: false, member: null},
		date: {menu: false, 
				value: [new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().substr(0, 10)
						, new Date().toISOString().substr(0, 10)]
				},
		done: false,
		list: {
				selected: [],
				header: [
					{ text: 'Task',		value: 'TASKID', align: 'left', sortable: false},
					{ text: 'Sprint',	value: 'SPRINTID' },
					{ text: 'Name',		value: 'NAME' },
					{ text: 'Prior' ,   value: 'PRIORITY',sortable: true},
					{ text: 'Owner' ,   value: 'OWNER',   sortable: true},
					{ text: 'State',	value: 'STATUS', sortable: true },
					{ text: 'info' ,  	value: 'info', },
					{ text: 'Point' , 	value: 'REMAININGPOINT' ,sortable: true },
					{ text: 'Modify',	value: 'modtimeparse', sortable: true},
				] 
		},
    }),
	computed:{
		...mapGetters(["tasklist"])
	},
	methods:{
		taskfilter(){
			let list = this.tasklist.map(tk => {return {...tk, modtimeparse: Date.parse(tk.MODTIME.substr(0, 10))}})
			let daterange = this.date.value.map( d => Date.parse(d.split('-').join('/')))
			daterange[1] ? list = list.filter(tk => !(tk.modtimeparse > Math.max(...daterange)) && !(tk.modtimeparse < Math.min(...daterange)))
				: list = list.filter(tk => !(tk.modtimeparse > daterange[0]))
			this.focus.member != null ? list = list.filter(tk => tk.OWNER == this.focus.member) : list = list
			this.done ? list = list.filter(tk => tk.STATUS == 3) : list = list
			return list
		},
		pointclac(owner){
			let pointstr = "0 / 0"						//! Array.reduce must have at least 2 member
			if(this.taskfilter().length > 0){
				let list = this.taskfilter()
				this.list.selected.length > 0 ? list = [...this.list.selected] : list = list	//selected
				owner != null ? list = list.filter(tk => tk.OWNER == owner) : list = list		//owner
				if( list.length > 1 )
					pointstr = `${list.map(tk => parseInt(tk.REMAININGPOINT, 10)).reduce( (next, now) => next + now)} / ${list.map(tk => parseInt(tk.TOTALPOINT, 10)).reduce( (next, now) => next + now)}`
				else if( list.length > 0 )	
					pointstr = `${list.map(tk => parseInt(tk.REMAININGPOINT, 10))} / ${list.map(tk => parseInt(tk.TOTALPOINT, 10))}`		
			}
			return pointstr
		}
	}
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
.pointbox{
	
	background-color: #FAFAFA;
	transition: all .3s linear 0s;
}
</style>