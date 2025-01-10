import { Box, useTheme } from '@mui/material'

import Assessment from '../Assessment'
import { observer } from 'mobx-react'

function AdjudicationView() {
  return (
    <Box sx={{ height: '100%' }}>
      <Assessment />
    </Box>
  )
}

export default observer(AdjudicationView)
