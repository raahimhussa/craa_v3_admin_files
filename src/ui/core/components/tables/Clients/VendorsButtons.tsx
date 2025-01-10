import { Box, Button } from '@mui/material'

import Client from 'src/ui/pages/admin/Client/Client'
import { Search } from '@mui/icons-material'
import { UpdateType } from 'src/stores/clientUnitStore'
import Vendor from 'src/ui/pages/admin/Vendor/Vendor'
import { useRootStore } from 'src/stores'

export const VendorsButtons = ({
  vendor,
  mutate,
}: {
  vendor: string
  mutate: any
}) => {
  const {
    clientUnitStore,
    uiState: { modal },
  } = useRootStore()

  const onClickAdd = () => {
    clientUnitStore.resetForm()
    clientUnitStore.resetBusinessUnitForm()
    clientUnitStore.resetBusinessCycleForm()
    clientUnitStore.updateType = UpdateType.ClientUnit
    if (vendor) clientUnitStore.form.vendor = vendor
    modal.open('Vendor', <Vendor mutate={mutate} />)
  }

  const onClickDelete = () => {}

  return (
    <Box sx={{ display: 'flex', justifyContent: 'end', mt: 1, mb: 1 }}>
      <Box sx={{ display: 'flex', mr: 1 }}>
        <Button
          onClick={onClickAdd}
          variant="contained"
          sx={{ ml: 1, width: 72 }}
        >
          Add
        </Button>
        <Button
          onClick={onClickDelete}
          variant="contained"
          sx={{ ml: 1, width: 72 }}
        >
          Delete
        </Button>
      </Box>
    </Box>
  )
}
