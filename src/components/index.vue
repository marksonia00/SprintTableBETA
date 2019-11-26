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
		<v-btn  v-if="$vuetify.breakpoint.smAndDown && title.page == 0
					&& $store.state.subtitle == null"
				@click="setvxprop({muta: 'addspr', data: true})"
				color="light-green accent-4" 
				class="mr-4 white--text" 
				absolute fab bottom right
		>
				<v-icon>mdi-plus</v-icon>
		</v-btn>
		<template v-slot:extension 
				v-if="(title.page == 0 || title.page == 1) &&
					!($vuetify.breakpoint.smAndDown && title.page == 0
					&& $store.state.subtitle == null)"> 
			<v-row class="flex-nowrap"
				v-if="$vuetify.breakpoint.smAndDown && (title.page == 1
					|| $store.state.subtitle != null)"> <!-- breakpoint HERE !!! -->
				 <v-tabs v-model="carousel"	background-color="indigo lighten-1" dark>
					<v-tab v-for="(state, stid) in mixin.state" :key="stid" :style="{maxWidth: '79px'}">
						{{state.rwdn}}
					</v-tab>
				</v-tabs>
			</v-row>
			<v-row 
				v-if="!$vuetify.breakpoint.smAndDown"
				class="indigo lighten-1 flex-nowrap"> <!-- breakpoint HERE !!! -->
				<v-col v-for="(state, stid) in mixin.state" :key="stid" style="max-height: 47px;">
					<div class="title white--text" 
						:style="{minWidth: style.chipwmd, maxWidth: style.chipwmd}">
						{{state.name}}
					</div>
				</v-col>
				<v-spacer /> <!-- SPACER HERE !!! -->
			</v-row>
			<v-tooltip left v-if="!$vuetify.breakpoint.smAndDown">  
				<template v-slot:activator="{ on }">
					<v-btn v-on="on"
							@click="setvxprop({muta: 'addspr', data: true})"
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
    <v-navigation-drawer v-model="drawer" width="141" app :temporary="$vuetify.breakpoint.smAndDown">
		<template v-slot:prepend>
			<v-list>
				<v-list-item>
					<v-avatar class="mr-2" color="indigo" size="36">
						<span class="white--text headline">
							{{logininfo.substr(0, 1).toUpperCase()}}
						</span>
					</v-avatar>					
					<v-list-item-title class="title">{{logininfo}}</v-list-item-title>
				</v-list-item>
				<v-list-item>
					<v-chip outlined @click="logout()" color="deep-orange darken-3" class="subtitle-2 text-center">
						<v-icon left color="red">mdi-keyboard-return</v-icon>							
						Sign Out
					</v-chip> 
				</v-list-item>
			</v-list>
		</template>
      	<v-divider></v-divider>        
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
		<!-- ■■■■ Infomation Tag ■■■■  v-model to compute:"isnotify" -->
		<v-snackbar
			v-model="notify.news" 	
			:color="notify.act == 0 ? 'success' : (notify.act == 1 ? 'amber darken-3' : 'red')"
			vertical 
			right 
			top 
			:timeout="5000"
		>
			<span class="subtitle-1">{{ notify.msg }}</span>
			<v-btn
				color="white"
				text
				@click="setvxlist({muta: 'notify', data: {news: false, msg: '', act: null, id: notify.id}})"
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
        title: {page: 0},
        navlist: [  {title: 'Sprint', route: 'Sprint', icon: 'mdi-expand-all'},
					{title: 'MyTask', route: 'Owner', icon: 'mdi-account-multiple'},
                    {title: 'Detail', route: 'Task', icon: 'mdi-file-table-box-multiple'},
					{title: 'Sealed', route: 'Seal', icon: 'mdi-package-down'},
					{title: 'Timeline', route: 'Timeline', icon: 'mdi-progress-clock'}
				],
        style: {chipwmd: '245px', chipwsm: '68px'},
		drawer: true,
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
		...mapGetters(["logininfo", "tasklist", "notify", "addspr", "subtitle"])
	},
    methods:{
		// ■■■■ Logout  ■■■■
		logout(){
			this._ajaxAction({api: 'logout'})
			this.$router.push('/Home')
		},
        // ■■■■ Side drawer router  ■■■■
        listonclick(page){ 
			this.setvxprop({muta: 'subtitle', data: null})
			this.$router.push(`/index/${this.navlist[page].route}`)
		},
		async initlist(){
			this.overlay = true
			this.setvxlist({muta: 'notify', data: {news: false, msg: '', act: null, id: null}})
			this.bindListRef()
			await this.gettaskinfo()
			this.listonclick(0)		
			this.overlay = false
		},
		...mapActions(['_ajaxAction', 'setvxprop', 'setvxlist', 'bindListRef', 'unbindListRef', 'gettaskinfo'])
	},
	created(){
		this.initlist()	
	},
	destroyed(){
		this.unbindListRef()
	}
  }
	
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