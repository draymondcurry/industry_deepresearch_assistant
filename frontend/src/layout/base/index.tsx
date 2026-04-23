
import { useState, useCallback, useEffect } from 'react'
import classNames from 'classnames'
import { Footer } from './footer'
import './index.scss'
import { Nav } from './nav'

const STORAGE_KEY = 'sidebar-collapsed'

function getInitialCollapsed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function BaseLayout({ children }: { children?: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(getInitialCollapsed)

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev
      try { localStorage.setItem(STORAGE_KEY, String(next)) } catch {}
      return next
    })
  }, [])

  // 窄屏自动折叠
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1280px)')
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setCollapsed(true)
        try { localStorage.setItem(STORAGE_KEY, 'true') } catch {}
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <div className={classNames('base-layout', { 'sidebar-collapsed': collapsed })}>
      <aside className="base-layout__sidebar">
        <div className="base-layout__sidebar-main scrollbar-style">
          <Nav collapsed={collapsed} onToggle={toggleCollapsed} />
        </div>
        <Footer collapsed={collapsed} />
      </aside>

      <main className="base-layout__content">{children}</main>
    </div>
  )
}
