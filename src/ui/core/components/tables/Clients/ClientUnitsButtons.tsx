import { Box, Button } from '@mui/material'

import Client from 'src/ui/pages/admin/Client/Client'
import { Search } from '@mui/icons-material'
import { UpdateType } from 'src/stores/clientUnitStore'
import { useRootStore } from 'src/stores'

type Props = {
  clientUnitsMutate: any
}

export const ClientUnitsButtons = ({ clientUnitsMutate }: Props) => {
  const {
    clientUnitStore,
    uiState: { modal },
  } = useRootStore()

  const onClickAdd = () => {
    clientUnitStore.resetForm()
    clientUnitStore.resetBusinessUnitForm()
    clientUnitStore.resetBusinessCycleForm()
    clientUnitStore.updateType = UpdateType.ClientUnit
    modal.open('Client', <Client mutate={clientUnitsMutate} />)
  }

  const onClickDelete = () => {}

  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, mb: 1 }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          // justifyContent: 'center',
          alignItems: 'center',
          width: 376,
          height: 36,
          backgroundColor: 'white',
        }}
      >
        <Box sx={{ position: 'absolute', left: 8, top: 6 }}>
          <Search />
        </Box>
        <input
          style={{
            height: '100%',
            width: '100%',
            paddingLeft: 40,
            borderRadius: 7,
          }}
        />
      </Box>
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
