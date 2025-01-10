import {
  Box,
  Checkbox,
  Divider,
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
  businessUnitIds: string[]
  handleChange: (event: any) => void
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

export const BusinessUnitsFilter = (props: Props) => {
  const { handleChange, clientUnits, clientUnitIds, businessUnitIds } = props

  return (
    <FormControl sx={{ m: 1 }}>
      <InputLabel id="demo-multiple-name-label">Business Units</InputLabel>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={businessUnitIds}
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
          let title = ''
          clientUnits.forEach((_clientUnit) => {
            if (title !== '') return
            const businessUnit = _clientUnit.businessUnits.find(
              (_businessUnit) => businessUnitIds.includes(_businessUnit._id)
            )
            if (businessUnit) {
              title = businessUnit.name
            }
          })

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
        {clientUnits.map((_clientUnit) => {
          if (!clientUnitIds?.includes(_clientUnit._id)) {
            return null
          }

          return _clientUnit.businessUnits.map((_businessUnit, index) => (
            <MenuItem key={_businessUnit._id} value={_businessUnit._id}>
              <Checkbox
                checked={
                  businessUnitIds.findIndex(
                    (item) => item === _businessUnit._id
                  ) >= 0
                }
              />
              <ListItemText primary={_businessUnit.name} />
              {_clientUnit.businessUnits.length === index ? <Divider /> : null}
            </MenuItem>
          ))
        })}
      </Select>
    </FormControl>
  )
}
