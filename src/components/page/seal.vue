<template>
	<v-container fluid>
		<taskDialog v-model="dialog"></taskDialog>
	</v-container>
</template>

<script>
import taskDialog from '../unit/taskDialog'

export default {
	name: 'Seal',
	components: { taskDialog },
	props: {
		source: String,
	},
	data: () => ({
		dialog: {open: false, task: {}, target: {}, del: false},
	})
}
</script>