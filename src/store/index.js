import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { db } from '../firebase'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import firebase from 'firebase/app'
import 'firebase/firestore'
const fs = db.firestore().collection('tasklist').doc('v6EUv3f3LCTRQvB4fb0w')
const bs = db.firestore().collection('backuplist').doc('6kc7ZLATTsHonYEmF3Wm')  //! BackUP doc

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        logininfo: null,           // login account
        logintoken: null,          // login token
        tasklist: {                // task list from db
            tasklist: [],
            seallist: [],
            notify: {news: false, msg: '', act: null, id: null}
        },  
        subtitle: null,            // Detail Sprint Name
        statetab: 0,
        addspr: false              // New Sprint Dialog Trigger
    },
    actions:{
        
        // ■■ Firebase API ■■■■■■■■■■■ api: signup, login, logout, certify ■■
        async _ajaxAction(store, {api, acc, pwd}) {
            let result = ''
            let postbody = `account=${store.state.logininfo}&token=${store.state.logintoken}`   //acc&tok
            if(api == 'signup' || api == 'login')    
                postbody = `account=${acc}&password=${pwd}`
            
                await axios.post(`${process.env.VUE_APP_firefx}/log/${api}` , postbody)       //Ajax =>
                .then(response => {
                    result = response.data
                    if(response.data.code == 201){
                        if(api == 'login'){
                            store.commit('setvxprop', {muta: 'logininfo', data: acc})
                            store.commit('setvxprop', {muta: 'logintoken', data: response.data.token})
                        }
                        else if(api == 'logout'){
                            store.commit('setvxprop', {muta: 'logininfo', data: null})
                            store.commit('setvxprop', {muta: 'logintoken', data: null})
                        }
                    }                
                })
                .catch(error => console.log(error))
            console.log(result)
            return result   
        },

        // ■■ taskinfo ■■■■■■■■■■■
        async gettaskinfo(store) {
            let list = null;
            await fs.get()
                .then(doc => list = doc.data())
                .catch(error => alert(error))
            Array.isArray(list.tasklist)? true : list.tasklist = Object.values(list.tasklist) 
            store.commit('setvxlist', {muta: 'tasklist', data: list.tasklist})
            return list.tasklist
        },

        // ■■ Upate List ■■■■■■■■■■■        
        async updatelist(store, {tasklist, msg, act, id}){
            let notify = {news: true, act: act, msg: `${msg} by ${store.state.logininfo}`, id: id}  //set notify
            let seallist = store.state.tasklist.seallist
            store.state.logininfo == 'bkadmin' ?
            await bs.update({tasklist, notify, seallist}) :
            await fs.update({tasklist, notify, seallist})            
            // await store.dispatch('gettaskinfo')
        }, 
               
        // ■■ Realtime Binding List ■■■■■■■■■■■              
        bindListRef: firestoreAction(({ bindFirestoreRef }) => {
            bindFirestoreRef('tasklist', db.firestore().collection('tasklist').doc('v6EUv3f3LCTRQvB4fb0w'))
        }),
        unbindListRef: firestoreAction(({ unbindFirestoreRef }) => {
            unbindFirestoreRef('tasklist', false)
        }),

        setvxlist(store, {muta, data}){
            store.commit('setvxlist', {muta, data})
        },

        setvxprop(store, {muta, data}){
            store.commit('setvxprop', {muta, data})
        }
    },
    mutations:{
        setvxlist: (state, {muta, data}) => state.tasklist[muta] = data,    //! unsafe Solution
        setvxprop: (state, {muta, data}) => state[muta] = data,
        ...vuexfireMutations
    },
    getters:{                                       // use $store.state.[prop]
        logininfo: state => state.logininfo,
        logintoken: state => state.logintoken,
        tasklist: state => state.tasklist.tasklist,     //! unsafe Solution
        notify: state => state.tasklist.notify,
        seallist: state => state.tasklist.seallist,
        subtitle: state => state.subtitle,
        addspr: state => state.addspr,                  
    }
})