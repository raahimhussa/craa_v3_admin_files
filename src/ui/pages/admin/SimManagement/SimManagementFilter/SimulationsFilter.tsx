import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material'
import React, { useState } from 'react'

import ClientUnit from 'src/models/clientUnit'
import Simulation from 'src/models/simulation'

type Props = {
  simulations: Simulation[]
  simulationIds: string[]
  handleChange: (event: any) => void
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      // width: 250,
    },
  },
}

export const SimulationsFilter = (props: Props) => {
  const { handleChange, simulations, simulationIds } = props

  return (
    <FormControl sx={{ m: 1 }}>
      <InputLabel id="demo-multiple-name-label">Simulations</InputLabel>
      <Select
        labelId="demo-multiple-checkbox-label"
        multiple
        value={simulationIds}
        onChange={handleChange}
        input={<OutlinedInput label="Tag" />}
        label={'client units'}
        sx={{
          width: '169px !important',
          backgroundColor: 'white',
          '.MuiSelect-select': {
            padding: '10px 20px 10px 10px !important',
          },
        }}
        renderValue={(selected) => {
          const title =
            simulations.find((_simulation) =>
              selected.includes(_simulation._id)
            )?.name || ''

          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                {title.length > 15 ? title.substring(0, 12) + '...' : title}
              </Box>
              <Box sx={{ ml: 2 }}>
                {selected.length > 1 ? <Box>+{selected.length - 1}</Box> : null}
              </Box>
            </Box>
          )
        }}
        MenuProps={MenuProps}
      >
        {simulations.map((_simulation) => (
          <MenuItem key={_simulation._id} value={_simulation._id}>
            <Checkbox
              checked={
                simulationIds.findIndex((item) => item === _simulation._id) >= 0
              }
            />
            <ListItemText primary={_simulation.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
