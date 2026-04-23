
import { authActions, authState } from '@/store/auth'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, message, Tooltip } from 'antd'
import type { MenuProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useSnapshot } from 'valtio'
import './footer.scss'

interface FooterProps {
  collapsed?: boolean
}

export function Footer({ collapsed }: FooterProps) {
  const navigate = useNavigate()
  const { user } = useSnapshot(authState)

  const handleLogout = () => {
    authActions.logout()
    message.success('已退出登录')
    navigate('/login')
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <div className="user-menu-info">
          <div className="user-menu-name">{user?.username || '用户'}</div>
          <div className="user-menu-email">{user?.email || ''}</div>
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
      danger: true,
    },
  ]

  const getAvatarText = () => {
    if (user?.username) {
      return user.username.charAt(0).toUpperCase()
    }
    return 'U'
  }

  const avatarEl = (
    <Avatar
      size={collapsed ? 32 : 34}
      icon={<UserOutlined />}
      className="user-avatar"
    >
      {getAvatarText()}
    </Avatar>
  )

  return (
    <div className="base-layout-footer">
      <Dropdown
        menu={{ items: menuItems }}
        placement="topRight"
        trigger={['click']}
        overlayClassName="user-dropdown-overlay"
      >
        <div className="user-avatar-wrapper">
          {collapsed ? (
            <Tooltip title={user?.username || '用户'} placement="right">
              {avatarEl}
            </Tooltip>
          ) : (
            <div className="user-info-row">
              {avatarEl}
              <div className="user-info-text">
                <div className="user-info-name">{user?.username || '用户'}</div>
              </div>
            </div>
          )}
        </div>
      </Dropdown>
    </div>
  )
}
