<template>
    <v-container fluid>
		<v-row>
			<v-col>
				<v-tabs v-model="tab" background-color="grey lighten-5">
					<v-tab @click="scroll = 500">rect</v-tab>
					<v-tab>arc</v-tab>
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
			<svg :width="'100%'" :height="500" @mousewheel="timescroll($event)">
				<defs>
					<linearGradient id="Gradient">
						<stop offset="0%" stop-color="white" stop-opacity="0" />
						<stop offset="10%" stop-color="white" stop-opacity="1" />
						<stop offset="90%" stop-color="white" stop-opacity="1" />
						<stop offset="100%" stop-color="white" stop-opacity="0" />
					</linearGradient>
					<mask id="Mask">
						<rect x="0" y="0" :width="'100%'" :height="500" fill="url(#Gradient)"  />
					</mask>
				</defs>
				<g mask="url(#Mask)">
					<g :class="{timeline: justi}" :transform="`translate(${scroll}, 0)`" >
						<defs>
							<marker id="g" viewBox="0 0 50 50" refX="25" refY="25" markerWidth="10" markerHeight="10" orient="45" >
								<rect fill="#fff" stroke="#000" stroke-width="10" width="50" height="50"/>
							</marker>
						</defs>
						<!-- <circle fill="#0a0" stroke="#000" stroke-width="10" cx="25" cy="25" r="25"/> -->
						<polyline :points="marker" fill="none" stroke="black" 
								stroke-width="1" marker-end="url(#r)" marker-start="url(#r)" marker-mid="url(#g)">
						</polyline>
						<text v-for="(marker, i) in marker.split(' ')" :key="`axtx${i}`" fill="#006064" style="font-size:24px;"
								:x="parseInt(marker.split(',')[0], 10) - 5" :y="20"
						>
							{{dateform( parseInt(marker.split(',')[0], 10) )}}
						</text>
						<g v-for="(item, i) in dataspan" :key="i">
							<rect
								:x="item.s"
								:y="i*60 + 80"
								:width="item.e - item.s"
								:height="45"
								:stroke="color[i]"
								fill="#FAFAFA" stroke-width="2"
								rx="10" ry="10"
							></rect>
							<text :x="item.s + 20" :y="i*60 + 105"> 
								{{i}}
							</text>
						</g>
					</g>
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
		dataspan:[{s: -200,e: 200}, {s: 100,e: 400}, {s: -100,e: 300}, {s: 200,e: 700}, {s: -400,e: 100}, {s: 0,e: 300}],
		scroll: 0,
		justi: false,
		dform: {month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']},
		color: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"],
		tab: 1,
		date: {menu: false, 
				value: [new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().substr(0, 10)
						, new Date().toISOString().substr(0, 10)]
				},
	}),
	computed: {
		marker(){
			let p = ''
			for(let i=0; i<40; i++)
				p += `${100*i + -2000},40 `
			return p
		},
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

		dateform(i){
			return i % 400 == 0 ?  this.dform.month[i / 400 + 5] : ''
		},

		timescroll(){
			event.wheelDelta > 0 ? this.scroll += 50 : this.scroll -= 50
		},

		scale(d){
			let linear = d3.scaleLinear()
				.domain([0, d3.max(this.data)])
				.range([0, 400]) 
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

<style scoped>
.timeline {
  -moz-transition: all 0.3s ease-in-out 0s;
  -o-transition: all 0.3s ease-in-out 0s;
  -webkit-transition: all 0.3s ease-in-out 0s;
  transition: all 0.3s ease-in-out 0s;
}
</style>