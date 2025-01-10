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
  assessmentCycle: AssessmentCycle
  onClickSelectDataDump: (
    assessmentCycleId: string,
    assessmentTypeId: string
  ) => void
}

const AssessmentCycleGroupView = ({
  assessmentCycle,
  onClickSelectDataDump,
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
                  onClickSelectDataDump={onClickSelectDataDump(
                    assessmentCycle._id,
                    assessmentTypeId
                  )}
                  assessmentTypeId={assessmentTypeId}
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
