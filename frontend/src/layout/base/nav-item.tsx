
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'
import './nav-item.scss'

export function NavItem(props: {
  icon: string
  label: string
  href: string
  active?: boolean
  collapsed?: boolean
  dot?: boolean
  className?: string
  onClick?: () => void
}) {
  const { icon, label, href, active, collapsed, dot, className, onClick, ...rest } = props

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault()
      onClick()
    }
  }

  const content = (
    <Link
      className={classNames('base-layout-nav__item', className, {
        active,
        collapsed,
      })}
      to={href}
      onClick={handleClick}
      {...rest}
    >
      <img className="base-layout-nav__item-icon" src={icon} />
      {!collapsed && <span className="base-layout-nav__item-label">{label}</span>}

      {dot && <div className="base-layout-nav__item-dot" />}
    </Link>
  )

  // 收缩态用 Tooltip 显示标签
  if (collapsed) {
    return (
      <Tooltip title={label} placement="right" mouseEnterDelay={0.3}>
        {content}
      </Tooltip>
    )
  }

  return content
}
