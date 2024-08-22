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
    .
  </div>
</template>

<script setup lang="ts">
import Chart from 'chart.js/auto'
import type { ChartConfiguration } from 'chart.js'
import { ref, onMounted } from 'vue'
import gridStack from './components/GridStack/gridStack.vue'
const items = ref([
  { id: 'id_7', x: 0, y: 0, w: 8, h: 4, content: '', autoPosition: false },
  { id: 'id_2', x: 17, y: 2, w: 7, h: 2, content: '' },
  { id: 'id_3', x: 8, y: 0, w: 8, h: 2, content: '' },
  { id: 'id_5', x: 8, y: 2, w: 5, h: 2, content: '' },
  { id: 'id_6', x: 13, y: 2, w: 4, h: 2, content: '' },
  { id: 'id_1', x: 16, y: 0, w: 8, h: 2, content: '' },
])

const disabled = ref<boolean>(false)
// let onCreate = null
const a = () => items.value.push({ id: `id_${Date.now()}`, x: 0, y: 0, w: 6, h: 2, content: '', autoPosition: true })

const onRemove = (item: any) => {
  items.value = items.value.filter((existingItem) => existingItem.id !== item.id)
}

const onSetting = (item: any) => {
  alert(JSON.stringify(item))
}
const onUpdate = (_items: any) => {}

onMounted(() => {
  items.value.forEach((item) => {
    const opt: any = {
      type: 'bar',
      options: {
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
      },
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
    new Chart(document.getElementById(`chart_${item.id}`) as HTMLCanvasElement, opt)
  })
})
</script>

<style scoped></style>
