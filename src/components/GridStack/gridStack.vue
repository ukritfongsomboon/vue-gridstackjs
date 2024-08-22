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
        :gs-x="item.x"
        :gs-y="item.y"
        :gs-id="item.id"
        :id="item.id"
        :gs-auto-position="item.autoPosition || false"
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
          @click="() => emit('onSetting', item)"
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
  column: 24,

  // []
  // columnOpts: {
  // columnWidth: 12,
  // columnMax: 12,
  //   breakpoints: [{ w: 500, c: 12, layout: 'scale' }],
  // breakpointForWindow: true,
  // layout: 'compact',
  // },

  // [x] สำหรับ Disable Drag Element
  disableDrag: true,
  // [x] สำหรับ Resize Element
  disableResize: true,
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
  (e: 'onSetting', value: GridStackWidget): GridStackWidget
  (e: 'onUpdate', value: GridStackWidget[]): GridStackWidget[]
}>()

// [x] เป็นส่วนสำหรับ Define 2 way Models
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

  // [x] สำหรับ แก้ไข Layout ของ Widget
  grid.on('change', (_event: Event, nodes: GridStackNode[]) => {
    // const nodes = grid.getGridItems()
    console.log(nodes)
    nodes.forEach((node) => {
      const itemToUpdate = items.value.find((item) => item.id === node.id)
      if (itemToUpdate) {
        Object.assign(itemToUpdate, {
          x: node.x,
          y: node.y,
          w: node.w,
          h: node.h,
        })
      }
    })
    emit('onUpdate', items.value)
  })

  grid.on('added', (_event: Event, nodes: GridStackNode[]) => {
    for (const idx in items.value) {
      const x = nodes.find((n) => n.id === items.value[idx].id)
      if (x) {
        items.value[idx].x = x.x
        items.value[idx].y = x.y
        items.value[idx].autoPosition = false
      }
    }
  })
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
    console.log('watcher')
    if (!grid) return

    const oldItems = await Promise.all(grid.getGridItems())

    // // [x] Find elements in newValue that are not in oldItems
    const addedItems = newValue.filter((newItem) => !oldItems.some((oldItem) => oldItem.id === newItem.id))
    const removedItems = oldItems.filter((oldItem) => !newValue.some((newItem) => newItem.id === oldItem.id))

    // // [x] Add new widgets
    await Promise.all(addedItems.map(async (widget) => grid.makeWidget(`#${widget.id}`)))

    // // [x] Remove old widgets
    await Promise.all(removedItems.map(async (widget) => grid.removeWidget(`#${widget.id}`, true)))

    // [x] Clear All Grid Position
    grid.compact("list")
    console.log("Compac");

    // [] UPDATE New value to items

    // console.log(grid.getGridItems())
    // const x = grid.getGridItems().find((i) => addedItems.some((j) => i.id == j.id))?.gridstackNode
    // console.log(x)
    // items.value = items.value.map((item) => {
    //   return { ...item, ...{ x: x?.x, y: x?.y } }
    // })
  },
  { deep: true, immediate: true }
)
</script>

<style lang="scss">
.grid-stack {
  // background: red !important;
  padding: 0;
  width: 100%;
  // height: 100% ;
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

// TODO Grid Stack Columns Configuration
// https://github.com/gridstack/gridstack.js/blob/master/spec/e2e/html/810-many-columns.css
$columns: 24;
@function fixed($float) {
  @return calc(round($float * 1000) / 1000); // total 4-5 digits being %
}
.gs-#{$columns} > .grid-stack-item {
  width: fixed(calc(100% / $columns));
  @for $i from 1 through $columns - 1 {
    &[gs-x='#{$i}'] {
      left: fixed(calc(100% / $columns) * $i);
    }
    &[gs-w='#{$i}'] {
      width: fixed(calc(100% / $columns) * ($i));
    }
  }
}
</style>
