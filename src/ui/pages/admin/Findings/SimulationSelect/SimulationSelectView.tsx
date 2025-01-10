import { Autocomplete, Box, TextField } from '@mui/material'

import FindingsTable from 'src/ui/core/components/tables/Findings/Findings'
import Loading from '@components/Loading/Loading'
import { ReactNode } from 'react'
import Simulation from 'src/models/simulation'
import _ from 'lodash'
import { observer } from 'mobx-react'

type Props = {
  simulations: Simulation[]
  setSelectedSimulationId: any
}

function SimulationSelectView({ simulations, setSelectedSimulationId }: Props) {
  const simulationOptions = [
    { label: 'all', id: undefined },
    ...simulations.map((_simulation) => {
      return { label: _simulation.name, id: _simulation._id }
    }),
  ]

  return (
    <Autocomplete
      renderInput={(params) => <TextField {...params} label="Simulation" />}
      options={simulationOptions}
      onChange={(e, selectedOptions) => {
        setSelectedSimulationId(selectedOptions?.id)
      }}
      defaultValue={{ label: 'all', id: '' }}
      sx={{ width: 300 }}
      componentsProps={{
        paper: {
          sx: {
            width: 'fit-content',
          },
        },
      }}
    />
  )
}
export default observer(SimulationSelectView)
