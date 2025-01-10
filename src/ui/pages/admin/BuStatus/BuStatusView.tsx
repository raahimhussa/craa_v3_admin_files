import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Chip,
  Typography,
} from '@mui/material'
import { CSVDownload, CSVLink } from 'react-csv'
import { useEffect, useState } from 'react'

import { AssessmentCycle } from 'src/models/assessmentCycle'
import AssessmentCycleGroup from './AssessmentCycleGroup/AssessmentCycleGroup'
import Box from '@mui/material/Box'
import { BusinessCycle } from 'src/models/clientUnit/clientUnit.interface'
import Button from '@mui/material/Button'
import ClientUnit from 'src/models/clientUnit'
import { Data } from 'react-csv/components/CommonPropTypes'
import Domain from 'src/models/domain'
import Stack from '@mui/material/Stack'
import axios from 'axios'
import { grey } from '@mui/material/colors'
import moment from 'moment'
import { observer } from 'mobx-react'

type BUStatusProps = {
  clientUnits: ClientUnit[]
  assessmentCycles: AssessmentCycle[]
  domains: Domain[]
}

function BuStatusView({
  clientUnits,
  assessmentCycles,
  domains,
}: BUStatusProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const [buttonMsg, setButtonMsg] = useState(
    'Please select Business Unit(s) to export'
  )
  const [csvData, setCsvData] = useState<{ [key: string]: any }[]>([])
  const [isFetching, setIsFetching] = useState<boolean>(true)

  const checkedItemHandler =
    (clientUnitId: string) =>
    (businessUnitId: string) =>
    (businessCycleId: string) =>
    (assessmentCycleId: string) =>
    (assessmentTypeId: string, isChecked: boolean) => {
      const id = `${clientUnitId}-${businessUnitId}-${businessCycleId}-${assessmentCycleId}-${assessmentTypeId}`
      if (isChecked) {
        setCheckedItems((prev) => [...prev, id])
      } else if (!isChecked) {
        setCheckedItems((prev) => [...prev].filter((_prev) => _prev !== id))
      }
    }

  useEffect(() => {
    if (checkedItems.length == 0) {
      setButtonMsg('Please select Business Unit(s) to export')
    } else {
      setButtonMsg('Export')
    }
  }, [checkedItems.length])

  const divStyle = {
    display: 'flex',
    marginLeft: '7%',
    marginTop: '0.5rem',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    // justifyContent: 'center',
    width: '100%',
  }

  const chipStyle = {
    fontWeight: 'bold',
    marginBottom: '1rem',
    minWidth: '140px',
  }

  const csvHeaders = [
    { label: 'Last Name', key: 'lastName' },
    { label: 'First Name', key: 'firstName' },
    { label: 'Email', key: 'email' },
    { label: 'Title', key: 'title' },
    { label: 'Vendor', key: 'vendor' },
    { label: 'Country', key: 'country' },
    { label: 'Baseline Simulation', key: 'baselineSimulation' },
    { label: 'last Login', key: 'lastLogin' },
    { label: 'Training Modules', key: 'trainingModules' },
    { label: 'Training Modules Remaining', key: 'trainingModulesRemaining' },
    {
      label: `Training - ${
        domains.find((_domain) => _domain.visibleId === 1)?.name
      }`,
      key: 'training1',
    },
    {
      label: `Training - ${
        domains.find((_domain) => _domain.visibleId === 2)?.name
      }`, // FIXME - Source Documentation, CRF, Source-to-CRF Review  => Source Data Verification (need to read domain name from db)
      key: 'training2',
    },
    {
      label: `Training - ${
        domains.find((_domain) => _domain.visibleId === 6)?.name
      }`,
      key: 'training3',
    },
    {
      label: `Training - ${
        domains.find((_domain) => _domain.visibleId === 8)?.name
      }`,
      key: 'training4',
    },
    {
      label: `Training - ${
        domains.find((_domain) => _domain.visibleId === 11)?.name
      }`,
      key: 'training5',
    },
    {
      label: 'Followup Simulations Assigned',
      key: 'followupSimulationsAssigned',
    },
    { label: 'Followup Sim Remaining', key: 'followupSimRemaining' },
    {
      label: `Training - ${
        domains.find((_domain) => _domain.visibleId === 1)?.name
      }`,
      key: 'followup1',
    },
    {
      label: `Training - ${
        domains.find((_domain) => _domain.visibleId === 2)?.name
      }`, // FIXME - Source Documentation, CRF, Source-to-CRF Review  => Source Data Verification (need to read domain name from db)
      key: 'followup2',
    },
    {
      label: `Training - ${
        domains.find((_domain) => _domain.visibleId === 6)?.name
      }`,
      key: 'followup3',
    },
    {
      label: `Training - ${
        domains.find((_domain) => _domain.visibleId === 8)?.name
      }`,
      key: 'followup4',
    },
    {
      label: `Training - ${
        domains.find((_domain) => _domain.visibleId === 11)?.name
      }`,
      key: 'followup5',
    },
    { label: 'All Modules completed', key: 'allModulesCompleted' },
    { label: 'Final Score', key: 'finalScore' },
    { label: 'Date Completed', key: 'dateCompleted' },
    { label: 'Unusual Behavior', key: 'unusualBehavior' },
    { label: 'Minimum Effort', key: 'minimumEffort' },
  ]

  return (
    <Box
      sx={{
        width: '90%',
        margin: '0 auto',
        mt: 3,
        overflowX: 'hidden',
      }}
    >
      <div style={divStyle}>
        <Button
          disabled={buttonMsg === 'Export' ? false : true}
          variant="contained"
          sx={{
            fontSize: '12px',
            mr: 5,
            width: '320px',
          }}
          onClick={async () => {
            setIsFetching(true)
            try {
              const data = (await axios.post('/v3/dataDump/butr', checkedItems))
                .data
              setCsvData(data)
              setIsFetching(false)
            } catch (e) {
              console.error(e)
            }
          }}
        >
          {buttonMsg}
        </Button>
        {!isFetching ? (
          <CSVDownload
            headers={csvHeaders}
            data={csvData}
            target="_blank"
            filename={`butr-status-${moment(new Date()).format(
              'DD-MMM-YYYY'
            )}.csv`}
          />
        ) : null}
      </div>
      <CardContent>
        <Card sx={{ p: 2, height: 'calc(100vh - 320px)', overflow: 'auto' }}>
          <Stack spacing={2}>
            {clientUnits.map((_clientUnit, index) => {
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
                      const isAllBusinessCyclesSelected =
                        _businessUnit.businessCycles.reduce(
                          (acc: boolean, cur: BusinessCycle) => {
                            const assessmentCycle = assessmentCycles.find(
                              (_assessmentCycle) =>
                                _assessmentCycle._id === cur.assessmentCycleId
                            )
                            const ret =
                              assessmentCycle?.assessmentTypeIds?.reduce(
                                (_acc, _assessmentTypeId) => {
                                  const id = `${_clientUnit._id}-${_businessUnit._id}-${cur._id}-${cur.assessmentCycleId}-${_assessmentTypeId}`
                                  if (checkedItems.includes(id))
                                    return _acc && true
                                  else return false
                                },
                                true
                              )
                            return ret ? ret && acc : false
                          },
                          true
                        )
                      const onClickAllBusinessUnit = (select: boolean) => {
                        const _assessmentCycles = assessmentCycles.filter(
                          (_assessmentCycle) =>
                            _businessUnit.businessCycles.find(
                              (_businessCycle) =>
                                _businessCycle.assessmentCycleId ===
                                _assessmentCycle._id
                            )
                        )
                        _assessmentCycles.forEach((_assessmentCycle) => {
                          const assessmentTypeIds =
                            _assessmentCycle.assessmentTypeIds
                          const businessCycle =
                            _businessUnit.businessCycles.find(
                              (_businessCycle) => {
                                return (
                                  _businessCycle.assessmentCycleId ===
                                  _assessmentCycle._id
                                )
                              }
                            )
                          if (!businessCycle) return
                          assessmentTypeIds.forEach((_assessmentTypeId) => {
                            checkedItemHandler(_clientUnit._id)(
                              _businessUnit._id
                            )(businessCycle._id)(
                              businessCycle.assessmentCycleId
                            )(_assessmentTypeId, select)
                          })
                        })
                      }
                      return (
                        <Accordion
                          key={`${_clientUnit._id}-${_businessUnit._id}`}
                        >
                          <AccordionSummary>
                            <Chip
                              label={_businessUnit.name}
                              sx={chipStyle}
                              color={
                                isAllBusinessCyclesSelected
                                  ? 'primary'
                                  : 'default'
                              }
                              onClick={() =>
                                onClickAllBusinessUnit(
                                  !isAllBusinessCyclesSelected
                                )
                              }
                            />
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
                                      clientUnitId={_clientUnit._id}
                                      businessUnitId={_businessUnit._id}
                                      businessCycleId={_businessCycle._id}
                                      checkedItems={checkedItems}
                                      checkedItemHandler={checkedItemHandler(
                                        _clientUnit._id
                                      )(_businessUnit._id)(_businessCycle._id)(
                                        _businessCycle.assessmentCycleId
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
      {/* {Object.keys(data).map((client, i) => {
        return (
          <div
            style={{
              marginTop: '1rem',
            }}
          >
            <Divider textAlign="left">{client}</Divider>
            {Object.keys(data[client]).map((bu, i2) => {
              return (
                <div style={divStyle}>
                  <CheckboxComp
                    bu={bu}
                    id={client + '_' + bu}
                    func={checkedItemHandler}
                    isAllChecked={isAllChecked}
                  />
                  <div style={{}}>
                    <AssessmentTypes
                      data={data[client][bu][0]['assessmentTypes']}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )
      })} */}
    </Box>
  )
}
export default observer(BuStatusView)
