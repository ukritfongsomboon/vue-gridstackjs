<template>
  <div
    class="grid-stack-item"
    :gs-w="item.w"
    :gs-h="item.h"
    :gs-id="item.id"
    :id="item.id"
    :key="item.id"
    :gs-auto-position="true"
  >
    <div class="grid-stack-item-content">
      <slot :item="localItem"> </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type GridStackWidget } from 'gridstack'
import { ref, defineProps } from 'vue'

const props = defineProps<{
  item: any // Use appropriate type here
}>()

const emit = defineEmits<{
  (e: 'update:item', value: Array<number>): void // Replace with your prop type
}>()

const localItem = ref<GridStackWidget>(props.item)
</script>

<style lang="scss">
.grid-stack-item-content {
  background-color: #18bc9c;
  border-radius: 0.5rem;
  padding: 1rem;
}
</style>
