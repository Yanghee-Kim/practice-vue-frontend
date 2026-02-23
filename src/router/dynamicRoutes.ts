import type { Router } from 'vue-router';
import type { MenuRow } from '@/api/menu/menuApi';

// views 바로 아래 파일만 있는 구조 기준: /src/views/*View.vue
const viewModules = import.meta.glob('@/views/*.vue');

function resolveView(componentKey: string) {
    const fullPath = `/src/views/${componentKey}.vue`;
    const loader = viewModules[fullPath];
    if (!loader) throw new Error(`뷰 컴포넌트 매핑 실패: ${fullPath}`);
    return loader; // () => import(...)
}

export function injectMenuRoutes(router: Router, menus: MenuRow[]) {
    menus.forEach((m) => {
        router.addRoute('app', {
            path: m.path,
            name: m.component_key,
            component: resolveView(m.component_key),
            meta: { title: m.menu_name },
        });
    });
}
