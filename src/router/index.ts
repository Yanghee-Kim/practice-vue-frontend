import { createRouter, createWebHistory } from 'vue-router';

import AppLayout from '@/layouts/AppLayout.vue';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'app',
			component: AppLayout,
			children: [
				{ path: '', name: 'home', component: HomeView },
			],
		},

		{ path: '/login', name: 'login', component: LoginView },
	]
});

router.onError(() => {
	window.location.reload();
});

function isLogIn() {
	return !!localStorage.getItem('accessToken');
}

router.beforeEach((to) => {
	// 로그인 페이지는 항상 허용
	if (to.name === 'login') return true;

	// 로그인 안 했으면 무조건 로그인으로
	if (!isLogIn()) {
		return { name: 'login' };
	}

	return true;
});

export default router;
