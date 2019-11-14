<template>
    <v-card>
        <v-card-title>
            <span class="headline">Task Profile</span><v-spacer></v-spacer>
            <span class="body-1 mx-2">{{task.SPRINTID}}</span>
            <span class="body-2 mx-2">{{task.TASKID}}</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-form v-model="rule.valid">	
                    <v-row>
                        <v-col cols="12" sm="8" md="8">                         <!-- NAME -->
                            <v-text-field 
                                label="Task Name*" 
                                v-model="task.NAME" 
                                :rules="[v => !!v || 'Name is required']"
                                required
                                clearable
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6" sm="2" md="2">                          <!-- REMAININGPOINT -->
                            <v-text-field 
                                label="Remain pt*" 
                                type="number" 
                                v-model="task.REMAININGPOINT" 
                                required>
                            </v-text-field>
                        </v-col>
                        <v-col cols="6" sm="2" md="2">                          <!-- TOTALPOINT -->
                            <v-text-field 
                                label="Total pt*" 
                                type="number" 
                                v-model="task.TOTALPOINT" 
                                required 
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">          <!-- OWNER -->
                            <v-select 
                                label="Owner*" 
                                :items="mixin.member" 
                                :rules="[v => !!v || 'Owner is required']"
                                v-model="task.OWNER"
                                @focus="mixin.value = ''"
                            >
                                <template v-slot:prepend-item>              
                                    <v-list-item>	            <!-- OWNER : add new member-->
                                        <v-text-field
                                            label="New Member" 
                                            v-model="mixin.value" 
                                            :rules="[v => v.substr(0, 1) == v.substr(0, 1).toUpperCase() || 'first letter should be UpperCase',
                                                    v => !mixin.member.map(mb => mb.substr(0, 1)).includes(v.substr(0, 1)) || 'duplicate first letter']"
                                            append-outer-icon="mdi-plus"
                                            @click:append-outer="Addmember()"
                                            dense>
                                        </v-text-field>
                                    </v-list-item>	
                                </template>
                            </v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">           <!-- Priority -->
                            <v-select 
                                label="Priority" 
                                item-text="name"
                                item-value="value"
                                :items="mixin.prior"
                                v-model="task.PRIORITY"	
                            >
                            <template v-slot:item="{ item, index }">
                                <span :style="{color: `${item.color}`}">{{item.name}}</span>
                            </template>	
                            <template v-slot:selection="{ item, index }">										
                                <span :style="{color: `${item.color}`}">{{item.name}}</span>
                            </template>
                            </v-select>									
                        </v-col>
                        <v-col cols="12" sm="6" md="4">                         <!-- Status -->
                            <v-select 
                                label="Status" 
                                item-text="name"
                                item-value="value"
                                :items="mixin.state"
                                v-model="task.STATUS"						
                            ></v-select>									
                        </v-col>
                        <v-col cols="12">                                       <!-- Description -->
                            <v-textarea 
                                label="Description" 
                                v-model="task.DESCRIPTION" 
                                rows="3"
                            ></v-textarea>
                        </v-col>
                    </v-row>
                </v-form>	
            </v-container>
            <span class="caption text-right">{{`Last Modify *${task.MODTIME}`}}</span>
        </v-card-text>
        <v-card-actions> <!-- dialog actions -->
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text 
                    @click="$emit('update:del', true)" 
                    :disabled="typeof target == 'string'">
                    Delete
            </v-btn>
            <v-btn color="blue darken-1" text 
                    @click="$emit('update:open', false)">
                    Close
            </v-btn>
            <v-btn color="blue darken-1" text 
                    @click="typeof target == 'string'? submitTask('create') : submitTask('update')" 
                    :disabled="JSON.stringify(target) == JSON.stringify(task) || !rule.valid">
                    Save
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import mixindata from '../mixin/mixindata'

export default {
    name: 'taskDialog',
    mixins: [mixindata],
    props: ['open', 'task', 'target', 'del'],
    data: () => ({
        rule: {valid: true}, 
    }),
	computed:{
        ...mapGetters(["tasklist"]),
    },   
    methods:{
		// ■■■■ Set task ■■■■
		submitTask(type){
            let templist = this.tasklist
            if(type == 'create'){                     //* create 
                let tentid = this.tasklist.filter(tk => tk.SPRINTID.trim() == this.target)
                                            .map(tk => parseInt(tk.TASKID.trim(), 10))
                                            .reduce((now, next) => next > now ? next : now)
                let newtask = Object.assign({}, this.task)
                newtask.TASKID = (tentid + 1).toString()
                newtask.SPRINTID = this.target
                newtask.MODTIME = new Date().toLocaleString()
                templist.push(Object.assign({}, newtask))
            }
            else if(type == 'update'){                  //* update
                let index = this.tasklist.findIndex(tk => tk.TASKID == this.target.TASKID) 
                templist[index] = Object.assign({}, this.task)
                templist[index].MODTIME = new Date().toLocaleString()
            }   

            this.mixinUpdater('submitTask', templist, '')     //! => '../mixin/mixindata'
            this.$emit('update:open', false)
            this.$emit('update:del', false)
        },
    }
}
</script>