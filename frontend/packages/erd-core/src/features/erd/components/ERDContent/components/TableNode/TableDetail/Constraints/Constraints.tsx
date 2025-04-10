import type { Constraints as ConstraintsType } from '@liam-hq/db-structure/dist/schema'
import type { PrimaryKeyConstraint } from '@liam-hq/db-structure/dist/schema/dbStructure'
import { FileText, KeyRound } from '@liam-hq/ui'
import type { FC } from 'react'
import { CollapsibleHeader } from '../CollapsibleHeader'
import styles from './Constraints.module.css'
import { PrimaryKeyConstraintsItem } from './PrimaryKeyConstraintsItem'

type Props = {
  constraints: ConstraintsType
}

export const Constraints: FC<Props> = ({ constraints }) => {
  const primaryKeyConstraint = Object.entries(constraints).filter(
    ([, { type }]) => type === 'PRIMARY KEY',
  )

  return (
    <CollapsibleHeader
      title="Constraints"
      icon={<FileText width={12} />}
      isContentVisible={false}
      // NOTE: Header height for Columns section:
      // 40px (content) + 1px (border) = 41px
      stickyTopHeight={41}
      contentMaxHeight={100000}
    >
      <div className={styles.wrapper}>
        {primaryKeyConstraint.length ? (
          <div className={styles.sectionWrapper}>
            <div className={styles.sectionTitle}>
              <KeyRound className={styles.primaryKeyIcon} />
              Primary key
            </div>
            {primaryKeyConstraint.map(([key, constraint]) => (
              <PrimaryKeyConstraintsItem
                key={key}
                primaryKeyConstraint={constraint as PrimaryKeyConstraint}
              />
            ))}
          </div>
        ) : null}
      </div>
    </CollapsibleHeader>
  )
}
