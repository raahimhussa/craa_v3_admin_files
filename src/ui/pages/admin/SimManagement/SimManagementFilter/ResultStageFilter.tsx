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
import { UserSimulationStatus } from 'src/utils/status'

type Props = {
  resultStages: string[]
  handleChange: (event: any) => void
}

export const ResultStageFilter = (props: Props) => {
  const { resultStages, handleChange } = props

  return (
    <FormGroup>
      <InputLabel>Result Stages</InputLabel>
      <Box sx={{ mt: 1 }} />
      <FormControlLabel
        control={
          <Checkbox
            checked={resultStages.includes(UserSimulationStatus.Scoring)}
            name={UserSimulationStatus.Scoring}
            onChange={handleChange}
          />
        }
        label={UserSimulationStatus.Scoring}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={resultStages.includes(UserSimulationStatus.Adjudicating)}
            name={UserSimulationStatus.Adjudicating}
            onChange={handleChange}
          />
        }
        label={UserSimulationStatus.Adjudicating}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={resultStages.includes(UserSimulationStatus.Reviewed)}
            name={UserSimulationStatus.Reviewed}
            onChange={handleChange}
          />
        }
        label={UserSimulationStatus.Reviewed}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={resultStages.includes(UserSimulationStatus.Published)}
            name={UserSimulationStatus.Published}
            onChange={handleChange}
          />
        }
        label={UserSimulationStatus.Published}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={resultStages.includes(UserSimulationStatus.Exported)}
            name={UserSimulationStatus.Exported}
            onChange={handleChange}
          />
        }
        label={UserSimulationStatus.Exported}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={resultStages.includes(UserSimulationStatus.Distributed)}
            name={UserSimulationStatus.Distributed}
            onChange={handleChange}
          />
        }
        label={UserSimulationStatus.Distributed}
      />
    </FormGroup>
  )
}
