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
        @click="$router.push('/vuetifytest')"
        target="_blank">
        <span class="mr-2">admin</span>
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
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>Login form</v-toolbar-title> 
              </v-toolbar>
              <v-card-text>
                <v-form @submit.prevent="login">
                  <v-text-field
                    label="Login"
                    v-model="user.account"
                    prepend-icon="mdi-account"
                    type="text"
                    required
                  />
                  <v-text-field
                    label="Password"
                    v-model="user.password"
                    prepend-icon="mdi-lock"
                    type="password"
                    required
                  />
                  <v-spacer />
                  <v-btn color="primary" type="submit">Login</v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-container>
</template>

<script>
export default {
  name: 'HelloWorld',
  data: () => ({
    user: {},
  }),
  methods:{
    login(){

    }
  }
};
</script>
