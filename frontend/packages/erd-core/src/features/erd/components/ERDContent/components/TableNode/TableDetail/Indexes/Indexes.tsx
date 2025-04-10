import type { Indexes as IndexesType } from '@liam-hq/db-structure'
import { FileText } from '@liam-hq/ui'
import type { FC } from 'react'
import { CollapsibleHeader } from '../CollapsibleHeader'
import { IndexesItem } from './IndexesItem'

type Props = {
  indexes: IndexesType
}

export const Indexes: FC<Props> = ({ indexes }) => {
  const contentMaxHeight = Object.keys(indexes).length * 400

  return (
    <CollapsibleHeader
      title="Indexes #"
      icon={<FileText width={12} />}
      isContentVisible={true}
      // NOTE: Header height for Columns section:
      // 40px (content) + 1px (border) = 41px
      stickyTopHeight={82}
      contentMaxHeight={contentMaxHeight}
    >
      {Object.entries(indexes).map(([key, index]) => (
        <IndexesItem key={key} index={index} />
      ))}
    </CollapsibleHeader>
  )
}
