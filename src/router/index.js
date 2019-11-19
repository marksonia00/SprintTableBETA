import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

	const routes = [
	{
		path: '*',
		redirect: '/Home'
	},
	{
		path: '/Home',
		name: 'login',
		component: () => import('../components/login.vue')
	},
	{
		path: '/index',
		name: 'index',
		component: () => import('../components/index.vue'),
		children: [
		{
			path: 'Sprint',
			name: 'Sprint',
			component: () => import('../components/page/sprint.vue'),
		},
		{
			path: 'Task',
			name: 'Task',
			component: () => import('../components/page/task.vue'),
		},
		{
			path: 'Seal',
			name: 'Seal',
			component: () => import('../components/page/seal.vue'),
		},
		{
			path: 'Owner',
			name: 'Owner',
			component: () => import('../components/page/owner.vue'),
		},
		{
			path: 'Timeline',
			name: 'Timeline',
			component: () => import('../components/page/timeline.vue'),
		}
		]
	},
	]

	const router = new VueRouter({
	routes
	})

export default router
