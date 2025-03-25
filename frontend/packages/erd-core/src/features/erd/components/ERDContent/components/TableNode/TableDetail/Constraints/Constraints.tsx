import type { Columns } from '@liam-hq/db-structure'
import { Fingerprint, KeyRound } from '@liam-hq/ui'
import type { FC } from 'react'
import { CollapsibleHeader } from '../CollapsibleHeader'
import styles from './Constraints.module.css'

type Props = {
  columns: Columns
}

export const Constraints: FC<Props> = ({ columns }) => {
  // NOTE: 17px is the height of one item in the list
  // 24px is the padding of the list
  // 1px is the border of the list
  // const contentMaxHeight = uniqueColumnsCount * 17 + 24 + 1
  const contentMaxHeight = 300 // calc later
  return (
    <CollapsibleHeader
      title="Constraints"
      icon={<Fingerprint width={12} />}
      isContentVisible={true}
      // NOTE: Header height for Columns/Indices sections:
      // (40px (content) + 1px (borders)) * 2 = 82px
      stickyTopHeight={82}
      contentMaxHeight={contentMaxHeight}
    >
      <div className={styles.constraintsGrid}>
        <div className={styles.constraintContainer}>
          <div className={styles.fieldDetailHeader}>
            <div>
              <KeyRound className={styles.iconContainer} />
            </div>
            <div className={styles.fieldDetailHeader}>Primary key</div>
          </div>
        </div>
        <ul>
          {Object.entries(columns).map(([key, column]) => {
            if (!column.primary) return null
            return (
              <li key={key} className={styles.fieldDetailComment}>
                <div className={styles.gridHeader}>{column.name}</div>
              </li>
            )
          })}
        </ul>
      </div>
    </CollapsibleHeader>
  )
}
