import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Divider,
  TextField,
} from '@mui/material'
import {
  CheckCircleOutlined,
  CheckCircleSharp,
  Clear,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material'

import { FileMiniIcon } from '../FilesDropdown/FileGridIcon'
import _ from 'lodash'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import { useState } from 'react'

type Props = {
  searchString: string
  onChange: (e: any) => void
}

function UploadingPopupView({ searchString, onChange }: Props) {
  const {
    uiState: { uploading },
  } = useRootStore()

  const onCloseWindow = () => {
    uploading.clear()
    uploading.isVisible = false
  }

  const getTitle = () => {
    if (uploading.uploadFiles.length === 0) {
      return 'No Task'
    } else if (
      uploading.uploadFiles.filter((_uf) => !_uf.uploaded).length > 0
    ) {
      return `Uploading... ( ${
        uploading.uploadFiles.filter((_uf) => _uf.uploaded).length
      } / ${uploading.uploadFiles.length} )`
    } else {
      return 'Uploads Complete'
    }
  }

  if (!uploading.isVisible) return null

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        width: 350,
        border: '1px solid grey',
        borderRadius: 1,
        backgroundColor: 'white',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'black',
          // border: '1px solid black',
          color: 'white',
          borderRadius: '8px 8px 0px 0px',
        }}
      >
        <Box sx={{ mt: 2, mb: 2, ml: 2, maxWidth: 250, overflow: 'hidden' }}>
          {getTitle()}
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Button
            onClick={() => {
              uploading.isMinimized
                ? uploading.maximize()
                : uploading.minimize()
            }}
            sx={{
              minWidth: 0,
              mr: 1,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.5)' },
            }}
            size="small"
          >
            {uploading.isMinimized ? (
              <ExpandLess htmlColor={'#ffffff'} />
            ) : (
              <ExpandMore htmlColor={'#ffffff'} />
            )}
          </Button>
          <Button
            onClick={onCloseWindow}
            sx={{
              minWidth: 0,
              mr: 1,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.5)' },
            }}
            size="small"
          >
            <Clear htmlColor={'#ffffff'} />
          </Button>
        </Box>
      </Box>
      {uploading.isMinimized ? null : (
        <Box
          sx={{
            maxHeight: 300,
            overflow: 'auto',
          }}
        >
          {uploading.uploadFiles.map((_uploading) => {
            return (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: 1,
                  }}
                >
                  <Box sx={{ display: 'flex' }}>
                    <Box sx={{ ml: 1 }}>
                      <FileMiniIcon mimeType={_uploading.mimeType} />
                    </Box>
                    <Box
                      sx={{
                        ml: 2,
                        width: 240,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                      }}
                    >
                      {_uploading.fileName}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      mr: 2,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {_uploading.uploaded ? (
                      <CheckCircleSharp htmlColor="#34a853" fontSize="medium" />
                    ) : (
                      <CircularProgress size={20} />
                    )}
                  </Box>
                </Box>
                <Divider />
              </>
            )
          })}
        </Box>
      )}
    </Box>
  )
}
export default observer(UploadingPopupView)
