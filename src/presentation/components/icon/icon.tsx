import React from 'react'
import Styles from './icon-styles.scss'

const IconName = {
  thumbDown: require('@/presentation/assets/icon-thumb-down.png'),
  thumbUp: require('@/presentation/assets/icon-thumb-up.png')
}

type Props = {
  iconName: keyof typeof IconName
  className?: string
}

export const Icon: React.FC<Props> = ({ className, iconName }: Props) => {
  const iconColor = iconName === 'thumbDown' ? Styles.down : Styles.up

  return (
    <div className={[Styles.iconWrap, iconColor, className].join(' ')}>
      <img src={IconName[iconName].default} />
    </div>
  )
}
