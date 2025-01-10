import {
  Box,
  Button,
  Checkbox,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import { useEffect, useState } from 'react'

import AssessmentType from 'src/models/assessmentType'
import _ from 'lodash'
import { observer } from 'mobx-react'

type Props = {
  checkedItems: string[]
  checkedItemHandler: (id: any, isChecked?: boolean) => void
  assessmentType: AssessmentType
  clientUnitId: string
  businessUnitId: string
  businessCycleId: string
  assessmentCycleId: string
}

const SimulationGroupsView = ({
  checkedItems,
  checkedItemHandler,
  assessmentType,
  clientUnitId,
  businessUnitId,
  businessCycleId,
  assessmentCycleId,
}: Props) => {
  const chipStyle = {
    fontWeight: 'bold',
    marginBottom: '1rem',
    minWidth: '140px',
  }

  const id = `${clientUnitId}-${businessUnitId}-${businessCycleId}-${assessmentCycleId}-${assessmentType._id}`

  const onClickChip = () => {
    checkedItemHandler(assessmentType._id, !!!checkedItems.includes(id))
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Chip
        label={assessmentType.label}
        sx={chipStyle}
        color={checkedItems.includes(id) ? 'primary' : 'default'}
        onClick={onClickChip}
      />
    </Box>
  )
}

export default observer(SimulationGroupsView)
