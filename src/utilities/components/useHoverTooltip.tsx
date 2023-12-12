import { useEffect } from 'react'
import ToolTipWithTitleAttribute from '../../components/molecules/Tooltip/TooltipWithTitleAttribute'

const useHoverTooltip = () => {
  useEffect(() => {
    ToolTipWithTitleAttribute()
  }, [])
}

export default useHoverTooltip
