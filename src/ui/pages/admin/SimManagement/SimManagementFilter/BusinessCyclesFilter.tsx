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

import { AssessmentCycle } from 'src/models/assessmentCycle'
import { BusinessCycle } from 'src/models/clientUnit/clientUnit.interface'
import ClientUnit from 'src/models/clientUnit'

type Props = {
  clientUnits: ClientUnit[]
  clientUnitIds: string[]
  businessCycleIds: string[]
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

export const BusinessCyclesFilter = (props: Props) => {
  const { handleChange, clientUnits, clientUnitIds, businessCycleIds } = props

  return (
    <FormControl sx={{ m: 1 }}>
      <InputLabel id="demo-multiple-name-label">Assessment Cycles</InputLabel>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={businessCycleIds}
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

            _clientUnit.businessUnits.forEach((_businessUnit) => {
              if (title !== '') return
              const businessCycle = _businessUnit.businessCycles.find(
                (_businessCycle) =>
                  businessCycleIds.includes(_businessCycle._id)
              ) as
                | (BusinessCycle & { assessmentCycle: AssessmentCycle })
                | undefined
              if (businessCycle) {
                title = businessCycle.assessmentCycle.name
              }
            })
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

          return _clientUnit.businessUnits.map((_businessUnit) =>
            _businessUnit.businessCycles.map((_businessCycle) => {
              if (!clientUnitIds?.includes(_clientUnit._id)) {
                return null
              }
              return (
                <MenuItem key={_businessCycle._id} value={_businessCycle._id}>
                  <Checkbox
                    checked={
                      businessCycleIds.findIndex(
                        (item) => item === _businessCycle._id
                      ) >= 0
                    }
                  />
                  <ListItemText
                    primary={
                      (
                        _businessCycle as BusinessCycle & {
                          assessmentCycle: AssessmentCycle
                        }
                      ).assessmentCycle.name
                    }
                  />
                </MenuItem>
              )
            })
          )
        })}
      </Select>
    </FormControl>
  )
}
