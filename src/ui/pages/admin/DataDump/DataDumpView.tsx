import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  Stack,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

import { AssessmentCycle } from 'src/models/assessmentCycle'
import AssessmentCycleGroup from './AssessmentCycleGroup/AssessmentCycleGroup'
import BaselineResults from './BaselineResults/BaselineResults'
import ClientUnit from 'src/models/clientUnit'
import FollowupResults from './FollowupResults/FollowupResults'
import { SimulationType } from 'src/utils/status'
import _ from 'lodash'
import { grey } from '@mui/material/colors'
import { observer } from 'mobx-react'
import { useState } from 'react'

//FIXME - DEPRECATED: sales collections
type DataDumpProps = {
  clientUnits: ClientUnit[]
}

function DataDumpView({ clientUnits }: DataDumpProps) {
  // businessUnitId-assessmentTypeId-
  const [currentDataDump, setCurrentDataDump] = useState<{
    assessmentCycleId: string
    assessmentTypeId: string
    clientUnitId: string
    businessUnitId: string
    businessCycleId: string
    domainId: string
    simulationType: SimulationType
  }>({
    assessmentCycleId: '',
    assessmentTypeId: '',
    clientUnitId: '',
    businessUnitId: '',
    businessCycleId: '',
    domainId: '',
    simulationType: SimulationType.None,
  })

  const onClickSelectDataDump =
    (clientUnitId: string, businessUnitId: string, businessCycleId: string) =>
    (assessmentCycleId: string, assessmentTypeId: string) =>
    (simulationType: SimulationType, domainId: string) => {
      setCurrentDataDump({
        assessmentCycleId,
        assessmentTypeId,
        clientUnitId,
        businessUnitId,
        businessCycleId,
        domainId,
        simulationType,
      })
    }

  return (
    <Card sx={{ height: 'calc(100vh - 96px)', overflow: 'auto' }}>
      <CardHeader title="Data Dump"></CardHeader>
      {/* <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', pr: 3, alignItems: 'center' }}>
        <Typography variant='body1' sx={{ fontWeight: 700 }} >GroupByVendor</Typography>
        <Switch onChange={(e, checked) => { state.isGroupedByVendor = checked }} />
      </Box> */}
      <CardContent sx={{ maxHeight: '70vh', overflow: 'auto' }}>
        <Card sx={{ p: 2 }}>
          <Stack spacing={2}>
            {clientUnits
              .sort((a, b) => (a.name > b.name ? 1 : -1))
              .map((_clientUnit, index) => {
                return (
                  <Accordion key={_clientUnit._id}>
                    <AccordionSummary>
                      <Typography variant="h6">
                        {_clientUnit.name}
                        <Typography variant="body1" sx={{ color: grey[500] }}>
                          {/* {clientUnits.find((_clientUnits) => _clientUnits._id === clientUnitId)
                          ?.vendor?.name || 'company name'} */}
                          company name
                        </Typography>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {_clientUnit.businessUnits.map((_businessUnit) => {
                        return (
                          <Accordion
                            key={`${_clientUnit._id}-${_businessUnit._id}`}
                          >
                            <AccordionSummary>
                              <Typography>{_businessUnit.name}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Stack spacing={2}>
                                {_businessUnit.businessCycles.map(
                                  (_businessCycle) => {
                                    return (
                                      <AssessmentCycleGroup
                                        key={`${_clientUnit._id}-${_businessUnit._id}-${_businessCycle._id}`}
                                        assessmentCycleId={
                                          _businessCycle.assessmentCycleId
                                        }
                                        onClickSelectDataDump={onClickSelectDataDump(
                                          _clientUnit._id,
                                          _businessUnit._id,
                                          _businessCycle._id
                                        )}
                                      />
                                    )
                                  }
                                )}
                              </Stack>
                            </AccordionDetails>
                          </Accordion>
                        )
                      })}
                    </AccordionDetails>
                  </Accordion>
                )
              })}
          </Stack>
        </Card>
      </CardContent>

      <Card sx={{ m: 3 }}>
        <CardHeader title="DataDump" />
        <CardContent sx={{ width: '100%', overflow: 'auto' }}>
          {currentDataDump.simulationType === SimulationType.Baseline ? (
            <BaselineResults currentDataDump={currentDataDump} />
          ) : null}
          {currentDataDump.simulationType === SimulationType.Followup ? (
            <FollowupResults currentDataDump={currentDataDump} />
          ) : null}
        </CardContent>
      </Card>
    </Card>
  )
}
export default observer(DataDumpView)
