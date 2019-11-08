import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { db } from '../firebase'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import firebase from 'firebase/app'
import 'firebase/firestore'
const fs = db.firestore().collection('tasklist').doc('v6EUv3f3LCTRQvB4fb0w')

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        logininfo:{},
        logintoken:"",
        projectinfo:{},
        tasklist: {}
    },
    actions:{
        // ■■ Login ■■■■■■■■■■■
        async loginAction(store, {account, userKey}) {
            const api = `${process.env.VUE_APP_apiPATH}/api/Logininfo`
            let postbody = `ACCOUNT=${account}&USERKEY=${userKey}`
            let res
            await axios.post(api, postbody)
                .then(Response => {
                    console.log(res)                        
                    if(Response.data.CODE === 200){
                        // store.commit("setlogininfo", Response.data.DATA),
                        // store.commit("setlogintoken", Response.data.TOKEN)   
                    }
                    res = Response.data 
                })
                .catch(error => res = error)
            return res    
        },
        // ■■ Logout ■■■■■■■■■■■
        async logoutAction(store) {
            const api = `${process.env.VUE_APP_apiPATH}/api/Logoutinfo`;
            let postbody = `ACCOUNT=${store.state.logininfo.ACCOUNT.trim()}&TOKEN=${store.state.logintoken}`;
            let res;
            await axios.post(api, postbody)
                .then(Response => {
                    if(Response.data.CODE === 200) {
                        // store.commit('setlogininfo',"")
                        // store.commit('setlogintoken',"")
                        res = Response.data
                    }
                })
            return res      
        },
        // ■■ taskinfo ■■■■■■■■■■■
        async gettaskinfo(store,id) {
            let list = null;
            console.log('request to Firebase...')
            await fs.get()
                .then(doc => list = doc.data())
                .catch(error => alert(error))
            console.log('Response from Firebase')            
            return list.tasklist  
        },
        // ■■ Upate List ■■■■■■■■■■■        
        async updatelist(store, tasklist){
          await fs.update({tasklist})
        },
        // ■■ Realtime Binding List ■■■■■■■■■■■      
        bindListRef: firestoreAction(({ bindFirestoreRef }) => {
            return bindFirestoreRef('tasklist', db.firestore().collection('tasklist').doc('v6EUv3f3LCTRQvB4fb0w'))
        }),
    },
    mutations:{
        setlogininfo: (state, res) => state.logininfo = res,
        setlogintoken: (state, res) => state.logintoken = res,
        setprojectinfo: (state, res) => state.projectinfo = res,
        ...vuexfireMutations
    },
    getters:{
        logininfo: state => state.logininfo,
        logintoken: state => state.logintoken,
        projectinfo: state => state.projectinfo,
        tasklist: state => state.tasklist
    }
})