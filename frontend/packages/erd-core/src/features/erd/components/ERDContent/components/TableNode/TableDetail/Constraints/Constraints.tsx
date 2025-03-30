import type { Columns, Relationships } from '@liam-hq/db-structure'
import { Fingerprint, KeyRound, Link, Table2 } from '@liam-hq/ui'
import clsx from 'clsx'
import type { FC } from 'react'
import { CollapsibleHeader } from '../CollapsibleHeader'
import styles from './Constraints.module.css'

type Props = {
  tableName: string
  columns: Columns
  relations: Relationships
}

export const Constraints: FC<Props> = ({ tableName, columns, relations }) => {
  // NOTE: 17px is the height of one item in the list
  // 24px is the padding of the list
  // 1px is the border of the list
  // const contentMaxHeight = uniqueColumnsCount * 17 + 24 + 1
  const contentMaxHeight = 2000 // calc later
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
              <KeyRound className={styles.icon} />
            </div>
            <h3 className={styles.fieldDetailHeader}>Primary key</h3>
          </div>
        </div>
        <div className={styles.dlWrapper}>
          {Object.entries(columns).map(([key, column]) => {
            if (!column.primary) return null
            return (
              <dl key={key} className={styles.dl}>
                <div className={styles.tableHeader}>{column.name}</div>
                <div className={styles.dlItem}>
                  <dt className={styles.dt}>Column</dt>
                  <dd className={styles.dd}>{column.name}</dd>
                </div>
              </dl>
            )
          })}
        </div>

        <hr className={styles.hr} />

        <div className={styles.constraintContainer}>
          <div className={styles.fieldDetailHeader}>
            <div>
              <Link className={styles.icon} />
            </div>
            <h3 className={styles.fieldDetailHeader}>Foreign key</h3>
          </div>
        </div>
        <div className={styles.dlWrapper}>
          {Object.entries(relations).map(([key, relation]) => {
            if (relation.foreignTableName !== tableName) return null
            return (
              <dl key={key} className={styles.dl}>
                <div className={styles.tableHeader}>{key}</div>
                <div className={styles.dlItem}>
                  <dt className={styles.dt}>Column</dt>
                  <dd className={styles.dd}>{relation.foreignColumnName}</dd>
                </div>
                <div className={styles.dlItem}>
                  <dt className={styles.dt}>Target Table</dt>
                  <dd
                    className={clsx(
                      styles.dd,
                      styles.ddWithIcon,
                      styles.ddPrimary,
                    )}
                  >
                    <div className={styles.iconContainer}>
                      <Table2 />
                    </div>
                    {relation.primaryTableName}.{relation.primaryColumnName}
                  </dd>
                </div>
                <div className={styles.dlItem}>
                  <dt className={styles.dt}>On Update</dt>
                  <dd className={styles.dd}>{relation.updateConstraint}</dd>
                </div>
                <div className={styles.dlItem}>
                  <dt className={styles.dt}>On Delete</dt>
                  <dd className={styles.dd}>{relation.deleteConstraint}</dd>
                </div>
              </dl>
            )
          })}
        </div>
      </div>
    </CollapsibleHeader>
  )
}
