import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

import { AssessmentCycle } from 'src/models/assessmentCycle'
import AssessmentType from 'src/models/assessmentType'
import SimulationGroups from '../SimulationGroups/SimulationGroups'
import _ from 'lodash'
import { observer } from 'mobx-react'

type Props = {
  checkedItems: string[]
  assessmentCycle: AssessmentCycle
  checkedItemHandler: (id: any, isChecked: boolean) => void
  clientUnitId: string
  businessUnitId: string
  businessCycleId: string
  assessmentCycleId: string
}

const AssessmentCycleGroupView = ({
  checkedItems,
  assessmentCycle,
  checkedItemHandler,
  clientUnitId,
  businessUnitId,
  businessCycleId,
  assessmentCycleId,
}: Props) => {
  if (!assessmentCycle) return null
  return (
    <Accordion>
      <AccordionSummary>
        <Typography variant="h6">{assessmentCycle.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box>
            {assessmentCycle.assessmentTypeIds.map((assessmentTypeId) => {
              return (
                <SimulationGroups
                  key={`${assessmentTypeId}`}
                  checkedItemHandler={checkedItemHandler}
                  assessmentTypeId={assessmentTypeId}
                  checkedItems={checkedItems}
                  clientUnitId={clientUnitId}
                  businessUnitId={businessUnitId}
                  businessCycleId={businessCycleId}
                  assessmentCycleId={assessmentCycleId}
                />
              )
            })}
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

export default observer(AssessmentCycleGroupView)
