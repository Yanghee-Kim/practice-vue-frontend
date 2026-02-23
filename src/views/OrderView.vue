<script setup lang="ts">
import { ref } from 'vue'

type OrderRow = {
  orderNo: string
  customerNm: string
  productNm: string
  qty: number
  status: string
}

const rows = ref<OrderRow[]>([])

function addRow() {
  rows.value.push({
    orderNo: '',
    customerNm: '',
    productNm: '',
    qty: 1,
    status: 'NEW',
  })
}
</script>

<template>
  <VCard class="pa-4">
    <VCardTitle class="d-flex justify-space-between align-center">
      <span>주문관리</span>
      <VBtn color="primary" @click="addRow">
        + 추가
      </VBtn>
    </VCardTitle>

    <VTable density="compact">
      <thead>
        <tr>
          <th>주문번호</th>
          <th>고객명</th>
          <th>상품명</th>
          <th>수량</th>
          <th>상태</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(row, index) in rows" :key="index">
          <td>
            <VTextField
              v-model="row.orderNo"
              variant="outlined"
              density="compact"
              hide-details
              placeholder="ORD-0001"
            />
          </td>

          <td>
            <VTextField
              v-model="row.customerNm"
              variant="outlined"
              density="compact"
              hide-details
              placeholder="고객명"
            />
          </td>

          <td>
            <VTextField
              v-model="row.productNm"
              variant="outlined"
              density="compact"
              hide-details
              placeholder="상품명"
            />
          </td>

          <td style="width: 140px;">
            <VTextField
              v-model.number="row.qty"
              type="number"
              min="1"
              variant="outlined"
              density="compact"
              hide-details
            />
          </td>

          <td style="width: 160px;">
            <VSelect
              v-model="row.status"
              :items="['NEW', 'PAID', 'SHIPPED', 'CANCEL']"
              variant="outlined"
              density="compact"
              hide-details
            />
          </td>
        </tr>
      </tbody>
    </VTable>
  </VCard>
</template>
