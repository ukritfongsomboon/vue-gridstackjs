<template>
  <div style="width: 100%; height: 100%">
    <button
      color="success"
      @click="a"
    >
      text
    </button>
    <button
      color="success"
      @click="() => (disabled = !disabled)"
    >
      {{ disabled ? 'Enable' : 'Disable' }}
    </button>

    <grid-stack
      :disabled="disabled"
      :items="items"
      style="width: 90%; height: 70%"
      @on-delete="onRemove"
      @on-setting="onSetting"
      @on-update="onUpdate"
      @on-create="onCreate"
    >
      <template v-slot="{ item }">
        <div style="width: 100%; height: 100%; display: block; border-radius: inherit">
          <!-- <ul>
            <li>id : {{ item.id }}</li>
            <li>x : {{ item.x }} y: {{ item.y }}</li>
            <li>w : {{ item.w }} h : {{ item.h }}</li>
          </ul> -->
          <canvas
            :id="`chart_${item.id}`"
            style="width: 100%; height: 100%"
          ></canvas>
        </div>
      </template>
    </grid-stack>
    <!-- <u>
      <li
        v-for="i in items"
        :key="i.id"
      >
        {{ i }}
      </li>
    </u> -->
    <!-- <textarea style="width: 50%; height: 50%"> {{ items }} </textarea> -->
    <br />
    {{ items }}
    <br />
    {{ charging }}|{{ chargingTime }}|{{ dischargingTime }}|{{ level }}
    <br />
    {{ isOnline }}|-{{ offlineAt }}|-{{ downlink }}|-{{ downlinkMax }}|-{{ effectiveType }}|-{{ saveData }}|-{{ type }}
  </div>
</template>

<script setup lang="ts">
import type { modelItem, modelItems } from './components/GridStack/type'

import Chart from 'chart.js/auto'
// import type { ChartConfiguration } from 'chart.js'
import { ref, onMounted } from 'vue'
import gridStack from './components/GridStack/gridStack.vue'
const items = ref<modelItems>([
  { id: 'id_7', x: 2, y: 3, w: 10, h: 3, type: 'bar', autoPosition: false },
  { id: 'id_2', x: 10, y: 0, w: 2, h: 3, type: 'pie' },
  { id: 'id_3', x: 7, y: 0, w: 3, h: 3, type: 'line' },
  { id: 'id_5', x: 0, y: 3, w: 2, h: 3, type: 'pie' },
  { id: 'id_6', x: 0, y: 0, w: 4, h: 3, type: 'bar' },
  { id: 'id_1', x: 4, y: 0, w: 3, h: 3, type: 'pie' },
])

const disabled = ref<boolean>(false)

const a = () => items.value.push({ id: `id_${Date.now()}`, x: 0, y: 0, w: 6, h: 2, autoPosition: true, type: 'bar' })

// TODO เป็น Function สำหรับลบ Item
const onRemove = (item: modelItem) => {
  console.log(item)
  items.value = items.value.filter((existingItem: modelItem) => existingItem.id !== item.id)
}

// TODO เป็น Function สำหรับรับ Event Edit Item
const onSetting = (item: modelItem) => {
  alert(JSON.stringify(item))
}

// TODO เป็น Function สำหรับรับ Event Update Item (Move , Scale)
const onUpdate = (items: modelItem): void => {
  console.log(items)
}

const onCreate = (item: modelItem) => {
  // TODO Create Chart js
  const opt: any = {
    type: item.type || 'bar',
    options: defaultOption,
    data: {
      labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
      datasets: [
        {
          label: 'Acquisitions by year',
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        },
      ],
    },
  }
  renderChart(document.getElementById(`chart_${item.id}`) as HTMLCanvasElement, opt)
}

const defaultOption = {
  borderRadius: 5,
  barThickness: 5,
  animation: false,
  // responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
    },
  },
}
onMounted(() => {
  items.value.forEach((item) => {
    const opt: any = {
      type: item.type || 'bar',
      options: defaultOption,
      data: {
        labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
        datasets: [
          {
            label: 'Acquisitions by year',
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9],
          },
        ],
      },
    }
    renderChart(document.getElementById(`chart_${item.id}`) as HTMLCanvasElement, opt)
  })
})

const renderChart = (element: HTMLCanvasElement, options: any): void => {
  new Chart(element, options)
}

import { useBattery, useNetwork } from '@vueuse/core'

const { charging, chargingTime, dischargingTime, level } = useBattery()
const { isOnline, offlineAt, downlink, downlinkMax, effectiveType, saveData, type } = useNetwork()
</script>

<style scoped></style>
