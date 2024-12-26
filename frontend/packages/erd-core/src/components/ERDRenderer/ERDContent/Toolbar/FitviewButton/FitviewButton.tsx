import { toolbarActionLogEvent } from '@/features/gtm/utils'
import { useCliVersion } from '@/providers'
import { useUserEditingStore } from '@/stores'
import { IconButton, Scan } from '@liam-hq/ui'
import { ToolbarButton } from '@radix-ui/react-toolbar'
import { useReactFlow } from '@xyflow/react'
import { type FC, useCallback } from 'react'

export const FitviewButton: FC = () => {
  const { fitView } = useReactFlow()
  const { showMode } = useUserEditingStore()
  const { cliVersion } = useCliVersion()

  const handleClick = useCallback(() => {
    cliVersion.displayedOn === 'cli' &&
      toolbarActionLogEvent({
        element: 'fitview',
        showMode,
        cliVer: cliVersion.version,
        appEnv: cliVersion.envName,
      })
    fitView()
  }, [fitView, showMode, cliVersion])

  return (
    <ToolbarButton asChild onClick={handleClick}>
      <IconButton icon={<Scan />} tooltipContent="Zoom to Fit" />
    </ToolbarButton>
  )
}
