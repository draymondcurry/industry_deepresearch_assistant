

import { Table } from 'antd'
import { useEffect, useRef, useState } from 'react'
import styles from './chart.module.scss'
import type { ChartConfig, ChartType } from './types'

// 动态加载 ECharts
let echarts: typeof import('echarts') | null = null

async function loadECharts() {
  if (!echarts) {
    echarts = await import('echarts')
  }
  return echarts
}

interface ChartProps {
  config: ChartConfig
  width?: string | number
  height?: string | number
  className?: string
}

// 折线图/柱状图/饼图/散点图组件
function EChartsRenderer(props: {
  config: ChartConfig
  width?: string | number
  height?: string | number
}) {
  const { config, width = '100%', height = 400 } = props
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<ReturnType<typeof echarts.init> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function initChart() {
      if (!chartRef.current) return

      try {
        const ec = await loadECharts()

        if (!mounted || !chartRef.current) return

        // 初始化或获取实例
        if (!chartInstance.current) {
          chartInstance.current = ec.init(chartRef.current, 'dark')
        }

        // 设置配置
        const option = config.echarts_option || buildDefaultOption(config)
        chartInstance.current.setOption(option)

        setLoading(false)
      } catch (error) {
        console.error('Failed to initialize chart:', error)
        setLoading(false)
      }
    }

    initChart()

    // 处理窗口大小变化
    const handleResize = () => {
      chartInstance.current?.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      mounted = false
      window.removeEventListener('resize', handleResize)
      chartInstance.current?.dispose()
      chartInstance.current = null
    }
  }, [config])

  return (
    <div className={styles.chartWrapper}>
      {config.title && <div className={styles.chartTitle}>{config.title}</div>}
      <div
        ref={chartRef}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
        }}
        className={styles.chartContainer}
      />
      {loading && <div className={styles.chartLoading}>加载图表中...</div>}
    </div>
  )
}

// 构建默认配置
function buildDefaultOption(config: ChartConfig) {
  const { type, title, data } = config

  const baseOption = {
    title: {
      text: title,
      left: 'center',
      textStyle: { color: '#e8e8f0' },
    },
    tooltip: {
      trigger: type === 'pie' ? 'item' : 'axis',
      backgroundColor: '#1e1e3a',
      borderColor: '#2a2a4a',
      textStyle: { color: '#e8e8f0' },
    },
    legend: {
      bottom: 0,
      textStyle: { color: '#a0a0b0' },
    },
    backgroundColor: 'transparent',
    color: [
      '#6C5CE7',
      '#a855f7',
      '#4fc3f7',
      '#66bb6a',
      '#ffa726',
      '#ef5350',
      '#26c6da',
      '#ab47bc',
    ],
  }

  if (type === 'line' || type === 'bar') {
    return {
      ...baseOption,
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: data?.xAxis || [],
      },
      yAxis: {
        type: 'value',
      },
      series:
        data?.series?.map((s) => ({
          name: s.name,
          type,
          data: s.data,
          smooth: type === 'line',
        })) || [],
    }
  }

  if (type === 'pie') {
    return {
      ...baseOption,
      series: [
        {
          type: 'pie',
          radius: '60%',
          data: data?.series?.[0]?.data || [],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          label: {
            formatter: '{b}: {d}%',
          },
        },
      ],
    }
  }

  if (type === 'scatter') {
    return {
      ...baseOption,
      xAxis: { type: 'value' },
      yAxis: { type: 'value' },
      series: [
        {
          type: 'scatter',
          data: data?.series?.[0]?.data || [],
          symbolSize: 10,
        },
      ],
    }
  }

  return baseOption
}

// 表格组件
function TableRenderer(props: { config: ChartConfig }) {
  const { config } = props

  const columns =
    config.columns?.map((col) => ({
      title: col.label,
      dataIndex: col.key,
      key: col.key,
    })) || []

  const dataSource =
    (config.data as unknown as Record<string, unknown>[]) || []

  return (
    <div className={styles.tableWrapper}>
      {config.title && <div className={styles.chartTitle}>{config.title}</div>}
      <Table
        columns={columns}
        dataSource={dataSource.map((item, index) => ({
          ...item,
          key: index,
        }))}
        pagination={
          config.pagination
            ? { pageSize: config.pageSize || 10 }
            : false
        }
        size="small"
        scroll={{ x: 'max-content' }}
      />
    </div>
  )
}

// 主组件
export function Chart(props: ChartProps) {
  const { config, width, height, className } = props

  if (!config) {
    return null
  }

  const chartType = config.type as ChartType

  return (
    <div className={`${styles.chart} ${className || ''}`}>
      {chartType === 'table' ? (
        <TableRenderer config={config} />
      ) : (
        <EChartsRenderer config={config} width={width} height={height} />
      )}
    </div>
  )
}

// 数据洞察展示组件
export function DataInsights(props: {
  insights: string[]
  className?: string
}) {
  const { insights, className } = props

  if (!insights || insights.length === 0) {
    return null
  }

  return (
    <div className={`${styles.insights} ${className || ''}`}>
      <div className={styles.insightsTitle}>数据洞察</div>
      <ul className={styles.insightsList}>
        {insights.map((insight, index) => (
          <li key={index} className={styles.insightItem}>
            {insight}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Chart
export type { ChartConfig, ChartType, DataInsight } from './types'
