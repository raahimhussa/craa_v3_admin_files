import {
  AccessTimeOutlined,
  Add,
  CreateOutlined,
  PersonOutlineOutlined,
} from '@mui/icons-material'
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { AnswerStatus, UserSimulationStatus } from 'src/utils/status'
import { Checkbox, Spacer } from '@components'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary'
import { blue, green, grey, orange, yellow } from '@mui/material/colors'
import { observer, useLocalObservable } from 'mobx-react'

import { ApexOptions } from 'apexcharts'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { FindingSeverity } from 'src/models/finding/finding.interface'
import IAnswer from 'src/models/answer/answer.interface'
import { IAssessment } from 'src/models/assessment/assessment.interface'
import IDomain from 'src/models/domain/domain.interface'
import { INote } from 'src/models/note/note.interface'
import IUser from 'src/models/user/user.interface'
import LocalUser from 'src/models/user/user.interface'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import ReactApexChart from 'react-apexcharts'
import Timeline from '@components/Charts/Timeline/Timeline'
import UserAssessmentCycle from 'src/models/userAssessmentCycle'
import UserSimulation from 'src/models/userSimulation'
import { Utils } from '@utils'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import moment from 'moment'
import { styled } from '@mui/material/styles'
import { useRootStore } from 'src/stores'
import { useState } from 'react'
import { withFind } from '@hocs'

export type EnhancedAssessment = IAssessment & LocalAssessment

type ReportingViewProps = {
  assessments: EnhancedAssessment[]
  userSimulations: UserSimulation[]
  domains: IDomain[]
  user: IUser
}

interface LocalAssessment {
  userAssessmentCycle: UserAssessmentCycle & {
    userSimulation: UserSimulation
  }
  userSimulation: UserSimulation
  answers: (IAnswer & { domain: IDomain; note: INote })[]
  note: INote
}

