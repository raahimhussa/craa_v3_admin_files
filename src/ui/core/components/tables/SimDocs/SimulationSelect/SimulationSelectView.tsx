import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  Select,
  TextField,
} from '@mui/material'
import { ReactNode, useEffect } from 'react'

import FindingsTable from 'src/ui/core/components/tables/Findings/Findings'
import Loading from '@components/Loading/Loading'
import Simulation from 'src/models/simulation'
import User from 'src/models/user'
import _ from 'lodash'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useUser } from '@hooks'

type Props = {
  simulations: Simulation[]
  selectedSimulationId: string
  setSelectedSimulationId: any
  // selectedSimulation: any
  // setSelectedSimulation: any
}

function SimulationSelectView({
  simulations,
  selectedSimulationId,
  setSelectedSimulationId,
  // selectedSimulation,
  // setSelectedSimulation
}: Props) {
  const { data: user, isLoading } = useUser()

  // const _strigifiedSelectedSimulation = JSON.stringify(selectedSimulation)
  // console.log("SimulationSelectView::simulation1: ", _strigifiedSelectedSimulation)
  // console.log("SimulationSelectView::simulation11: ", JSON.parse(_strigifiedSelectedSimulation))
  useEffect(() => {
    if (isLoading) return
    const _selectedSimulationId = localStorage.getItem(
      'sid-' + (user as User)._id
    )
    setSelectedSimulationId(_selectedSimulationId)

    // const _strigifiedSelectedSimulation = localStorage.getItem(
    //   'sobj-' + (user as User)._id
    // )
    // if(_strigifiedSelectedSimulation !== null) {
    //   const _selectedSimulation = JSON.parse(_strigifiedSelectedSimulation)
    //   setSelectedSimulation(_selectedSimulation)
    //   console.log("SimulationSelectView::simulation2: ", _selectedSimulation)
    // }
  }, [])

  useEffect(() => {
    if (isLoading) return
    localStorage.setItem('sid-' + (user as User)._id, selectedSimulationId)
    
    // localStorage.setItem('sobj-' + (user as User)._id, JSON.stringify(selectedSimulation))
    // const _strigifiedSelectedSimulation = JSON.stringify(selectedSimulation)
    // localStorage.setItem('sobj-' + (user as User)._id, _strigifiedSelectedSimulation)

  }, [selectedSimulationId])

  const simulationOptions = [
    { label: 'all', id: '' },
    ...simulations
      .map((_simulation) => {
        return { label: _simulation.name, id: _simulation._id }
      })
      .sort((a, b) => (a.label > b.label ? 1 : -1)),
  ]

  return (
    <Autocomplete
      className="select"
      renderInput={(params) => (
        <TextField
          {...params}
          label="Simulation"
          sx={{ backgroundColor: 'white' }}
        />
      )}
      options={simulationOptions}
      onChange={(e, selectedOptions) => {
        setSelectedSimulationId(selectedOptions?.id)
      }}
      value={simulationOptions.find(
        (_simulationOption) => _simulationOption.id === selectedSimulationId
      )}
      // defaultValue={{ label: 'all', id: '' }}
      sx={{ width: 212 }}
      componentsProps={{
        paper: {
          sx: {
            width: 'max-content',
            // maxWidth: 360,
          },
        },
      }}
    />
  )
}
export default observer(SimulationSelectView)
