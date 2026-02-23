import { api } from '@/assets/ts/comAxios';

export type MenuRow = {
  menu_id: number;
  menu_name: string;
  path: string;
  component_key: string;
  sort_no: number;
};

// 메뉴 조회 (권한 전달)
export async function getMenuList(role: 'ADMIN' | 'USER') {
  const res = await api.post<MenuRow[]>('/api/menus', { 'role_code': role });
  return res.data;
}
