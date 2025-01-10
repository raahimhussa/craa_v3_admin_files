import {
  Autocomplete,
  Box,
  Select,
  Switch,
  TextField,
} from 'src/ui/core/components'
import {
  Button,
  Card,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Typography,
} from '@mui/material'

import DateTimePicker from '@components/DateTimePicker/DateTimePicker'
import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import Domain from 'src/models/domain'
import { GradeType } from 'src/utils/status'
import Iconify from 'src/ui/components/Iconify'
import Setting from 'src/models/setting'
import Stack from '@mui/material/Stack'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'

function BusinessUnitView(props: any) {
  const { countries, assessmentCycles, clientUnitsMutate } = props
  const {
    clientUnitStore,
    uiState: { clientUnits },
  } = useRootStore()
  const countryOptions = countries.map((country: any) => ({
    text: country.name,
    value: country._id,
  }))
  const assessmentCycleOptions = assessmentCycles.map(
    (assessmentCycle: any) => ({
      text: assessmentCycle.name,
      value: assessmentCycle._id,
    })
  )

  const gradeTypeOptions = Object.values(GradeType).map((gradeType) => ({
    text: gradeType,
    value: gradeType,
  }))

  const domains = props.domains as Domain[]
  const setting = props.setting as Setting

  return (
    <DetailLayout store={clientUnitStore}>
      <Box
        sx={{
          bgcolor: 'white',
          height: 'calc(100vh - 56px)',
          overflowY: 'auto',
        }}
      >
        <Stack spacing={2} sx={{ p: 2 }}>
          <Grid container sx={{ p: 2 }}>
            <Grid xs={12} md={6} lg={6} className="paper-grid">
              <InputLabel sx={{ mb: 0.5 }}>Name</InputLabel>
              <TextField
                state={clientUnitStore}
                path={`businessUnitForm.name`}
                // label="Name"
                size="small"
                variant="outlined"
              />
              <InputLabel sx={{ mb: 0.5, mt: 2 }}>BU-Country</InputLabel>
              <Autocomplete
                // label="BU-Country"
                state={clientUnitStore}
                options={countryOptions}
                path={`businessUnitForm.countryIds`}
              />
              <InputLabel sx={{ mb: 0.5, mt: 2 }}>
                Country-Permission
              </InputLabel>
              <Autocomplete
                // label="Country-Permission"
                state={clientUnitStore}
                options={countryOptions}
                path={`businessUnitForm.adminCountryIds`}
              />
            </Grid>
          </Grid>
          <Grid container sx={{ p: 2, mt: '0 !important' }}>
            <Grid xs={12}>
              <Grid item xs={12} sx={{ mb: 0 }}>
                <Box
                  sx={{
                    display: 'grid',
                    columnGap: 2,
                    rowGap: 2,
                    gridTemplateColumns: {
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(2, 1fr)',
                    },
                  }}
                >
                  {clientUnitStore.businessUnitForm.businessCycles.map(
                    (businessCycle, index) => (
                      <div className="paper-grid" key={Math.random()}>
                        <Grid item xs={12} sx={{ position: 'relative', mb: 1 }}>
                          <Box
                            sx={{
                              display: 'grid',
                              columnGap: 2,
                              rowGap: 2,
                              gridTemplateColumns: {
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(2, 1fr)',
                              },
                            }}
                          >
                            <Box>
                              <InputLabel sx={{ mb: 2 }}>
                                Business Unit Cycle
                              </InputLabel>
                              <Select
                                label="AssessmentCycle"
                                state={businessCycle}
                                options={assessmentCycleOptions}
                                path="assessmentCycleId"
                                className="select"
                              />
                            </Box>
                            <Box />
                            <Box>
                              <InputLabel sx={{ mb: 2 }}>
                                Screen Recording
                              </InputLabel>
                              <Switch
                                state={businessCycle}
                                path={'isScreenRecordingOn'}
                              />
                            </Box>
                            <Box>
                              <InputLabel sx={{ mb: 2 }}>Grade Type</InputLabel>
                              <Select
                                state={businessCycle}
                                options={gradeTypeOptions}
                                path="gradeType"
                              >
                                <MenuItem value={GradeType.Basic}>
                                  Basic
                                </MenuItem>
                                <MenuItem value={GradeType.Continuum}>
                                  Continuum
                                </MenuItem>
                              </Select>
                            </Box>
                            <Box>
                              <InputLabel sx={{ mb: 1 }}>start Date</InputLabel>
                              <DateTimePicker
                                state={businessCycle}
                                path="startDate"
                                // label="startDate"
                              />
                            </Box>
                            <Box>
                              <InputLabel sx={{ mb: 1 }}>
                                Expiration Date
                              </InputLabel>
                              <DateTimePicker
                                state={businessCycle}
                                path="endDate"
                                // label="ExpirationDate"
                              />
                            </Box>
                          </Box>
                          <Button
                            size="small"
                            color="error"
                            startIcon={
                              <Iconify
                                icon="eva:trash-2-outline"
                                sx={{ mt: -0.5 }}
                              />
                            }
                            onClick={() =>
                              clientUnitStore.removeBusinessCycle(index)
                            }
                            sx={{ position: 'absolute', right: 0, top: 0 }}
                          >
                            Remove
                          </Button>
                          {businessCycle.settingsByDomainIds?.map(
                            (settings) => {
                              return (
                                <Card
                                  sx={{
                                    p: 1,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderRadius: '2px',
                                    boxShadow: 'none',
                                  }}
                                >
                                  <Typography variant="body2">
                                    {domains.find(
                                      (_domain) =>
                                        _domain._id === settings.domainId
                                    )?.name || "Can't find domain"}
                                  </Typography>
                                  <TextField
                                    fullWidth={false}
                                    label="Min Score"
                                    state={settings}
                                    path="minScore"
                                  />
                                </Card>
                              )
                            }
                          )}
                        </Grid>
                      </div>
                    )
                  )}
                </Box>
              </Grid>

              <Divider sx={{ my: 1, borderStyle: 'dashed' }} />

              <Button
                size="small"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={async () => {
                  const scorerSettingDomain = setting.domains
                  clientUnitStore.addBusinessCycle(scorerSettingDomain)
                }}
                sx={{ flexShrink: 0 }}
              >
                Add new detail
              </Button>
              {/* </Card> */}
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </DetailLayout>
  )
}
export default observer(BusinessUnitView)
