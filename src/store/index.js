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
        logininfo: null,           // login account
        logintoken: null,          // login token
        tasklist: [],              // task list from db
        subtitle: null,            // Detail Sprint Name
        addspr: false              // New Sprint Dialog Trigger
    },
    actions:{
        
        // ■■ Firebase API ■■■■■■■■■■■ api: signup, login, logout, certify ■■
        async _ajaxAction(store, {api, acc, pwd}) {
            let result = ''
            let postbody = `account=${store.state.logininfo}&token=${store.state.logintoken}`   //acc&tok
            if(api == 'signup' || api == 'login')    
                postbody = `account=${acc}&password=${pwd}`
            
                await axios.post(`${process.env.VUE_APP_firefx}/log/${api}` , postbody)              //api
                .then(response => {
                    result = response.data
                    if(response.data.code == 201){
                        if(api == 'login'){
                            store.commit('setlogininfo', acc)                    
                            store.commit('setlogintoken', response.data.token)                    
                        }
                        else if(api == 'logout'){
                            store.commit('setlogininfo', null)                                          //del acc
                            store.commit('setlogintoken', null)                                         //del tok                  
                        }
                    }                
                })
                .catch(error => console.log(error))
            console.log(result)
            return result   
        },

        // ■■ taskinfo ■■■■■■■■■■■
        async gettaskinfo(store,id) {
            let list = null;
            await fs.get()
                .then(doc => list = doc.data())
                .catch(error => alert(error))
            Array.isArray(list.tasklist)? true : list.tasklist = Object.values(list.tasklist) 
            store.commit('settasklist', list.tasklist)
            return list.tasklist
        },

        // ■■ Upate List ■■■■■■■■■■■        
        async updatelist(store, tasklist){ 
            await fs.update({tasklist})
            await store.dispatch('gettaskinfo')
        }, 
               
        // ■■ Realtime Binding List ■■■■■■■■■■■      
        bindListRef: firestoreAction(({ bindFirestoreRef }) => {
            return bindFirestoreRef('tasklist', db.firestore().collection('tasklist').doc('v6EUv3f3LCTRQvB4fb0w'))
        }),

        // ● title unit ●
        setaddspr(store, open) {
            store.commit('setaddspr', open)
        },

        // ● title unit ●
        setsubtitle(store, sub) {
            store.commit('setsubtitle', sub)
        },
    },
    mutations:{
        setlogininfo: (state, res) => state.logininfo = res,
        setlogintoken: (state, res) => state.logintoken = res,
        settasklist: (state, res) => state.tasklist = res,
        setsubtitle: (state, res) => state.subtitle = res,
        setaddspr: (state, res) => state.addspr = res,
        ...vuexfireMutations
    },
    getters:{
        logininfo: state => state.logininfo,
        logintoken: state => state.logintoken,
        tasklist: state => state.tasklist,
        subtitle: state => state.subtitle,
        addspr: state => state.addspr
    }
})