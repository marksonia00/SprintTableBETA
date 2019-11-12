<template>
    <v-card>
        <v-card-title>
            <span class="headline">Task Profile</span><v-spacer></v-spacer>
            <span class="body-1 mx-2">{{dialog.task.SPRINTID}}</span>
            <span class="body-2 mx-2">{{dialog.task.TASKID}}</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-form v-model="rule.valid">	
                    <v-row>
                        <v-col cols="12" sm="8" md="8">                         <!-- NAME -->
                            <v-text-field 
                                label="Task Name*" 
                                v-model="dialog.task.NAME" 
                                :rules="[v => !!v || 'Name is required']"
                                required
                                clearable
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6" sm="2" md="2">                          <!-- REMAININGPOINT -->
                            <v-text-field 
                                label="Remain pt*" 
                                type="number" 
                                v-model="dialog.task.REMAININGPOINT" 
                                required>
                            </v-text-field>
                        </v-col>
                        <v-col cols="6" sm="2" md="2">                          <!-- TOTALPOINT -->
                            <v-text-field 
                                label="Total pt*" 
                                type="number" 
                                v-model="dialog.task.TOTALPOINT" 
                                required 
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">                         <!-- OWNER -->
                            <v-select 
                                label="Owner*" 
                                :items="Array.from(new Set(tasklist.map(task => task.OWNER.trim()).sort()))" 
                                :rules="[v => !!v || 'Owner is required']"
                                v-model="dialog.task.OWNER"
                                @focus="edit.value = ''"
                            >
                                <template v-slot:prepend-item>              
                                    <v-list-item>	                            <!-- OWNER : add new member-->
                                        <v-text-field
                                            label="New Member" 
                                            v-model="edit.value" 
                                            :rules="[v => v.substr(0, 1) == v.substr(0, 1).toUpperCase() || 'first letter should be UpperCase',
                                                    v => !Array.from(new Set(tasklist.map(task => task.OWNER.trim()).sort()))
                                                            .map(mb => mb.substr(0, 1)).includes(v.substr(0, 1)) || 'duplicate first letter']"
                                            append-outer-icon="mdi-plus"
                                            @click:append-outer="Addmember()"
                                            dense>
                                        </v-text-field>
                                    </v-list-item>	
                                </template>
                            </v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">                         <!-- Priority -->
                            <v-select 
                                label="Priority" 
                                item-text="name"
                                item-value="value"
                                :items="list.prior"
                                v-model="dialog.task.PRIORITY"	
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
                                :items="list.state"
                                v-model="dialog.task.STATUS"						
                            ></v-select>									
                        </v-col>
                        <v-col cols="12">                                       <!-- Description -->
                            <v-textarea 
                                label="Description" 
                                v-model="dialog.task.DESCRIPTION" 
                                rows="3"
                            ></v-textarea>
                        </v-col>
                    </v-row>
                </v-form>	
            </v-container>
            <span class="caption text-right">{{`Last Modify *${dialog.task.MODTIME}`}}</span>
        </v-card-text>
        <v-card-actions> <!-- dialog actions -->
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="dialog.del = true" 
                    :disabled="dialog.target == null">
                    Delete
            </v-btn>
            <v-btn color="blue darken-1" text @click="dialog.open = false">
                    Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="UpdateTask('dialog', dialog.task, 'update')" 
                    :disabled="JSON.stringify(dialog.target) == JSON.stringify(dialog.task) || !rule.valid">
                    Save
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'taskDialog',
    // props: ['dialog'],
    data: () => ({
        dialog: {open: false, task: {}, target: {}, del: false},
        rule: {valid: true}, 
        list: {
            state: [
				{value: 0, name: "to do", color: "teal accent-4"}, 
				{value: 1, name: "in process", color: "light-blue accent-4"}, 
				{value: 2, name: "checking", color: "amber accent-4"}, 
				{value: 3, name: "done", color: "light-green accent-4"}, 
				], 
            prior: [
				{value: 0, name: 'Highest', color: '#E53935'}, 
				{value: 1, name: 'High',    color: '#FFB300'}, 
				{value: 2, name: 'Mid',     color: '#1565C0'}, 
				{value: 3, name: 'Low',     color: '#37474F'}
				]},
        edit: {sprint: null, value: ''},
    }),
	computed:{
        ...mapGetters(["tasklist"]),
    }
}
</script>