function SimCardView(props: ReportingViewProps) {
  const { assessments, domains, user } = props

  const {
    uiState: { modal },
    uiState,
  } = useRootStore()

  const {
    windowDimensions: { height },
  } = uiState

  if (assessments.length === 0) return null

  // USER AC개념이 들어오면서 유저당 여러번의 Baseline을 할 수 있습니다. 일단은 하나만 이용
  const assessment = assessments[0]
  //FIXME - DEPRECATED: sales collection
  const {
    userAssessmentCycle: {
      sale: { services },
    },
  } = assessment

  // @ts-ignore
  const service = services.find(
    (service: any) =>
      service.assessmentCycle._id ===
      assessment.userAssessmentCycle.assessmentCycleId
  )

  // const user: LocalUser & IUser = _.cloneDeep(modal.payload.user)

  return (
    <Box>
      <Paper>
        <Spacer spacing={2} />
        {/* <Grid item xs={3}>
            <Box sx={{ overflow: 'scroll', height: height, pb: 100 }}>
              <UserCard user={user} domains={domains} assessment={assessment} />
            </Box>
          </Grid> */}
        <Box sx={{ overflow: 'scroll', height: height, px: 7, pb: 100 }}>
          <Stack>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Button sx={{ mr: 1 }}>Export</Button>
              <Button>Export with Notes</Button>
            </div>
            <UserCard user={user} domains={domains} assessment={assessment} />
            <Card variant="outlined" sx={{ width: '50%', mb: 2 }}>
              <CardHeader title="Folders" />
              <CardContent>
                <StatusSummary assessment={assessment} service={service} />
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardHeader title="Charts" />
              <CardContent>
                <Timeline />
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}

export default observer(SimCardView)

type UserCardProps = {
  user: IUser & LocalUser
  info?: boolean
  assessment?: EnhancedAssessment
  domains: IDomain[]
}

const UserCard = observer((props: UserCardProps) => {
  const { user, info, assessment, domains } = props
  const options: ApexOptions = {
    chart: {
      type: 'boxPlot',
      height: 350,
    },
    title: {
      text: 'Basic BoxPlot Chart',
      align: 'left',
    },
    plotOptions: {
      boxPlot: {
        colors: {
          upper: '#5C4742',
          lower: '#A5978B',
        },
      },
    },
  }

  const usage =
    assessment &&
    Utils.convert(
      assessment.userAssessmentCycle.userSimulation.usageTime,
      'astr'
    )

  const series = [
    {
      type: 'boxPlot',
      data: [
        {
          x: 'Jan 2015',
          y: [54, 66, 69, 75, 88],
        },
        {
          x: 'Jan 2016',
          y: [43, 65, 69, 76, 81],
        },
        {
          x: 'Jan 2017',
          y: [31, 39, 45, 51, 59],
        },
        {
          x: 'Jan 2018',
          y: [39, 46, 55, 65, 71],
        },
        {
          x: 'Jan 2019',
          y: [29, 31, 35, 39, 44],
        },
        {
          x: 'Jan 2020',
          y: [41, 49, 58, 61, 67],
        },
        {
          x: 'Jan 2021',
          y: [54, 59, 66, 71, 88],
        },
      ],
    },
  ]

  if (info) {
    return (
      <Stack spacing={3} sx={{ mb: 2 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              User Info
            </Typography>
            <Typography variant="body1">Name</Typography>
            <Typography
              color="text.secondary"
              component={'span'}
              variant="caption"
              gutterBottom
            >
              {_.upperFirst(user.profile?.status) || 'Inactive'} Status Status
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Chip clickable color="info" label={user.email || 'unknown'} />
            </Box>
          </CardContent>
        </Card>
      </Stack>
    )
  }
  return (
    <Stack sx={{ mb: 2 }}>
      <Card sx={{ width: '400px' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            User Info
          </Typography>
          <div
            style={{
              display: 'flex',
              alignItems: 'center ',
              marginTop: '1.5rem',
            }}
          >
            <PersonOutlineOutlined
              color="primary"
              sx={{ fontSize: '1.2rem', marginRight: '0.2rem' }}
            />
            <Typography variant="subtitle2" sx={{ width: '137px' }}>
              Name
            </Typography>
            <Typography variant="body2">xxnssae drhdhsw</Typography>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center ',
              marginTop: '0.5rem',
            }}
          >
            <CreateOutlined
              color="primary"
              sx={{ fontSize: '1.2rem', marginRight: '0.2rem' }}
            />
            <Typography variant="subtitle2" sx={{ width: '137px' }}>
              Simulation
            </Typography>
            <Typography variant="body2">Followup 4-OA-Global-1</Typography>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center ',
              marginTop: '0.5rem',
            }}
          >
            <AccessTimeOutlined
              color="primary"
              sx={{ fontSize: '1.2rem', marginRight: '0.2rem' }}
            />
            <Typography variant="subtitle2" sx={{ width: '137px' }}>
              Time to Complete
            </Typography>
            <Typography variant="body2">01:20:40 / 04:00:00</Typography>
          </div>
        </CardContent>
      </Card>
    </Stack>
  )
})

type StatusSummaryProps = {
  assessment: EnhancedAssessment
  service?: any
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}))

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}))

