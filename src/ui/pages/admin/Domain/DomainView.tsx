import { Box, TextField } from 'src/ui/core/components'

import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import { InputLabel } from '@mui/material'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

function DomainView() {
  const {
    domainStore,
    uiState: { domains },
  } = useRootStore()
  return (
    <DetailLayout mutate={domains.mutate} store={domainStore}>
      <Box sx={{ p: 2, bgcolor: 'white' }}>
        <Box sx={{ marginBottom: '24px', maxWidth: '720px', width: '100%' }}>
          <TextField
            disabled
            label="ID"
            placeholder="ID"
            state={domainStore}
            path="form.visibleId"
            className="show"
          />
        </Box>
        <Box sx={{ maxWidth: '720px', width: '100%' }}>
          <TextField
            label="Domain Name"
            placeholder="Domain Name"
            state={domainStore}
            path="form.name"
            className="show"
          />
        </Box>
      </Box>
    </DetailLayout>
  )
}
export default observer(DomainView)
