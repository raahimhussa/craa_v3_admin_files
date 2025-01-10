import { Box, Tooltip } from '@mui/material'
import { Error, ErrorOutline } from '@mui/icons-material'

import React from 'react'

export const Required = () => {
  return (
    <Box
      sx={{
        ml: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Tooltip title="This content is required.">
        <ErrorOutline fontSize="small" />
      </Tooltip>
    </Box>
  )
}
