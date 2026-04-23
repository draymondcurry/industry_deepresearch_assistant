
import IconBid from '@/assets/layout/bid.svg'
import IconHistory from '@/assets/layout/history.svg'
import IconHome from '@/assets/layout/home.svg'
import IconKnowledge from '@/assets/layout/knowledge.svg'
import IconMemory from '@/assets/layout/memory.svg'
import IconDatabase from '@/assets/layout/database.svg'
import IconNewChat from '@/assets/layout/newchat.svg'
import IconNews from '@/assets/layout/news.svg'
import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useSnapshot } from 'valtio'
import { Dropdown, message, Tooltip } from 'antd'
import { DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { NavItem } from './nav-item'
import { SessionDrawer } from '@/components/session-drawer'
import { industryState, setCurrentIndustry } from '@/store/industry'
import './nav.scss'

interface NavProps {
  collapsed: boolean
  onToggle: () => void
}

export function Nav({ collapsed, onToggle }: NavProps) {
  const { pathname } = useLocation()
  const [sessionDrawerOpen, setSessionDrawerOpen] = useState(false)
  const { currentIndustryId, industries } = useSnapshot(industryState)

  const currentIndustry = useMemo(() => {
    const industry = industries.find((i) => i.id === currentIndustryId)
    return industry || industries[0]
  }, [currentIndustryId, industries])

  const industryMenuItems = useMemo(() => {
    return industries.map((industry) => ({
      key: industry.id,
      label: (
        <div className="industry-menu-item">
          <div className="industry-menu-item__name">{industry.name}</div>
          <div className="industry-menu-item__desc">{industry.description}</div>
        </div>
      ),
      onClick: () => {
        setCurrentIndustry(industry.id)
      },
    }))
  }, [industries])

  const items = useMemo(
    () => [
      { key: 'home', label: '首页', icon: IconHome, href: '/' },
      { key: 'newchat', label: '新的聊天', icon: IconNewChat, href: '/chat' },
      { key: 'history', label: '对话历史', icon: IconHistory, href: '#', onClick: () => setSessionDrawerOpen(true) },
      { key: 'memory', label: '记忆库', icon: IconMemory, href: '#', onClick: () => message.info('暂未开放') },
      { key: 'knowledge', label: '知识库', icon: IconKnowledge, href: '/knowledge' },
      { key: 'database', label: '数据库', icon: IconDatabase, href: '/database' },
      { key: 'news', label: '行业资讯', icon: IconNews, href: '/news' },
      { key: 'bid', label: '招投标', icon: IconBid, href: '/bidding' },
    ],
    [],
  )

  return (
    <>
      {/* Logo 区域 */}
      <div className="nav-logo">
        {collapsed ? (
          <span className="nav-logo__mark">DR</span>
        ) : (
          <span className="nav-logo__text">DeepResearch</span>
        )}
      </div>

      {/* 行业选择器 */}
      <div className="industry-selector">
        <Dropdown
          menu={{ items: industryMenuItems }}
          trigger={['click']}
          placement="bottomLeft"
        >
          {collapsed ? (
            <Tooltip title={currentIndustry.name} placement="right">
              <div className="industry-selector__trigger industry-selector__trigger--collapsed">
                <span className="industry-selector__abbr">
                  {currentIndustry.name.charAt(0)}
                </span>
              </div>
            </Tooltip>
          ) : (
            <div className="industry-selector__trigger">
              <span className="industry-selector__label">{currentIndustry.name}</span>
              <DownOutlined className="industry-selector__icon" />
            </div>
          )}
        </Dropdown>
      </div>

      {/* 导航列表 */}
      <nav className="base-layout-nav">
        {items.map(({ key, onClick, ...item }) => (
          <NavItem
            key={key}
            {...item}
            active={pathname === item.href}
            collapsed={collapsed}
            onClick={onClick}
          />
        ))}
      </nav>

      {/* 折叠按钮 — 放在导航列表下方 */}
      <div className="nav-collapse-btn" onClick={onToggle}>
        {collapsed ? (
          <Tooltip title="展开侧边栏" placement="right">
            <MenuUnfoldOutlined />
          </Tooltip>
        ) : (
          <>
            <MenuFoldOutlined />
            <span className="nav-collapse-btn__text">收起</span>
          </>
        )}
      </div>

      <SessionDrawer
        open={sessionDrawerOpen}
        onClose={() => setSessionDrawerOpen(false)}
      />
    </>
  )
}