const StatusSummary = observer((props: StatusSummaryProps) => {
  const { assessment, service } = props
  const [expanded, setExpanded] = useState<string | false>('')

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false)
    }
  let color: string = grey[500]

  switch (assessment.userAssessmentCycle.userSimulation?.status) {
    case UserSimulationStatus.Pending ||
      UserSimulationStatus.Scoring ||
      UserSimulationStatus.Adjudicating ||
      UserSimulationStatus.Published ||
      UserSimulationStatus.Distributed ||
      UserSimulationStatus.Reviewed ||
      UserSimulationStatus.Exported:
      color = green[500]
      break
    case UserSimulationStatus.InProgress:
      color = yellow[500]
      break
    case UserSimulationStatus.Assigned:
      color = yellow[500]
      break
    default:
      break
  }

  return (
    <div>
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              pr: 1,
            }}
          >
            <Typography variant="body2" sx={{ width: '38%' }}>
              Study Logs
            </Typography>
            <Chip
              sx={{
                borderRadius: 0,
                width: '100px',
                bgcolor: 'purple',
                height: '25px',
              }}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '26%',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="body2">29 minutes</Typography>
              <Typography variant="body2">16.3%</Typography>
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                mb: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  sx={{
                    borderRadius: 0,
                    width: '24px',
                    height: '25px',
                    mr: 1,
                    bgcolor: 'purple',
                  }}
                />
                <Typography variant="body2">Enrollment Log</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '25%',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="body2">10 min</Typography>
                <Typography variant="body2">16.3%</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                mb: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  sx={{
                    borderRadius: 0,
                    width: '24px',
                    height: '25px',
                    mr: 1,
                    bgcolor: 'purple',
                  }}
                />
                <Typography variant="body2">
                  Delegation of Authority Log
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '25%',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="body2">17 min</Typography>
                <Typography variant="body2">16.3%</Typography>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
      >
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              pr: 1,
            }}
          >
            <Typography variant="body2" sx={{ width: '38%' }}>
              Investigator's Brochures Version 3 and 4
            </Typography>
            <Chip
              sx={{
                borderRadius: 0,
                width: '100px',
                bgcolor: 'orange',
                height: '25px',
              }}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '26%',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="body2">1hour 29 minutes</Typography>
              <Typography variant="body2">56.3%</Typography>
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                mb: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  sx={{
                    borderRadius: 0,
                    width: '24px',
                    height: '25px',
                    mr: 1,
                    bgcolor: 'orange',
                  }}
                />
                <Typography variant="body2">Enrollment Log</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '25%',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="body2">10 min</Typography>
                <Typography variant="body2">16.3%</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                mb: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  sx={{
                    borderRadius: 0,
                    width: '24px',
                    height: '25px',
                    mr: 1,
                    bgcolor: 'orange',
                  }}
                />
                <Typography variant="body2">
                  Delegation of Authority Log
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '25%',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="body2">17 min</Typography>
                <Typography variant="body2">16.3%</Typography>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel3'}
        onChange={handleChange('panel3')}
      >
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              pr: 1,
            }}
          >
            <Typography variant="body2" sx={{ width: '38%' }}>
              IEC Documents
            </Typography>
            <Chip
              sx={{
                borderRadius: 0,
                width: '100px',
                bgcolor: 'orange',
                height: '25px',
              }}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '26%',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="body2">56 minutes</Typography>
              <Typography variant="body2">86.3%</Typography>
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                mb: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  sx={{
                    borderRadius: 0,
                    width: '24px',
                    height: '25px',
                    mr: 1,
                    bgcolor: 'orange',
                  }}
                />
                <Typography variant="body2">Enrollment Log</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '25%',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="body2">10 min</Typography>
                <Typography variant="body2">16.3%</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                mb: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  sx={{
                    borderRadius: 0,
                    width: '24px',
                    height: '25px',
                    mr: 1,
                    bgcolor: 'orange',
                  }}
                />
                <Typography variant="body2">
                  Delegation of Authority Log
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '25%',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="body2">17 min</Typography>
                <Typography variant="body2">16.3%</Typography>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  )
})

type ResultSummaryProps = {
  assessment: EnhancedAssessment
  domains: (IDomain & {
    answers: IAnswer[]
  })[]
  baseline: boolean
}

