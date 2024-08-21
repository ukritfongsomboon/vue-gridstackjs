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
    {{ items }}

    <grid-stack
      :disabled="disabled"
      :items="items"
      style="width: 90%; height: 90%"
      @on-delete="onRemove"
      @on-update="onUpdate"
    >
      <template v-slot="{ item }">
        <div style="background-color: #fff; width: 100%; height: 100%; display: block; border-radius: inherit">
          {{ item.id }}
        </div>
      </template>
    </grid-stack>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import gridStack from './components/GridStack/gridStack.vue'
const items = ref([
  { id: 'id_1', x: 0, y: 0, w: 3, h: 2, content: 'Widget 1' },
  { id: 'id_2', x: 3, y: 0, w: 3, h: 2, content: 'Widget 2' },
  { id: 'id_3', x: 3, y: 0, w: 3, h: 2, content: 'Widget 3' },
  // { id: 'id_4', x: 3, y: 0, w: 3, h: 2, content: 'Widget 2' },
])

const disabled = ref<boolean>(false)
// let onCreate = null
const a = () => items.value.push({ id: `id_${Date.now()}`, x: 0, y: 0, w: 3, h: 2, content: 'Widget 1' })

const onRemove = (item: any) => {
  items.value = items.value.filter((existingItem) => existingItem.id !== item.id)
}

const onUpdate = (item: any) => {
  alert(JSON.stringify(item))
}
</script>

<style scoped></style>
