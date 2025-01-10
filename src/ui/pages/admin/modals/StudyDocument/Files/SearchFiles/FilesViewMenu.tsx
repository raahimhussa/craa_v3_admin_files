import { CalendarViewMonth, ViewListOutlined } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import { observe, toJS } from 'mobx'

import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

function FilesViewMenu() {
  const {
    uiState: { pdfViewType },
  } = useRootStore()

  const handleClick = () => {
    if (pdfViewType.type === 'grid') {
      localStorage.setItem('pdf-view', 'list')
      pdfViewType.type = 'list'
    } else {
      localStorage.setItem('pdf-view', 'grid')
      pdfViewType.type = 'grid'
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mr: 2,
      }}
    >
      <Button onClick={handleClick}>
        {pdfViewType.type === 'grid' ? (
          <ViewListOutlined fontSize={'large'} />
        ) : (
          <CalendarViewMonth fontSize={'large'} />
        )}
      </Button>
    </Box>
  )
}

export default observer(FilesViewMenu)
