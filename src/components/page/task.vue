<template>
<!-- ■■■■ Task page ■■■■ -->
    <v-container fluid>
        <v-row>
			<v-col>
				<v-checkbox
					v-model="done"
					label="done"
					color="#00C853"
					hide-details
				></v-checkbox>
			</v-col>
        </v-row>
		<v-row>
			<v-col>
				<v-data-table
					:headers="list.header"
					:items="done? tasklist.filter(tk => tk.STATUS == 3) : tasklist"
					:items-per-page="10"
					item-key="TASKID"
					show-select
					class="elevation-1">
					<template v-slot:item.REMAININGPOINT="{ item }">
						{{ `${item.REMAININGPOINT} / ${item.TOTALPOINT}` }}
					</template>
					<template v-slot:item.NAME="{ item }">
						{{ item.NAME.substr(0, 12) }}
					</template>
					<template v-slot:item.info="{ item }">
						{{ item.DESCRIPTION.substr(0, 10) }}
					</template>
					<template v-slot:item.STATUS="{ item }">
						<v-chip :color="mixin.state[item.STATUS].color" dark>
							<v-icon v-if="item.STATUS == 3" left color="white">mdi-check</v-icon>
							{{ mixin.state[item.STATUS].name }}
						</v-chip>
					</template>            
					<template v-slot:item.PRIORITY="{ item }">
						<v-icon left :color="mixin.prior[item.PRIORITY].color">
							{{item.PRIORITY == 0 ? 'mdi-bell-alert' : (item.PRIORITY == 1 ? 'mdi-bell' : 'mdi-checkbox-blank-circle')}}
						</v-icon>
						<span :style="{color: `${mixin.prior[item.PRIORITY].color}`}">{{mixin.prior[item.PRIORITY].name}}</span>            
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
		done: false,
		list: {
				header: [
					{ text: 'Task',		value: 'TASKID', align: 'left', sortable: false},
					{ text: 'Sprint',	value: 'SPRINTID' },
					{ text: 'Name',		value: 'NAME' },
					{ text: 'State',	value: 'STATUS', sortable: true },
					{ text: 'info' ,  	value: 'info', },
					{ text: 'Owner' ,   value: 'OWNER',   sortable: true},
					{ text: 'Prior' ,   value: 'PRIORITY',sortable: true},
					{ text: 'Point' , 	value: 'REMAININGPOINT' ,sortable: true },
					{ text: 'Modify',	value: 'MODTIME', sortable: true},
				] },
    }),
	computed:{
		...mapGetters(["tasklist"])
	},
	methods:{
		taskfilter: () => this.done ? this.tasklist.filter(tk => tk.STATUS == 3) : this.tasklist,
	}
  }
</script>