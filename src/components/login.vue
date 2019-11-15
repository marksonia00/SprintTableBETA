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
        target="_blank">
        <span class="mr-2 white--text">admin</span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                :color="reject? 'red' : 'primary'"
                dark
                flat
                extension-height='24'
              >
                <v-toolbar-title>Login form</v-toolbar-title> 
                <template v-slot:extension v-if="reject">
                  <span>please check your account and password</span>
                </template>  
              </v-toolbar>
              <v-card-text>
                <v-form v-model="valid">
                  <v-text-field
                    label="Login"
                    v-model="user.account"
                    prepend-icon="mdi-account"
                    type="text"
                    @focus="reject = false"
                    :rules="[v => !!v || 'required']"
                    required
                  />
                  <v-text-field
                    label="Password"
                    v-model="user.password"
                    prepend-icon="mdi-lock"
                    type="password"
                    @focus="reject = false"
                    @keypress="valid ? passwordenter($event) : true"
                    :rules="[v => !!v || 'required']"
                    required
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="secondary" :disabled="!valid || wait" @click="signup()">{{wait?'wait':'Signup'}}</v-btn>
                <v-btn color="primary" :disabled="!valid" @click="login()">Login</v-btn>
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
import { create } from 'domain'

export default {
  name: 'login',
  data: () => ({
    wait: false,
    reject: false,
    valid: true,
    user: {},
  }),
  methods:{
    passwordenter(event){     // charCode: 13 => 'Enter'
      if (event.charCode == 13) 
        this.login()
    },
    async login(){
      let result = await this.loginAction({acc: this.user.account, pwd: this.user.password})
      alert(result.msg)
      result.code == 201?
        this.$router.push('/index') :
        this.reject = true
    },
    async signup(){
        this.wait = true
        let result = await this.signupAction({acc: this.user.account, pwd: this.user.password})
        this.wait = false
        alert(result.msg)
    },
    ...mapActions(["loginAction", "logoutAction", "signupAction"])
  }
};
</script>
