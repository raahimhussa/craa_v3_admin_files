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

type Props = {
  clientUnits: ClientUnit[]
  clientUnitIds: string[]
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

export const ClientUnitsFilter = (props: Props) => {
  const { clientUnits, clientUnitIds, handleChange } = props

  return (
    <FormControl sx={{ m: 1 }}>
      <InputLabel id="demo-multiple-name-label">Client Units</InputLabel>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={clientUnitIds}
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
            clientUnits.find((_clientUnit) =>
              selected.includes(_clientUnit._id)
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
        {clientUnits.map((_clientUnit) => (
          <MenuItem key={_clientUnit._id} value={_clientUnit._id}>
            <Checkbox
              checked={
                clientUnitIds.findIndex((item) => item === _clientUnit._id) >= 0
              }
            />
            <ListItemText primary={_clientUnit.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
