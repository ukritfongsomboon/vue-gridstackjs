<template>
  <div
    class="grid-main-layout"
    :class="!disabled ? 'enable-edit' : ''"
  >
    <div class="grid-stack">
      <div
        v-for="item in items"
        :key="item.id"
        class="grid-stack-item"
        :gs-w="item.w"
        :gs-h="item.h"
        :gs-id="item.id"
        :id="item.id"
        :gs-auto-position="true"
      >
        <!-- NOTE Content -->
        <div class="grid-stack-item-content">
          <slot :item="item"> </slot>
        </div>

        <!-- NOTE Control Button -->
        <div
          v-if="!disabled"
          class="ui-delete-btn ui-btn"
          @click="() => emit('onDelete', item)"
        >
          <i class="fa fa-trash"></i>
        </div>
        <div
          v-if="!disabled"
          class="ui-edit-btn ui-btn"
          @click="() => emit('onUpdate', item)"
        >
          <i class="fa fa-cog"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import 'gridstack/dist/gridstack.min.css'
import 'gridstack/dist/gridstack-extra.min.css'

import { GridStack } from 'gridstack'
import type { GridStackWidget, GridStackOptions, GridStackNode } from 'gridstack'

let grid: GridStack
const options: GridStackOptions = {
  // [x] ทำให้ Drag Drop ออกมาจาก parent Element
  acceptWidgets: false,

  // [x] สำหรับ show resize button
  alwaysShowResizeHandle: true,

  // [x] สำหรับ animation สำหรับการ Swap items
  animate: true,

  // []
  auto: false,

  // []
  // cellHeight: 'auto',

  // cellHeightThrottle: 100,

  // [x] สำหรับแก้จำนวน column Default:12
  column: 12,

  // []
  // columnOpts: {
  // columnWidth: 12,
  // columnMax: 12,
  //   breakpoints: [{ w: 500, c: 12, layout: 'scale' }],
  // breakpointForWindow: true,
  // layout: 'compact',
  // },

  // [x] สำหรับ Disable Drag Element
  disableDrag: false,
  // [x] สำหรับ Resize Element
  disableResize: false,
  // [x] สำหรับทำ ให้ Element ลอยขึ้นด้านบน
  float: false,

  margin: 5,
  // marginTop: 5,
  // marginRight: 5,
  // marginBottom: 5,
  // marginLeft: 5,

  // [x] สำหรับตั้งค่า Edge ในการ Resize element
  resizable: { autoHide: true, handles: 'se' },

  // [x] สำหรับลบ Element เมื่อ Drag Element ออกนอก Parent Element
  removable: false,

  // [x] สำหรับปิดการใช้งาน DragDrop , Resize
  staticGrid: false,

  // column: 4,
  cellHeight: 100,
  minRow: 1,
  // margin: 10
}

const emit = defineEmits<{
  (e: 'onDelete', value: GridStackWidget): GridStackWidget
  (e: 'onUpdate', value: GridStackWidget): GridStackWidget
  (e: 'onMove', value: GridStackWidget): GridStackWidget
  (e: 'onResize', value: GridStackWidget): GridStackWidget
}>()

// TODO เป็นส่วนสำหรับ Define 2 way Models
const disabled = defineModel<boolean>('disabled', {
  default: false,
})
const items = defineModel<GridStackWidget[]>('items', {
  default: () => [],
})

onMounted(async () => {
  // [x] Initial Grid Stack Object
  grid = await GridStack.init(options)

  // [x] Make Element to Grid Stack Widget
  items.value.forEach(async (widget) => {
    grid.makeWidget(`#${widget.id}`)
  })

  // [x] Initial Grid Stack Disable/Enable Widget
  if (disabled.value) grid.disable()
  else grid.enable()

  // [] Register Event for GridStack
  // grid.on('disable enable', (e: any) => {
  //   console.log(e)
  // })

  // []
  // grid.on('change', (e: GridStackNode[]) => {
  //   console.log(e)
  // })

  grid.on('change', (event: Event, nodes: GridStackNode[]) => {
    console.log(nodes)
    // nodes.forEach((node) => {
    //   console.log(event, ' : ', node.id)
    // console.log(`Widget with id: ${node.id} changed.`);
    // console.log(`New position: (${node.x}, ${node.y})`);
    // console.log(`New size: ${node.width} x ${node.height}`);
    // })
  })

  // grid.on('resizestart resize resizestop dragstart drag dragstop', (e: any) => {
  //   console.log(e)
  // })
  // grid.on('enable')
  // grid.on('change')
  // grid.on( 'resizestart' | 'resize' | 'resizestop' | 'dragstart' | 'drag' | 'dragstop', callback: GridStackElementHandler): GridStack;
  // }
  // console.log('End of mounted')
  //   grid.on('resize',(e: GridStackElementHandler):GridStack =>{
  // return
  //   }
})

// TODO Watch for changes in the prop and update the local variable accordingly
watch(
  () => disabled.value,
  (n) => {
    if (grid) {
      n ? grid.disable() : grid.enable()
    }
  },
  { immediate: true }
)
watch(
  () => items.value,
  async (newValue: GridStackWidget[]) => {
    if (grid) {
      const oldItems = await grid.getGridItems()

      // TODO Find elements in newValue that are not in oldValue
      const addedItems = newValue.filter((newItem) => !oldItems.some((oldItem) => oldItem.id === newItem.id))
      addedItems.forEach(async (widget) => grid.makeWidget(`#${widget.id}`))

      // TODO Find elements in oldValue that are not in newValue
      const removedItems = oldItems.filter((oldItem) => !newValue.some((newItem) => newItem.id === oldItem.id))
      removedItems.forEach(async (widget) => grid.removeWidget(`#${widget.id}`, true))

      grid.compact()
    }
  },
  { deep: true, immediate: true }
)
</script>

<style lang="scss">
.grid-stack {
  // background: red;
  padding: 0;
  width: 100%;
  height: 100%;
}

.grid-stack-item-content {
  background-color: #18bc9c;
  border-radius: 0.5rem;
  padding: 1rem;
}

.grid-main-layout {
  overflow: scroll;
  height: 100%;
  width: 100%;
}
.grid-main-layout.enable-edit {
  --dot-bg: rgb(255, 255, 255);
  --dot-color: rgb(0, 0, 0);
  --dot-size: 1.1px;
  --dot-space: 1rem;
  background: linear-gradient(90deg, var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space), linear-gradient(var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space),
    var(--dot-color);
}

.ui-delete-btn {
  bottom: 5px;
  left: 5px;
}

.ui-edit-btn {
  top: 5px;
  right: 5px;
}

.ui-btn {
  z-index: 100;
  user-select: none;
  position: absolute;
  width: 20px;
  height: 20px;
  // background-color: red;
  color: #636869;
  cursor: pointer;
}

.ui-btn i {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
