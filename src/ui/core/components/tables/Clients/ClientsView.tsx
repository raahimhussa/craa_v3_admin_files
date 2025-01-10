import { Box } from '@mui/material'
import { ClientUnit } from 'src/models/clientUnit/clientUnit.interface'
import { ClientUnitsButtons } from './ClientUnitsButtons'
import ClientUnitsTable from './ClientUnitsTable'
import { observer } from 'mobx-react'

function ClientsView({
  clientUnits,
  clientUnitsMutate,
  countries,
}: {
  clientUnits: ClientUnit[]
  clientUnitsMutate: any
  countries: any[]
}) {
  return (
    <Box>
      <ClientUnitsButtons clientUnitsMutate={clientUnitsMutate} />
      <ClientUnitsTable
        clientUnits={clientUnits}
        clientUnitsMutate={clientUnitsMutate}
        countries={countries}
      />
    </Box>
  )
}
export default observer(ClientsView)
