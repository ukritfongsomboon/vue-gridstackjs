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
      style="width: 90%; height: 90%"
      @on-delete="onRemove"
      @on-setting="onSetting"
      @on-update="onUpdate"
    >
      <template v-slot="{ item }">
        <div style="width: 100%; height: 100%; display: block; border-radius: inherit">
          <ul>
            <li>id : {{ item.id }}</li>
            <li>x : {{ item.x }} y: {{ item.y }}</li>
            <li>w : {{ item.w }} h : {{ item.h }}</li>
          </ul>
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
    <br>
    {{ items }}
    <br>
    .
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import gridStack from './components/GridStack/gridStack.vue'
const items = ref([
  { id: 'id_1724252312192', x: 0, y: 0, w: 3, h: 2, content: '' },
  { id: 'id_1724252313282', x: 0, y: 2, w: 5, h: 2, content: '' },
  { id: 'id_1724252388593', x: 3, y: 0, w: 2, h: 2, content: '' },
  { id: 'id_1724252389053', x: 5, y: 0, w: 3, h: 2, content: '' },
  { id: 'id_1724252389210', x: 5, y: 2, w: 7, h: 2, content: '' },
  { id: 'id_1724252391018', x: 8, y: 0, w: 2, h: 2, content: '' },
  { id: 'id_1724252391646', x: 10, y: 0, w: 2, h: 2, content: '' },
  { id: 'id_1724252440623', x: 0, y: 4, w: 2, h: 4, content: '' },
  { id: 'id_1724252440778', x: 0, y: 0, w: 2, h: 2, content: '' },
  { id: 'id_1724252440940', x: 4, y: 4, w: 2, h: 4, content: '' },
  { id: 'id_1724252441096', x: 0, y: 0, w: 2, h: 2, content: '' },
  { id: 'id_1724252441254', x: 8, y: 4, w: 4, h: 4, content: '' },
  { id: 'id_1724252441728', x: 0, y: 0, w: 2, h: 2, content: '' },
  { id: 'id_1724252442079', x: 0, y: 0, w: 2, h: 2, content: '' },
])

const disabled = ref<boolean>(false)
// let onCreate = null
const a = () => items.value.push({ id: `id_${Date.now()}`, x: 0, y: 0, w: 2, h: 2, content: '' })

const onRemove = (item: any) => {
  items.value = items.value.filter((existingItem) => existingItem.id !== item.id)
}

const onSetting = (item: any) => {
  alert(JSON.stringify(item))
}
const onUpdate = (_items: any) => {}
</script>

<style scoped></style>
