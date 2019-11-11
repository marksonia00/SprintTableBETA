<template>
<!-- ■■■■ Task page ■■■■ -->
    <v-container fluid>
        <v-data-table
            :headers="list.header"
            :items="tasklist"
            :items-per-page="10"
            item-key="TASKID"
            show-select
            class="elevation-1">
            <template v-slot:item.point="{ item }">
                {{ `${item.REMAININGPOINT} / ${item.TOTALPOINT}` }}
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
import { log } from 'util'
import { mapGetters } from "vuex"

  export default {
    name: 'Task',
    props: {
      source: String,
    },
    data: () => ({
		list: {
				header: [
					{ text: 'Task',		value: 'TASKID', align: 'left', sortable: false},
					{ text: 'Sprint',	value: 'SPRINTID' },
					{ text: 'Name',		value: 'NAME' },
					{ text: 'State',	value: 'STATUS' },
					{ text: 'info' ,  	value: 'DESCRIPTION',   sortable: true},
					{ text: 'Owner' ,   value: 'OWNER',         sortable: true},
					{ text: 'Prior' ,   value: 'PRIORITY',      sortable: true},
					{ text: 'Point' ,   value: 'point' },
					{ text: 'Modify' ,	value: 'MODTIME',       sortable: true},
				] },
    }),
	computed:{
		...mapGetters(["tasklist"])
	}
  }
</script>