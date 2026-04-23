
import IconSearch from '@/assets/index/search.svg'
import { Input, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { INDUSTRY_CONFIGS, setCurrentIndustry } from '@/store/industry'
import styles from './index.module.scss'

// 行业卡片 — 暗色主题配色 (渐变 accent)
const INDUSTRY_COLORS: Record<string, { accent: string; glowColor: string }> = {
  smart_transportation: { accent: '#4fc3f7', glowColor: 'rgba(79, 195, 247, 0.15)' },
  finance: { accent: '#6C5CE7', glowColor: 'rgba(108, 92, 231, 0.15)' },
  healthcare: { accent: '#66bb6a', glowColor: 'rgba(102, 187, 106, 0.15)' },
  energy: { accent: '#ffa726', glowColor: 'rgba(255, 167, 38, 0.15)' },
}

// 行业图标 emoji（简洁科技感）
const INDUSTRY_ICONS: Record<string, string> = {
  smart_transportation: '🚀',
  finance: '📊',
  healthcare: '🧬',
  energy: '⚡',
}

export default function Index() {
  const navigate = useNavigate()
  const [searchKeyword, setSearchKeyword] = useState('')

  const cardList = useMemo(
    () =>
      INDUSTRY_CONFIGS.map((industry) => ({
        id: industry.id,
        title: `${industry.name}行业`,
        icon: INDUSTRY_ICONS[industry.id] || '🔍',
        desc: industry.description,
        accent: INDUSTRY_COLORS[industry.id]?.accent || '#6C5CE7',
        glowColor: INDUSTRY_COLORS[industry.id]?.glowColor || 'rgba(108, 92, 231, 0.15)',
      })),
    [],
  )

  // 根据搜索关键词过滤卡片
  const filteredCardList = useMemo(() => {
    if (!searchKeyword.trim()) return cardList
    const keyword = searchKeyword.toLowerCase()
    return cardList.filter(
      (item) =>
        item.title.toLowerCase().includes(keyword) ||
        item.desc.toLowerCase().includes(keyword)
    )
  }, [cardList, searchKeyword])

  // 点击卡片，切换行业并跳转到聊天页
  const handleCardClick = (industryId: string, title: string) => {
    console.log('[Index] 点击行业卡片:', industryId, title)
    setCurrentIndustry(industryId)
    navigate(`/chat?title=${encodeURIComponent(title)}`)
  }

  return (
    <div className={styles['index-page']}>
      {/* 顶部品牌区 */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles['title-gradient']}>DeepResearch</span>
        </h1>
        <div className={styles.desc}>
          AI 驱动的行业研究助手 — 深度搜索、数据分析、智能报告
        </div>
      </div>

      {/* 搜索栏 */}
      <div className={styles['search-bar']}>
        <div className={styles['switch']}>
          <div onClick={() => message.info('暂未开放')} style={{ cursor: 'pointer' }}>我的</div>
          <div className={styles.active}>市场</div>
        </div>

        <div className={styles['search-bar__input']}>
          <Input
            prefix={<SearchOutlined style={{ color: '#707090', fontSize: 16 }} />}
            placeholder="搜索应用"
            size="large"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            allowClear
          />
        </div>
      </div>

      {/* 行业卡片列表 */}
      <div className={styles['card-list']}>
        {filteredCardList.length === 0 ? (
          <div className={styles['empty-hint']}>
            未找到匹配的应用
          </div>
        ) : filteredCardList.map((item) => (
          <div
            className={styles['card-item']}
            key={item.id}
            style={{
              '--card-accent': item.accent,
              '--card-glow': item.glowColor,
            } as React.CSSProperties}
            onClick={() => handleCardClick(item.id, item.title)}
          >
            <div className={styles['card-item__icon']}>
              <span>{item.icon}</span>
            </div>

            <div className={styles['card-item__title']}>{item.title}</div>
            <div className={styles['card-item__desc']}>{item.desc}</div>

            <div className={styles['card-item__arrow']}>→</div>
          </div>
        ))}
      </div>
    </div>
  )
}
