<template>
  <v-app id="inspire">
    <!-- ■■■■ Top Navbar ■■■■ -->
	<v-app-bar app dense color="indigo darken" class="white--text">
		<v-app-bar-nav-icon @click="drawer = !drawer" />
		<v-toolbar-title>
            {{navlist[title.page].title}}
        </v-toolbar-title>
		<v-icon class="ml-4" v-if="subtitle != null">mdi-chevron-right</v-icon>								
		<div class="ml-4" v-if="subtitle != null">
            {{subtitle}}
        </div>
		<template v-slot:extension v-if="title.page == 1 || title.page == 2">
			<v-row class="indigo lighten-1 flex-nowrap">
				<v-col v-for="(state, stid) in mixin.state" :key="stid" style="max-height: 47px;">
					<div class="title white--text" style="min-width: 245px; max-width: 245px;">
						{{state.name}}
					</div>
				</v-col>
				<v-spacer /> <!-- SPACER HERE !!! -->
			</v-row>
			<v-tooltip left v-if="title.page == 1">  
				<template v-slot:activator="{ on }">
					<v-btn v-on="on"
							@click="setaddspr(true)"
							color="light-green accent-4" 
							class="mr-4 white--text" 
							absolute 
							fab 
							top 
							right>
							<v-icon>mdi-plus</v-icon>
					</v-btn>
				</template>
				<span>Add Sprint</span>
			</v-tooltip>
		</template>
    </v-app-bar>
    <!-- ■■■■ Side drawer ■■■■ -->
    <v-navigation-drawer v-model="drawer" width="139" stateless app>
        <v-list dense>
			<v-list-item-group v-model="title.page" color="primary">
				<v-list-item v-for="(nav, i) in navlist" :key="i" @click="listonclick(i)" :disabled="i == title.page">
					<v-list-item-action>
						<v-icon>{{nav.icon}}</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>{{nav.title}}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list-item-group>
        </v-list>
    </v-navigation-drawer>

    <v-content>
		<!-- ■■■■ Router-View ■■■■ -->
		<router-view />
		<!-- ■■■■ Infomation Tag ■■■■ -->
		<v-snackbar
			v-model="infodialog.info" color="success"
			vertical right top :timeout="infodialog.infotimeout"
		>
			{{ infodialog.infomsg }}
			<v-btn
				color="indigo"
				text
				@click="infodialog.info = false"
			>
				Close
      		</v-btn>
    	</v-snackbar>
    </v-content>
	<v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import { log } from 'util'
import { mapGetters, mapActions } from "vuex"
import mixindata from './mixin/mixindata'

  export default {
	name: 'index',
	mixins: [mixindata],  //* Outside data() !!!
    props: {
      source: String,
    },
    data: () => ({
		infodialog: {info: false, infomsg: "", infotimeout: 3000},
        title: {page: 1},
        navlist: [  {title: 'Home', icon: 'mdi-home'}, 
                    {title: 'Sprint', icon: 'mdi-expand-all'},
					{title: 'Owner', icon: 'mdi-account-multiple'},
                    {title: 'Task', icon: 'mdi-file-table-box-multiple'},
					{title: 'Seal', icon: 'mdi-briefcase-edit'},
					{title: 'Timeline', icon: 'mdi-progress-clock'}
				],
		drawer: true,
		overlay: false,
	}), 
	computed:{
		...mapGetters(["tasklist", "addspr", "subtitle"])
	},
	// sockets: {
	// 	connect: function () {
	// 		console.log('socket connected')
	// 	},
	// 	updateresponse: function (data) {  					// ! <<<< WebSocket Receive!
	// 		this.infodialog.info = false
	// 		console.log(`<<WebSock Receive: ${data}`);
	// 		this.infodialog.infomsg = `User ${data}`
	// 		this.infodialog.info = true
	// 		if(data.substr(0, 6) == 'update')
	// 			this.initlist()		
	// 		this.focus[data.substr(7, 6)] = true	
	// 	}
    // },
    methods:{
        // ■■■■ Side drawer router  ■■■■
        listonclick(page){ 
				this.$router.push(`/index/${this.navlist[page].title}`)
		},
		...mapActions(['changetitle', 'setaddspr'])
	},
	created(){
		this.listonclick(1)
	},
  }


  		//■■■■ pure WebSocket ■■■■
	// 	initWebSocket(){
	// 		const wsuri = "ws://127.0.0.1:55688/Laputa";
	// 		this.websock = new WebSocket(wsuri);
	// 		this.websock.onmessage = this.websocketonmessage;
	// 		this.websock.onopen = this.websocketonopen;
	// 		this.websock.onerror = this.websocketonerror;
	// 		this.websock.onclose = this.websocketclose;
    //   },
	// 	websocketonopen(){ //create ws
	// 		// this.websocketsend("BALUS");
	// 	},
	// 	websocketonerror(){	//reconnect
	// 		this.initWebSocket();
	// 	},
	// 	websocketonmessage(e){ //Receive data
	// 		if(e.data != this.dialog.prevmsg ){
	// 			this.dialog.prevmsg = e.data
	// 			console.log(`<<WebSock Receive: ${e.data}`);
	// 			this.dialog.infomsg = `User update ${e.data}`
	// 			this.dialog.info = true
	// 			this.initlist()
	// 		}
	// 	},
	// 	websocketsend(Data){//Send data
	// 		console.log(`>>WebSock Send: ${Data}`);
	// 		this.websock.send(Data);
	// 	},
	// 	websocketclose(e){  //Close WS
	// 		console.log('closeWS',e);
	// 		this.initWebSocket();
	// 	},
</script>

<style scoped>
::-webkit-scrollbar{
  width: 2px;
  transform: translateX(7px);}
::-webkit-scrollbar-track{ 
  background: #f1f1f1;}
::-webkit-scrollbar-thumb{ 
  background: #888}
</style>