import React from 'react'
import Styles from './icon-styles.scss'
import thumbDown from '@/presentation/assets/icon-thumb-down.png'
import thumbUp from '@/presentation/assets/icon-thumb-up.png'

export const IconName = {
  thumbDown,
  thumbUp
}

type Props = {
  iconName: keyof typeof IconName
  className?: string
}

export const Icon: React.FC<Props> = ({ className, iconName }: Props) => {
  const iconColor = iconName === 'thumbDown' ? Styles.down : Styles.up

  return (
    <div className={[Styles.iconWrap, iconColor, className].join(' ')}>
      <img src={IconName[iconName]} role="icon" data-icon-name={iconName} />
    </div>
  )
}
