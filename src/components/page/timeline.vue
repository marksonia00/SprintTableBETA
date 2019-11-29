<template>
    <v-container fluid>
		<v-row>
			<v-col>
				<v-tabs v-model="tab" background-color="grey lighten-5">
					<v-tab xlink:href="#svgRect">rect</v-tab>
					<v-tab xlink:href="#svgArc">arc</v-tab>
					<v-tab>Calendar</v-tab>
				</v-tabs>
			</v-col>
		</v-row> 

		<v-row v-if="tab == 2">
				<v-calendar					
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
		<v-row v-if="tab == 0">
			<svg :width="900" :height="400">
				<g >
					<line x1="5" y1="5" x2="800" y2="5"
						style="stroke: Tomato;stroke-width: 3px"
					></line>
					<rect
						v-for="(item, i) in data" :key="i"
						:x="i * 40 + 15"
						:y="i * 60 + 15"
						:width="scale(item)"
						:height="45"
						:fill="color[i]"
					>
					</rect>
				</g>
			</svg>
		</v-row>
		<v-row v-if="tab == 1">
			<svg :width="500" :height="500">
				<g 	v-for="(item, i) in data" :key="i"	
					transform="translate(250, 250)">
					<path
						:d="scaleArc(data, i, 'arc', 1)"
						:fill="color[i]"
					>
						<animate attributeName="d" dur="1.5s"
								:values="`${scaleArc(data, i, 'arc', 0.2)};
											${scaleArc(data, i, 'arc', 0.55)};
											${scaleArc(data, i, 'arc', 0.8)};
											${scaleArc(data, i, 'arc', 0.95)};
											${scaleArc(data, i, 'arc', 1)};`"/> 
					</path>
					<text 
						:transform="`translate(${scaleArc(data, i, null, 1)})`"
						fill="white"						
					>
						{{item}}
					</text>
				</g>
			</svg>
		</v-row>		
	</v-container>
</template>

<script>
import * as d3 from 'd3';
import { transition } from "d3-transition";
import { mapGetters, mapActions } from "vuex"


export default {
    name: 'Timeline',
    props: {
      source: String,
    },
    data: () => ({
		data: [99, 71, 78, 25, 36, 92],
		color: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"],
		tab: 1,
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
		
		scale(d){
			let linear = d3.scaleLinear()
				.domain([0, d3.max(this.data)])
				.range([0, 400]) 
				console.log(d3.axisBottom(linear))
			return linear(d)
		},

		scaleArc(data, i, type, per){
			let pie = Array.from(d3.pie()(data))	//generate arc%		
			let scale = d3.arc()					//generate path 'd' value
					.innerRadius(type == 'arc' ? 0 : 100)
					.outerRadius(200)
					.startAngle(p => p.startAngle)  
					.endAngle(p => p.startAngle + (p.endAngle - p.startAngle) * per)					
			return type == 'arc' ? scale(pie[i]) : scale.centroid(pie[i])
		},
		...mapActions(["setvxprop"])
	},
}
</script>