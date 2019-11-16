<template>
<v-container>
	<v-app-bar app>
		<v-toolbar-title class="headline">
			<span>SPRINT</span>
			<span class="font-weight-light">TABLE beta</span>
		</v-toolbar-title>
		<v-spacer></v-spacer>
		<v-btn
			text
			@click="$router.push('/index')"
			target="_blank"
		>
			<span class="mr-2 white--text">admin</span>
		</v-btn>
	</v-app-bar>

	<v-content>
		<v-container fluid class="fill-height">
			<v-row align="center" justify="center">
				<v-col	cols="12" sm="8" md="4">
					<v-card class="elevation-12">
						<v-toolbar
							:color="res.code == null ? 'primary' : ( res.code == 201 ? 'success' : 'red' )"
							dark
							flat
							extension-height='24'
						>
						<v-toolbar-title>Login form</v-toolbar-title> 
							<template v-slot:extension v-if="res.code != null">
								<span>{{res.msg}}</span>
							</template>  
						</v-toolbar>
						<v-card-text>
							<v-form v-model="valid">
							<v-text-field
								label="Login"
								v-model="user.account"
								prepend-icon="mdi-account"
								type="text"
								@focus="res = {code: null, msg: ''}"
								:rules="[v => !!v || 'required']"
								required
							/>
							<v-text-field
								label="Password"
								v-model="user.password"
								prepend-icon="mdi-lock"
								type="password"
								@focus="res = {code: null, msg: ''}"
								@keypress="valid ? passwordenter($event) : true"
								:rules="[v => !!v || 'required']"
								required
							/>
							</v-form>
						</v-card-text>
						<v-card-actions>
							<v-spacer />
							<v-btn 
								color="success" 
								:disabled="!valid || wait.signup || once.signup" 
								@click="signup()"
							>
								{{wait.signup?'wait..':'Signup'}}
							</v-btn>
							<v-btn 
								color="primary" 
								:disabled="!valid || wait.login" 
								@click="login()"
							>
								{{wait.login?'wait..':'Login'}}
							</v-btn>
						</v-card-actions>              
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
</v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
name: 'login',
data: () => ({
	once: {signup: false},
	wait: {signup: false, login: false},
	res: {code: null, msg: ''},
	valid: true,
	user: {},
}),
methods:{
	passwordenter(event){     // charCode: 13 => 'Enter'
		if (event.charCode == 13) 
			this.login()
	},
	async login(){
		this.wait.login = true
		let result = await this._ajaxAction({api: 'login', acc: this.user.account, pwd: this.user.password})
		this.wait.login = false
		result.code == 201?
			this.$router.push('/index') :
			this.res = result
	},
	async signup(){
		this.wait.signup = true
		let result = await this._ajaxAction({api: 'signup', acc: this.user.account, pwd: this.user.password})
		this.wait.signup = false
		if(result.code == 201)
			this.once.signup = true
		this.res = result
	},
	...mapActions(["_ajaxAction"])
}
};
</script>
