<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { templateRef, useEventListener, useRafFn } from '@vueuse/core'

const props = defineProps<{
  value: number // the current value of the chart at now
  min: number // the minimum value of the chart
  max: number // the maximum value of the chart
  width?: number // the width of the chart in pixels, default is 200px
  height?: number // the height of the chart in pixels, default is 50px
  color?: string // the color of the chart, default is #4CAF50
  backgroundColor?: string // the background color of the chart, default is #f0f0f0
}>()

const chartEl = templateRef<HTMLCanvasElement>('chartEl')

function drawChart() {
  const canvas = chartEl.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw the background
  ctx.fillStyle = props.backgroundColor || '#f0f0f0'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Draw the chart
  const chartWidth = props.width || 200
  const chartHeight = props.height || 50
  const chartX = (canvas.width - chartWidth) / 2
  const chartY = (canvas.height - chartHeight) / 2
  const chartValue = ((props.value - props.min) / (props.max - props.min)) * chartWidth

  ctx.fillStyle = props.color || '#4CAF50'
  ctx.fillRect(chartX, chartY, chartValue, chartHeight)
}

watch(() => props.value, () => {
  drawChart()
})

onMounted(() => {
  drawChart()
})

</script>

<template>
  <canvas ref="chartEl" class="chart" />
</template>

<style scoped>
.chart {
  width: 200px;
  height: 50px;
}
</style>
