import { Select, TextField } from 'src/ui/core/components'

import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import IDomain from 'src/models/domain/domain.interface'
import { Box, Card, Grid, InputLabel, Stack } from '@mui/material'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'

function KeyConceptView(props: any) {
  const {
    domains,
    selectedDomainId,
  }: {
    domains: IDomain[]
    selectedDomainId?: string
  } = props
  const {
    keyConceptStore,
    uiState: { keyConcepts },
  } = useRootStore()

  const domainOptions = domains.map((domain) => ({
    text: domain.name,
    value: domain._id,
  }))

  return (
    <DetailLayout store={keyConceptStore} mutate={keyConcepts.mutate}>
      <Box sx={{ bgcolor: 'rgb(242, 243, 243)' }}>
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12} md={6} lg={6}>
            <Card className="paper-grid" sx={{ p: 0 }}>
              <Stack spacing={1} sx={{ p: 2 }}>
                <InputLabel>Description</InputLabel>
                <TextField
                  // label="Description"
                  state={keyConceptStore}
                  path="form.description"
                  variant="outlined"
                />
                <InputLabel>Domain</InputLabel>
                <Select
                  // label="Domain"
                  options={domainOptions}
                  state={keyConceptStore}
                  path="form.domainId"
                  defaultValue={selectedDomainId}
                  disabled={selectedDomainId ? true : false}
                />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DetailLayout>
  )
}
export default observer(KeyConceptView)
