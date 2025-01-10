import { AssessmentStatus, UserSimulationStatus } from 'src/utils/status'
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material'
import React, { useState } from 'react'

import ClientUnit from 'src/models/clientUnit'

type Props = {
  simStatuses: string[]
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

export const SimStatusFilter = (props: Props) => {
  const { simStatuses, handleChange } = props

  return (
    <FormGroup>
      <InputLabel>Sim Status</InputLabel>
      <Box sx={{ mt: 1 }} />
      <FormControlLabel
        control={
          <Checkbox
            checked={simStatuses.includes(UserSimulationStatus.Assigned)}
            name={UserSimulationStatus.Assigned}
            onChange={handleChange}
          />
        }
        label="Assigned"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={simStatuses.includes(UserSimulationStatus.InProgress)}
            name={UserSimulationStatus.InProgress}
            onChange={handleChange}
          />
        }
        label="In Progress"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={simStatuses.includes('Complete')}
            name={'Complete'}
            onChange={handleChange}
          />
        }
        label="Completed"
      />
    </FormGroup>
  )
}