const ResultsSummaryView = observer((props: ResultSummaryProps) => {
  const { assessment, domains, baseline = false } = props

  const answers = assessment.answers

  // const answers = assessment.answers?.filter(
  //   (answer) => answer.scorerId === assessment.secondScorer._id
  // )

  // @ts-ignore
  const answersGroupedByMainDomain = _.groupBy(
    answers,
    (answer) => answer.finding?.domain?.parent?.name
  )

  let _domains = _.cloneDeep(domains)

  const filteredDomains = ['EC Reporting', 'IEC Reporting', 'IRB Reporting']

  _domains = _domains
    .map((domain) => {
      domain.answers = answersGroupedByMainDomain[domain.name]
      return domain
    })
    .filter((domain) => !filteredDomains.includes(domain.name))

  return (
    <Table>
      <TableHead>
        <TableRow>
          {baseline && <TableCell></TableCell>}
          <TableCell>Domain</TableCell>
          <TableCell>Baseline</TableCell>
          {!baseline && (
            <>
              <TableCell>Training</TableCell>
              <TableCell>Followup</TableCell>
            </>
          )}
          {baseline && <TableCell>Assign Module?</TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        {_domains.map((domain) => (
          <Domain baseline domain={domain} />
        ))}
      </TableBody>
    </Table>
  )
})

type DomainProps = {
  domain: IDomain
  baseline: boolean
}

const Domain = observer((props: DomainProps) => {
  const { domain, baseline } = props

  const state = useLocalObservable(() => ({
    showKeyConcept: false,
  }))

  if (!domain) return null
  // @ts-ignore
  const count = domain.answers?.length || 0

  // @ts-ignore
  const correctAnswerCount = domain.answers?.filter(
    (answer: any) => answer.status === AnswerStatus.Correct
  )?.length

  const percent = (correctAnswerCount / count) * 100

  const onClickAdd = () => {
    state.showKeyConcept = !state.showKeyConcept
  }

  return (
    <>
      <TableRow>
        {!baseline && (
          <TableCell>
            <IconButton onClick={onClickAdd}>
              <Add />
            </IconButton>
          </TableCell>
        )}
        <TableCell>{domain.name}</TableCell>
        <TableCell>{percent || 0}%</TableCell>
        {!baseline && (
          <>
            <TableCell>0%</TableCell>
            <TableCell>0%</TableCell>
          </>
        )}
        {baseline && (
          <>
            <TableCell></TableCell>
          </>
        )}
      </TableRow>
      {state.showKeyConcept && (
        <TableRow>
          <TableCell>KeyConcept</TableCell>
        </TableRow>
      )}
    </>
  )
})

const ResultsSummary = compose<any>(
  withFind({
    collectionName: 'domains',
    version: 2,
    getFilter: () => ({
      depth: 0,
      followupNumber: { $gt: 0 },
      isDeleted: false,
    }),
  })
)(ResultsSummaryView)

type SimulationsProps = {
  assessment: EnhancedAssessment
  user: IUser
}

const Simulations = observer((props: SimulationsProps) => {
  const { assessment, user } = props
  const usage = Utils.convert(
    assessment.userAssessmentCycle.userSimulation.usageTime,
    'astr'
  )
  const state = useLocalObservable(() => ({
    isOpen: false,
  }))

  const onClickViewResults = () => (state.isOpen = true)

  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Simulation</TableCell>
            <TableCell>Time Spent</TableCell>
            <TableCell>Assigned</TableCell>
            <TableCell>Started</TableCell>
            <TableCell>Submitted</TableCell>
            <TableCell>Published</TableCell>
            <TableCell>
              Distributed
              <br />
              (Reviewed)
            </TableCell>
            <TableCell>Actions</TableCell>
            <TableCell>Unusual Behavior</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <TableCell>
              {/* {assessment.simulation.name} */}
              simulation name
            </TableCell>
            <TableCell>
              {usage.hours} : {usage.minutes} : {usage.seconds}
            </TableCell>
            <TableCell>
              {moment(
                assessment.userAssessmentCycle.userSimulation.createdAt
              ).format('MM-DD-YYYY HH:MM:SS')}
            </TableCell>
            <TableCell>
              {moment(
                assessment.userAssessmentCycle.userSimulation.startedAt
              ).format('MM-DD-YYYY HH:MM:SS')}
            </TableCell>
            <TableCell>
              {moment(assessment.createdAt).format('MM-DD-YYYY HH:MM:SS')}
            </TableCell>
            <TableCell>
              {moment(assessment.publishedAt).format('MM-DD-YYYY HH:MM:SS')}
            </TableCell>
            <TableCell>{assessment.status}</TableCell>
            <TableCell className="usercard-body-cell">
              <Button onClick={onClickViewResults} variant="outlined">
                View Results
              </Button>
            </TableCell>
            <TableCell>
              {/* @ts-ignore */}
              <Checkbox checked={true} label="Unusual Behavior">
                Unusual Behavior
              </Checkbox>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {state.isOpen ? (
        <Stack spacing={2}>
          <FindingScore user={user} assessment={assessment} />

          <ComplianceCalculationScore />

          <ProcessIssues />

          <UnidentifiedFindings assessment={assessment} />

          <MonitoringNotes assessment={assessment} />

          <Confidential />
        </Stack>
      ) : null}
    </Box>
  )
})

