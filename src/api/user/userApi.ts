import { api } from '@/assets/ts/comAxios';

export type UserRow = {
  user_id: number;
  login_id: string;
  user_nm: string;
  user_hp_no: string;
  user_role: string;
  use_yn: string;
  reg_id: string;
  reg_dtm: string;
  upd_id?: string;
  upd_dtm?: string;
};

// 사용자 목록 조회
export async function getUserList() {
  const res = await api.get<UserRow[]>('/api/users/list');
  return res.data;
}

// 사용자 추가
export async function insertUser(payload: UserRow[]) {
  return (await api.post<number>('/api/users/insert', payload)).data;
}

// 사용자 수정
export async function updateUser(payload: UserRow[]) {
  return (await api.post<number>('/api/users/update', payload)).data;
}

// 사용자 삭제
export async function deleteUser(payload: UserRow[]) {
  return (await api.post<number>('/api/users/delete', payload)).data;
}