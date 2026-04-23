
import classNames from 'classnames'
import { Drawer } from 'antd'
import { PropsWithChildren, ReactNode } from 'react'
import './index.scss'

export default function ComPageLayout(
  props: PropsWithChildren<{
    className?: string
    right?: ReactNode
    sender?: ReactNode
    wideRight?: boolean
    // 抽屉式面板
    rightPanelOpen?: boolean
    onRightPanelClose?: () => void
    onRightPanelReopen?: () => void
    rightPanelWidth?: number
    // 悬浮按钮
    showFloatingBtn?: boolean
  }>,
) {
  const {
    children,
    className,
    right,
    sender,
    wideRight,
    rightPanelOpen,
    onRightPanelClose,
    onRightPanelReopen,
    rightPanelWidth = 680,
    showFloatingBtn,
    ...rest
  } = props

  const useDrawerMode = rightPanelOpen !== undefined

  return (
    <div className={classNames('com-page-layout', className)} {...rest}>
      <div className="com-page-layout__main">
        <div className="com-page-layout__main-content">{children}</div>
        <div className="com-page-layout__sender">{sender}</div>
      </div>

      {useDrawerMode ? (
        <Drawer
          open={rightPanelOpen}
          onClose={onRightPanelClose}
          width={rightPanelWidth}
          placement="right"
          mask={false}
          destroyOnClose={false}
          rootClassName="research-drawer"
          closable={false}
          styles={{ body: { padding: 0 } }}
        >
          {right}
        </Drawer>
      ) : (
        right ? <div className="com-page-layout__right">{right}</div> : null
      )}

      {/* 悬浮重新打开按钮 — 独立于 children，直接挂在最外层 */}
      {showFloatingBtn && (
        <div className="floating-reopen-btn" onClick={onRightPanelReopen}>
          <span className="floating-reopen-btn__icon">📊</span>
          <span className="floating-reopen-btn__text">研究面板</span>
        </div>
      )}
    </div>
  )
}
