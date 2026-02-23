<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/assets/ts/comAxios'

const router = useRouter();

const loginId = ref('');
const loginPw = ref('');
const errorMsg = ref('');

async function login() {
  errorMsg.value = ''

  try {
    const res = await api.post('/api/auth/login', {
      login_id: loginId.value,
      login_pw: loginPw.value,
    });

    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('role', res.data.user_role);

    router.replace('/');
  } catch (e: any) {
    errorMsg.value = '아이디 또는 비밀번호가 올바르지 않습니다.'
  }
}
</script>

<template>
  <VApp>
    <VContainer class="fill-height d-flex align-center justify-center">
      <VCard width="400">
        <VCardTitle>Login</VCardTitle>
        <VCardText>
          <VTextField
            v-model="loginId"
            label="Login ID"
            variant="outlined"
            class="mb-3"
          />

          <VTextField
            v-model="loginPw"
            label="Password"
            type="password"
            variant="outlined"
            class="mb-3"
          />

          <div v-if="errorMsg" class="text-error text-caption mb-2">
            {{ errorMsg }}
          </div>

          <VBtn block color="primary" @click="login">
            로그인
          </VBtn>
        </VCardText>
      </VCard>
    </VContainer>
  </VApp>
</template>
