<template>
    <v-container fluid>
		<v-row>
			<v-col cols="12" sm="4" md="2">
				<v-tabs v-model="tab" background-color="grey lighten-5">
					<v-tab>Table</v-tab>
					<v-tab>Calendar</v-tab>
				</v-tabs>
			</v-col>
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
							:value="date.value.join(' ~ ')"
							label="Date range"
							prepend-icon="mdi-calendar-range"
							readonly
							v-on="on"
						></v-text-field>
					</template>
					<v-date-picker range v-model="date.value" no-title scrollable />
				</v-menu>
			</v-col>
			<v-spacer />
		</v-row> 

		<v-row>
				<v-calendar
					v-if="tab == 1"
					ref="calendar"
					v-model="date.value[1]"
					color="primary"
					:events="donelist"
					:event-color="getEventColor"
					:event-margin-bottom="10"
					type="month"
				>
					<template v-slot:day="day">
						<v-sheet
							color="light-blue lighten-4"
						>{{ day.date }}</v-sheet>
					</template>			
				</v-calendar>
		</v-row>
	</v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
    name: 'Timeline',
    props: {
      source: String,
    },
    data: () => ({
		tab: 0,
		date: {menu: false, 
				value: [new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().substr(0, 10)
						, new Date().toISOString().substr(0, 10)]
				},
	}),
	computed: {
		dateRangeText: () => this.date.value.join(' ~ '),
		
		donelist(){
			return this.tasklist.filter(tk => tk.STATUS == 3)
								.map((tk, tid) => {
									return{	name: tk.NAME,
											details: 'Going to the beach!',
											start: tk.MODTIME.substr(0, 10).split('/').join('-'),
											end: tk.MODTIME.substr(0, 10).split('/').join('-'),
											color: 'blue',	}
								})
		},
		...mapGetters(["tasklist"])	  
	},
	methods: {
		getEventColor: event => event.color,
	}
}

				// @click:event="showEvent"
				// @click:more="viewDay"
				// @click:date="viewDay"
				// @change="updateRange"

</script>