<template>
    <v-card>
        <v-card-title class="subtitle-1 red--text">Delete Task?</v-card-title>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                @click="$emit('dismiss')"
            >
                Cancel
            </v-btn>
            <v-btn
                color="red darken-1"
                text
                @click="$emit('callback')"                                   
            >
                Delete
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
	name: 'delDialog',
}
</script>