<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { getMenuList, type MenuRow } from '@/api/menu/menuApi';
    import { injectMenuRoutes } from '@/router/dynamicRoutes';

    const drawer = ref(true);
    const menus = ref<MenuRow[]>([]);
    const router = useRouter();

    onMounted(async () => {
        const role: 'ADMIN' | 'USER' = 'ADMIN'; // 임시
        const data = await getMenuList(role);
        menus.value = data;

        injectMenuRoutes(router, data);
    });
</script>

<template>
  <VApp>
    <VLayout>

      <VNavigationDrawer v-model="drawer" permanent>
        <VList density="compact" nav>
          <VListItem title="HOME" to="/" link />

          <VListItem
            v-for="m in menus"
            :key="m.path"
            :title="m.menu_name"
            :to="m.path"
            link
          />
        </VList>
      </VNavigationDrawer>

      <VAppBar>
        <VAppBarNavIcon @click="drawer = !drawer" />
        <VAppBarTitle>PRACTICE</VAppBarTitle>
      </VAppBar>

      <VMain>
        <VContainer fluid class="pa-4">
          <RouterView />
        </VContainer>
      </VMain>

      <VFooter app>
        <span class="text-caption mx-auto">© 2026</span>
      </VFooter>

    </VLayout>
  </VApp>
</template>
