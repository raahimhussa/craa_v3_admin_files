import { CalendarViewMonth, ViewListOutlined, UploadFile, DriveFolderUpload } from '@mui/icons-material'
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

  const handleFileUploadClick = () => {
    // const inputElement = document.getElementById(`hidden-${uploadType}-input`);
    const inputElement = document.getElementById(`hidden-file-input`);
    if (inputElement) {
      inputElement.click();
    }
  };

  const handleFolderUploadClick = () => {
    // const inputElement = document.getElementById(`hidden-${uploadType}-input`);
    const inputElement = document.getElementById(`hidden-folder-input`);
    if (inputElement) {
      inputElement.click();
    }
  }; 

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mr: 2,
      }}
    >

    <Button 
      onClick={handleFileUploadClick} 
      startIcon={<UploadFile />} 
      variant='outlined' 
      sx={{
        padding: '1px 10px',
        borderColor: '#a9b7b8 !important', // Adjust to a dimmer color as needed
        ':hover': {
          borderColor: '#9bb1b1', // Optional: Adjust for a dimmer color on hover
        },
      }}>
      File Upload
    </Button>

    <Button 
      onClick={handleFolderUploadClick} 
      startIcon={<DriveFolderUpload />} 
      variant='outlined' 
      sx={{
        marginLeft: '10px',
        padding: '1px 10px',
        borderColor: '#a9b7b8 !important', // Adjust to a dimmer color as needed
        ':hover': {
          borderColor: '#9bb1b1', // Optional: Adjust for a dimmer color on hover
        },
      }}>
      Folder Upload
    </Button>

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
