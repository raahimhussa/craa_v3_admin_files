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
import React, { useEffect, useState } from 'react'

import ClientUnit from 'src/models/clientUnit'
import axios from 'axios'

type Props = {
  vendors: ClientUnit[]
  setVendors: (clientUnits: ClientUnit[]) => void
  clientUnitIds: string[]
  vendorIds: string[]
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

export const VendorsFilter = (props: Props) => {
  const { clientUnitIds, vendorIds, handleChange, vendors, setVendors } = props

  useEffect(() => {
    handleChange({ target: { value: [] } })
    if (clientUnitIds.length === 1) {
      ;(async () => {
        const { data } = await axios.get(
          `v1/clientUnits/${clientUnitIds[0]}/vendor`
        )
        if (data) {
          setVendors(data)
        }
      })()
    } else {
      setVendors([])
    }
  }, [clientUnitIds.length])

  return (
    <FormControl sx={{ m: 1 }}>
      <InputLabel id="demo-multiple-name-label">Vendors</InputLabel>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={vendorIds}
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
            vendors.find((_vendors) => selected.includes(_vendors._id))?.name ||
            ''

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
        {vendors.map((_vendors) => (
          <MenuItem key={_vendors._id} value={_vendors._id}>
            <Checkbox
              checked={
                vendorIds.findIndex((item) => item === _vendors._id) >= 0
              }
            />
            <ListItemText primary={_vendors.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