type FindingScoreViewProps = {
  assessment: EnhancedAssessment
  user: IUser
}

const FindingScoreView = observer((props: FindingScoreViewProps) => {
  const { user, assessment } = props

  return (
    <Stack spacing={3}>
      {/* @ts-ignore */}
      <UserCard info user={user} assessment={assessment} />

      <ResultsSummary baseline assessment={assessment} />

      <Card>
        <CardHeader title="Findings Score" />
        <CardContent>
          <Stack spacing={3}>
            <Severity assessment={assessment} />
            <Domains assessment={assessment} />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
})

type SeverityProps = {
  assessment: EnhancedAssessment
}

type DomainsViewProps = {
  assessment: EnhancedAssessment
  domains: IDomain[]
}

const DomainsView = observer((props: DomainsViewProps) => {
  const { assessment, domains } = props
  // @ts-ignore
  const answersGroupedByDomain = _.groupBy(
    assessment.answers,
    (answer) => answer.finding?.domain?.name
  )
  const domainKeys = Object.keys(answersGroupedByDomain)

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Domain</TableCell>
          <TableCell>% Identified</TableCell>
          <TableCell>Identified</TableCell>
          <TableCell>Not Identified</TableCell>
          <TableCell>Total</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {domainKeys.map((key) => {
          const correctAnswerCount = answersGroupedByDomain[key]?.filter(
            (answer) =>
              answer.scoring.adjudicator.answerStatus === AnswerStatus.Correct
          )?.length
          const incorrectAnswerCount = answersGroupedByDomain[key]?.filter(
            (answer) =>
              answer.scoring.adjudicator.answerStatus === AnswerStatus.InCorrect
          )?.length
          const totalCount = answersGroupedByDomain[key]?.length
          const identified = (correctAnswerCount / totalCount) * 100

          return (
            <TableRow>
              <TableCell>{key}</TableCell>
              <TableCell>{Math.round(identified)}%</TableCell>
              <TableCell>{correctAnswerCount}</TableCell>
              <TableCell>{incorrectAnswerCount}</TableCell>
              <TableCell>{totalCount}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
})

const Domains = compose<any>(
  withFind({
    collectionName: 'domains',
    version: 2,
    getFilter: () => ({ depth: 1 }),
  })
)(DomainsView)

const Severity = observer((props: SeverityProps) => {
  const { assessment } = props
  const answersGroupedBySeverity = _.groupBy(
    assessment.answers,
    (answer) => answer.finding?.severity
  )

  const serverities = [
    {
      text: 'Critical',
      value: FindingSeverity.Critical,
    },
    {
      text: 'Major',
      value: FindingSeverity.Major,
    },
    {
      text: 'Minor',
      value: FindingSeverity.Minor,
    },
  ]

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Severity</TableCell>
          <TableCell>% Identified</TableCell>
          <TableCell>Identified</TableCell>
          <TableCell>Not Identified</TableCell>
          <TableCell>Total</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[
          serverities.map((severity) => {
            const correctAnswerCount = answersGroupedBySeverity[
              severity.value
            ]?.filter(
              (answer) =>
                answer.scoring.adjudicator.answerStatus === AnswerStatus.Correct
            ).length
            const incorrectAnswerCount = answersGroupedBySeverity[
              severity.value
            ]?.filter(
              (answer) =>
                answer.scoring.adjudicator.answerStatus ===
                AnswerStatus.InCorrect
            ).length
            const identified =
              (correctAnswerCount /
                answersGroupedBySeverity[severity.value]?.length) *
              100
            return (
              <TableRow>
                <TableCell>{severity.text}</TableCell>
                <TableCell>{Math.round(identified) || 0}</TableCell>
                <TableCell>{correctAnswerCount || 0}</TableCell>
                <TableCell>{incorrectAnswerCount || 0}</TableCell>
                <TableCell>
                  {correctAnswerCount + incorrectAnswerCount || 0}
                </TableCell>
              </TableRow>
            )
          }),
        ]}
      </TableBody>
    </Table>
  )
})

type ComplianceCalculationScoreViewProps = {}

const ComplianceCalculationScoreView = observer(
  (props: ComplianceCalculationScoreViewProps) => {
    return (
      <Card>
        <CardHeader title="ComplianceCalculationScore" />
        <CardContent>
          <Grid container>
            <Grid item xs={6}>
              <Stack spacing={3}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Study Drug</TableCell>
                      <TableCell>% Correct</TableCell>
                      <TableCell>Correct</TableCell>
                      <TableCell>InCorrect</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <TableCell>Number of pills taken by subject</TableCell>
                      <TableCell>100%</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>2</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        Number of pills that should have been taken by subject{' '}
                      </TableCell>
                      <TableCell>100%</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>2</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Percent(%) Compliance </TableCell>
                      <TableCell>100%</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>2</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Rescure Medication</TableCell>
                      <TableCell>% Correct</TableCell>
                      <TableCell>Correct</TableCell>
                      <TableCell>InCorrect</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Number of pills taken by subject</TableCell>
                      <TableCell>100%</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>2</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Calculation</TableCell>
                    <TableCell>Result</TableCell>
                    <TableCell>CRA Input</TableCell>
                    <TableCell>Answer Key</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell variant="head" colSpan={4}>
                      Subject LAT Study Medication Returned at Visit 3
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Number of pills taken by subject</TableCell>
                    <TableCell>100%</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head" colSpan={4}>
                      Subject LAT Study Medication Returned at Visit 13-ET
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Number of pills taken by subject</TableCell>
                    <TableCell>100%</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head" colSpan={4}>
                      Subject LAT Rescue Medication Returned at Visit 3
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Number of pills taken by subject</TableCell>
                    <TableCell>100%</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head" colSpan={4}>
                      Subject LAT Rescue Medication Returned at Visit 13-ET
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Number of pills taken by subject</TableCell>
                    <TableCell>100%</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  }
)

const ComplianceCalculationScore = compose<any>()(
  ComplianceCalculationScoreView
)

const ProcessIssuesView = observer(() => {
  return (
    <Card>
      <CardHeader title="Process Issues" />
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Process</TableCell>
              <TableCell>Result</TableCell>
              <TableCell>Documents</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell>Documents not reviewed</TableCell>
              <TableCell>0</TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Non-errors identified by CRA</TableCell>
              <TableCell>0</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
})

export const ProcessIssues = compose<any>()(ProcessIssuesView)

type UnidentifiedFindingsViewProps = {
  assessment: EnhancedAssessment
}

const UnidentifiedFindingsView = observer(
  (props: UnidentifiedFindingsViewProps) => {
    const { assessment } = props

    const incorrectAnswers = assessment.answers?.filter(
      (answer) =>
        answer.scoring.adjudicator.answerStatus === AnswerStatus.InCorrect
    )

    const serverities = [
      {
        text: 'Critical',
        value: FindingSeverity.Critical,
      },
      {
        text: 'Major',
        value: FindingSeverity.Major,
      },
      {
        text: 'Minor',
        value: FindingSeverity.Minor,
      },
    ]

    return (
      <Card>
        <CardHeader title="Unidentified Findings" />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Findings Not Identified</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Document1</TableCell>
                <TableCell>Document2</TableCell>
                <TableCell>Document3</TableCell>
                <TableCell>Evaluation</TableCell>
                <TableCell>Relevant ICH-GCP</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incorrectAnswers.map((answer) => {
                if (!answer?.finding) return null
                return (
                  <TableRow>
                    <TableCell>{answer.finding.text}</TableCell>
                    <TableCell>
                      {
                        serverities.find(
                          (severity) =>
                            severity.value === answer.finding?.severity
                        )?.text
                      }
                    </TableCell>
                    {/* @ts-ignore */}
                    <TableCell>
                      {answer.finding.domain?.name || 'Unknown'}
                    </TableCell>
                    <TableCell>Document1</TableCell>
                    <TableCell>Document2</TableCell>
                    <TableCell>Document3</TableCell>
                    <TableCell>N/A</TableCell>
                    <TableCell>{answer.finding.ich_gcp}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }
)

const UnidentifiedFindings = compose<any>()(UnidentifiedFindingsView)

type MonitoringNotesViewProps = {
  assessment: EnhancedAssessment
}

const MonitoringNotesView = observer((props: MonitoringNotesViewProps) => {
  const { assessment } = props
  return (
    <Card>
      <CardHeader title="Monitoring Notes" />
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Create Order</TableCell>
              <TableCell>Document</TableCell>
              <TableCell>Monitoring Note</TableCell>
              <TableCell>Non-Error Comment</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {assessment.answers?.map((answer, index) => {
              return (
                <TableRow>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{answer.note?.viewport?.simDoc?.title}</TableCell>
                  <TableCell>{answer.note?.text}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
})

const Confidential = observer(() => {
  return (
    <Alert severity="warning">
      <AlertTitle>The information in this document is confidential.</AlertTitle>
    </Alert>
  )
})

type DomainPerformanceProps = {
  assessment: EnhancedAssessment
  domains: IDomain[]
}

const DomainPerformance = observer((props: DomainPerformanceProps) => {
  const { assessment, domains } = props
  // @ts-ignore
  const answersGroupedByDomain = _.groupBy(
    assessment?.answers,
    (answer) => answer.finding?.domain?.parent?.name
  )

  const data = domains.map((domain) => {
    if (answersGroupedByDomain[domain.name]) {
      const correctAnswerCount = answersGroupedByDomain[domain.name].filter(
        (answer) =>
          answer.scoring.adjudicator.answerStatus === AnswerStatus.Correct
      )?.length
      const totalCount = answersGroupedByDomain[domain.name]?.length
      return (correctAnswerCount / totalCount) * 100
    } else {
      return 0
    }
  })

  var options = {
    series: [
      {
        name: 'Series 1',
        data: data,
      },
    ],
    chart: {
      height: 350,
      type: 'radar',
    },
    title: {
      text: 'Domain Performance',
    },
    xaxis: {
      categories: domains.map((domain) => domain.name),
    },
  }

  return (
    <ReactApexChart
      type="radar"
      // @ts-ignore
      options={options}
      series={options.series}
      height={350}
    />
  )
})

const MonitoringNotes = compose<any>()(MonitoringNotesView)

const FindingScore = compose<any>()(FindingScoreView)
