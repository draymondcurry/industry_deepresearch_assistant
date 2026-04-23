
import { Router } from '@/router'
import { App as AntdApp, ConfigProvider, Spin, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { useCallback, useRef, useState } from 'react'

function App() {
  return (
    <ConfigProvider
      theme={{
        cssVar: true,
        algorithm: theme.darkAlgorithm,
        token: {
          // 品牌色：科技蓝紫
          colorPrimary: '#6C5CE7',
          borderRadius: 8,

          // 暗色表面
          colorBgBase: '#0f0f0f',
          colorBgContainer: '#1a1a2e',
          colorBgElevated: '#1e1e3a',
          colorBgLayout: '#0f0f0f',
          colorBgSpotlight: '#2a2a4a',

          // 文字
          colorText: '#e8e8f0',
          colorTextSecondary: '#a0a0b0',
          colorTextTertiary: '#707090',
          colorTextQuaternary: '#505068',

          // 边框
          colorBorder: '#2a2a4a',
          colorBorderSecondary: '#1e1e3a',

          // 字体
          fontFamily: "'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif",
        },
        components: {
          Card: {
            colorBgContainer: '#1a1a2e',
            colorBorderSecondary: '#2a2a4a',
          },
          Input: {
            colorBgContainer: '#141428',
            colorBorder: '#2a2a4a',
            activeBorderColor: '#6C5CE7',
            hoverBorderColor: '#5a4bd6',
          },
          Table: {
            colorBgContainer: '#1a1a2e',
            headerBg: '#141428',
            rowHoverBg: '#1e1e3a',
            borderColor: '#2a2a4a',
          },
          Modal: {
            contentBg: '#1a1a2e',
            headerBg: '#1a1a2e',
          },
          Drawer: {
            colorBgElevated: '#1a1a2e',
          },
          Select: {
            colorBgContainer: '#141428',
            colorBgElevated: '#1e1e3a',
            optionActiveBg: '#2a2a4a',
          },
          Button: {
            primaryShadow: '0 2px 8px rgba(108, 92, 231, 0.3)',
          },
          Menu: {
            darkItemBg: '#0f0f0f',
            darkSubMenuItemBg: '#141428',
          },
          Collapse: {
            headerBg: '#141428',
            contentBg: '#1a1a2e',
          },
          Tag: {
            defaultBg: '#1e1e3a',
            defaultColor: '#a0a0b0',
          },
        },
      }}
      locale={zhCN}
    >
      <AntdApp>
        <Router />
        <MountApi />
      </AntdApp>
    </ConfigProvider>
  )
}

function MountApi() {
  window.$app = AntdApp.useApp()

  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')
  const loadingCount = useRef(0)
  window.$showLoading = useCallback(({ title }: { title?: string } = {}) => {
    loadingCount.current++
    setLoading(true)
    setLoadingText(title ?? '')
  }, [])
  window.$hideLoading = useCallback(() => {
    loadingCount.current--
    setTimeout(() => {
      if (loadingCount.current <= 0) {
        setLoading(false)
        setLoadingText('')
      }
    }, 100)
  }, [])

  return (
    <>
      <Spin
        spinning={loading}
        tip={loadingText}
        fullscreen
        style={{
          zIndex: 9999999,
        }}
      ></Spin>
    </>
  )
}

export default App
