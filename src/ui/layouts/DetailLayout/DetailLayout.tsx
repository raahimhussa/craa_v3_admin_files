import { Box, Button, Typography } from 'src/ui/core/components'
import { Close, Save } from '@mui/icons-material'

import ButtonGroup from '@mui/material/ButtonGroup'
import { KeyedMutator } from 'swr'
import { RootStore } from 'src/stores/root'
import _ from 'lodash'
import { green } from '@mui/material/colors'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'

function DetailLayoutView({
  children,
  store,
  mutate,
  onClose,
  label,
}: {
  children: React.ReactNode
  store: RootStore[keyof RootStore]
  mutate?: KeyedMutator<any> | null
  label?: string
  onBeforeSave?: any
  isLabelVisible?: boolean
  onClose?: () => void
}) {
  const {
    uiState: { detailLayout, alert },
  } = useRootStore()
  const { enqueueSnackbar } = useSnackbar()

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: '386px',
      }}
    >
      <Box
        sx={{
          p: 1,
          color: 'white',
          display: 'flex',
          background: 'linear-gradient(135deg, #2c5c68, #0a304d) ',
        }}
      >
        <Typography lineHeight={2} variant="h5">
          {label ? label : _.upperCase(detailLayout.label)}
        </Typography>
        <ButtonGroup
          sx={{
            display: 'flex',
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Button
            color="error"
            size="small"
            sx={{
              width: 80,
              bgcolor: 'transparent',
              '&:hover': {
                bgcolor: 'rgb(255,255,255,0.1) !important',
              },
            }}
            variant="contained"
            onClick={() => {
              detailLayout.close()
              onClose && onClose()
            }}
          >
            {/* <Close /> */}
            Cancel
          </Button>
          <Button
            size="small"
            sx={{ width: 80 }}
            variant="contained"
            color="primary"
            onClick={async () => {
              try {
                await detailLayout.save(store, mutate)
                enqueueSnackbar('saved successfully', {
                  variant: 'success',
                })
              } catch (e) {
                enqueueSnackbar('save failed', {
                  variant: 'error',
                })
              }
              onClose && onClose()
            }}
          >
            {/* <Save /> */}
            Save
          </Button>
        </ButtonGroup>
      </Box>
      {children}
    </Box>
  )
}
export default observer(DetailLayoutView)
