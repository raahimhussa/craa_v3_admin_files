import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  TooltipProps,
  Typography,
  styled,
  tooltipClasses,
} from '@mui/material'
import {
  Circle,
  CircleOutlined,
  Close,
  ExitToApp,
  FeedbackOutlined,
} from '@mui/icons-material'
// import { Select, Spacer } from '@components'
import { green, grey, red, yellow } from '@mui/material/colors'
import { observable, reaction, toJS } from 'mobx'
import { useEffect, useState } from 'react'

import { AnswerStatus } from 'src/utils/status'
import { AssessmentScorerType } from 'src/stores/ui/pages/assessment'
import Finding from 'src/models/finding'
import IAnswer from 'src/models/answer/answer.interface'
import { IAssessment } from 'src/models/assessment/assessment.interface'
import IFinding from 'src/models/finding/finding.interface'
import { INote } from 'src/models/note/note.interface'
import { ISimDoc } from 'src/models/simDoc/types'
import IUser from 'src/models/user/user.interface'
import { KeyedMutator } from 'swr'
import Note from 'src/models/note'
import SimDoc from 'src/models/simDoc'
import UserSimulation from 'src/models/userSimulation'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'
import uniqid from 'uniqid'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'
import { withFind } from '@hocs'
import withFindOne from 'src/hocs/withFindOne'

function FindingsView(props: {
  findingsBySimDoc: (SimDoc & { findings: Finding[] })[]
  notes: Note[]
  assessment: IAssessment
  userSimulation: UserSimulation
  pageDisabled?: boolean
  scorers: IUser[]
}) {
  const { answerStore } = useRootStore()
  const folderIds = Object.keys(props.findingsBySimDoc)

  useEffect(() => {
    answerStore.answers = []
  }, [])

  return (
    <Table className="scoring_table">
      <TableHead>
        <Header />
      </TableHead>
      <TableBody sx={{ overflow: 'auto' }}>
        {props.findingsBySimDoc.map((simDoc) => {
          return (
            <SimDocNameView key={uniqid()} name={simDoc.title}>
              {simDoc.findings.map((_finding, i) => {
                return (
                  <FindingRow
                    key={`${_finding._id}`}
                    finding={_finding}
                    notes={props.notes}
                    assessment={props.assessment}
                    userSimulation={props.userSimulation}
                    pageDisabled={props.pageDisabled}
                    scorers={props.scorers}
                  />
                )
              })}
            </SimDocNameView>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default observer(FindingsView)

const SimDocNameView = observer(
  ({ name, children }: { name: string; children: React.ReactNode }) => {
    return (
      <>
        <TableRow>
          <TableCell
            sx={{
              color: (theme) => theme.palette.primary.main,
              fontSize: 16,
              fontWeight: 600,
              textAlign: 'center',
              bgcolor: 'rgb(57, 109, 130,0.2)',
            }}
            colSpan={6}
          >
            {name}
            <Divider />
          </TableCell>
          {/*  */}
        </TableRow>
        {children}
      </>
    )
  }
)

const FindingRowView = observer(
  ({
    finding,
    notes,
    answer,
    answerMutate,
    assessment,
    pageDisabled,
    scorers,
  }: {
    assessment: IAssessment
    finding: IFinding
    notes: INote[]
    answer: IAnswer
    answerMutate: KeyedMutator<any>
    pageDisabled?: boolean
    scorers: IUser[]
  }) => {
    const {
      uiState: {
        assessment: { scorerType },
      },
      answerStore,
      assessmentStore,
    } = useRootStore()

    const [isTooltipOpened, setIsTooltipOpened] = useState<boolean>(false)

    const isAdjudicator = scorerType === AssessmentScorerType.Adjudicator

    const isFirstScorer = scorerType === AssessmentScorerType.FirstScorer

    const isSecondScorer = scorerType === AssessmentScorerType.SecondScorer
    const hasAdjudicated =
      answer?.scoring?.adjudicator.answerStatus !== AnswerStatus.NotScored

    const isNeededToAdjudicate =
      (answer?.scoring?.firstScorer.answerStatus !==
        answer?.scoring?.secondScorer.answerStatus ||
        answer?.scoring?.firstScorer.noteId !==
          answer?.scoring?.secondScorer.noteId) &&
      (answer?.scoring?.adjudicator.answerStatus === AnswerStatus.NotScored ||
        (answer?.scoring?.adjudicator.answerStatus === AnswerStatus.Correct &&
          !answer?.scoring?.adjudicator.noteId))

    const correctCondition =
      answer?.scoring?.[scorerType]?.answerStatus === AnswerStatus.Correct &&
      answer?.scoring?.[scorerType]?.noteId
    const inCorrectCondition =
      answer?.scoring?.[scorerType]?.answerStatus === AnswerStatus.InCorrect

    useEffect(() => {
      if (!answer) return
      if (!answerStore.answers.find((_answer) => _answer._id === answer._id)) {
        answerStore.answers.push(answer)
      }
    }, [answer?._id])

    const getFirstScorerName = () => {
      const _id = assessment.firstScorer._id
      const scorer = scorers.find((_scorer) => _scorer._id === _id)
      if (!scorer) return 'undefined'
      return `${scorer.profile?.firstName} ${scorer.profile?.lastName}`
    }

    const getSecondScorerName = () => {
      const _id = assessment.firstScorer._id
      const scorer = scorers.find((_scorer) => _scorer._id === _id)
      if (!scorer) return 'undefined'
      return `${scorer.profile?.firstName} ${scorer.profile?.lastName}`
    }

    if (!answer) return null

    return (
      <TableRow
        selected={isAdjudicator && (hasAdjudicated || isNeededToAdjudicate)}
        className={
          isAdjudicator
            ? isNeededToAdjudicate
              ? 'table-row-warning'
              : hasAdjudicated
              ? correctCondition || inCorrectCondition
                ? 'table-row-success'
                : 'table-row-warning'
              : undefined
            : correctCondition || inCorrectCondition
            ? undefined
            : assessmentStore.showValidationScoring
            ? 'table-row-warning'
            : undefined
        }
        // sx={{
        //   backgroundColor: isAdjudicator
        //     ? isNeededToAdjudicate
        //       ? '#fff429 !important'
        //       : hasAdjudicated
        //       ? correctCondition || inCorrectCondition
        //         ? '#d3ffb1 !important'
        //         : '#fff429 !important'
        //       : undefined
        //     : correctCondition || inCorrectCondition
        //     ? undefined
        //     : assessmentStore.showValidationScoring
        //     ? '#fff429 !important'
        //     : undefined,
        // }}
      >
        <TableCell>
          {isAdjudicator && (isNeededToAdjudicate || hasAdjudicated) && (
            <ThemeTooltip                          
              open={isTooltipOpened}
              title={
                <Box sx={{                  
                  backgroundColor: 'white',
                  padding: '0 5px 5px 0',
                  borderRadius: '5px'
                  }}>
                  <Button
                    onClick={() => setIsTooltipOpened(false)}
                    sx={{ zIndex: 10 }}
                  >
                    <Close />
                  </Button>
                  <Box display={'flex'}>
                    <Typography
                      sx={{                        
                        width: 72,
                        color: 'black',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: 11,
                        mr: 1,
                      }}
                    >
                      {getFirstScorerName()}
                    </Typography>
                    <MNID
                      disabled
                      notes={notes}
                      answer={answer}
                      answerMutate={answerMutate}
                      scorerType={AssessmentScorerType.FirstScorer}
                      sx={{ height: 30 }}
                    />
                    <Answer
                      disabled
                      answer={answer}
                      answerMutate={answerMutate}
                      scorerType={AssessmentScorerType.FirstScorer}
                    />
                  </Box>
                  <Divider sx={{ mt: 1, mb: 1 }} />
                  <Box display={'flex'}>
                    <Typography
                      sx={{
                        width: 72,
                        color: 'black',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: 11,
                        mr: 1,
                      }}
                    >
                      {getSecondScorerName()}
                    </Typography>
                    <MNID
                      disabled
                      notes={notes}
                      answer={answer}
                      answerMutate={answerMutate}
                      scorerType={AssessmentScorerType.SecondScorer}
                      sx={{ height: 30 }}
                    />
                    <Answer
                      disabled
                      answer={answer}
                      answerMutate={answerMutate}
                      scorerType={AssessmentScorerType.SecondScorer}
                    />
                  </Box>
                </Box>
              }
              placement="left"
            >
              <button
                onClick={() => setIsTooltipOpened(true)}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid grey',
                  cursor: 'pointer',
                  margin: '0px 4px 0px 4px',
                  width: '28px',
                  height: '28px',
                }}
              >
                <FeedbackOutlined />
              </button>
            </ThemeTooltip>
          )}
        </TableCell>
        <TableCell>
          <MNID
            notes={notes}
            answer={answer}
            answerMutate={answerMutate}
            scorerType={scorerType}
            pageDisabled={pageDisabled}
          />
        </TableCell>
        <TableCell align="center">
          <Answer
            answer={answer}
            answerMutate={answerMutate}
            scorerType={scorerType}
            pageDisabled={pageDisabled}
          />
        </TableCell>

        <TableCell>
          <Typography sx={{ fontSize: '13.8px', textAlign: 'left', pl: 0.3 }}>
            {finding.text}
          </Typography>
        </TableCell>
      </TableRow>
    )
  }
)

const ThemeTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => {
  return {
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.background.neutral,
    },
  }
})

const getAnswerFilter = ({
  assessment,
  finding,
  userSimulation,
}: {
  assessment: IAssessment
  finding: IFinding
  userSimulation: UserSimulation
}) => {
  return {
    assessmentId: assessment._id,
    findingId: finding._id,
    userSimulationId: userSimulation._id,
    status: {
      $in: [
        AnswerStatus.Correct,
        AnswerStatus.InCorrect,
        AnswerStatus.NotScored,
      ],
    },
  }
}
const FindingRow = compose<any>(
  withFindOne({
    isDocNeeded: false,
    collectionName: 'answers',
    getFilter: getAnswerFilter,
    version: 2,
    uiStoreKey: 'answer',
  })
)(FindingRowView)

const MNID = observer(
  ({
    disabled,
    notes,
    answer,
    answerMutate,
    scorerType,
    sx,
    pageDisabled,
  }: {
    disabled?: boolean
    notes: INote[]
    answer?: IAnswer
    answerMutate: KeyedMutator<any>
    scorerType: AssessmentScorerType
    sx?: any
    pageDisabled?: boolean
  }) => {
    if (!answer) return null
    const { answerStore } = useRootStore()

    const { enqueueSnackbar } = useSnackbar()

    const defaultNoteId = () => {
      if (answer.scoring[scorerType].noteId)
        return answer.scoring[scorerType].noteId
      if (
        scorerType === AssessmentScorerType.Adjudicator &&
        answer.scoring[AssessmentScorerType.FirstScorer].noteId ===
          answer.scoring[AssessmentScorerType.SecondScorer].noteId
      ) {
        return answer.scoring[AssessmentScorerType.FirstScorer].noteId
      }
      return null
    }

    const state = observable({
      noteId: defaultNoteId(),
    })

    const mnIdOptions = notes
      ?.sort((a, b) => (a.MNID - b.MNID > 0 ? 1 : -1))
      .map((note) => ({
        label: note.MNID + '',
        id: note._id,
      }))

    reaction(
      () => state.noteId,
      async (noteId) => {
        try {
          if (noteId) {
            await answerStore.connectNoteIdToAnswer(
              answer._id,
              noteId,
              scorerType
            )
            enqueueSnackbar('Connected', { variant: 'success' })
          } else {
            await answerStore.connectNoteIdToAnswer(answer._id, '', scorerType)
            enqueueSnackbar('Disconnected', { variant: 'success' })
          }
        } catch (error) {
          return enqueueSnackbar('error!', { variant: 'error' })
        }
        answerMutate && answerMutate()
      }
    )
    const value = (): { id: any; label: string } => {
      if (scorerType === AssessmentScorerType.Adjudicator) {
        if (
          answer.scoring.firstScorer.noteId ===
            answer.scoring.secondScorer.noteId &&
          !answer.scoring.adjudicator.noteId
        ) {
          const id = answer.scoring.firstScorer.noteId
          const label =
            mnIdOptions.find((_option) => _option.id === id)?.label || ''
          return { id, label: `${label}` }
        }
        const id = answer.scoring[scorerType].noteId
        const label =
          mnIdOptions.find((_option) => _option.id === id)?.label || ''
        return { id, label: `${label}` }
      } else {
        const id = answer.scoring[scorerType].noteId
        const label =
          mnIdOptions.find((_option) => _option.id === id)?.label || ''
        return { id, label: `${label}` }
      }
    }
    return (
      <Box>
        <Autocomplete
          disabled={
            pageDisabled ||
            disabled ||
            answer.scoring[scorerType].answerStatus === AnswerStatus.InCorrect
          }
          renderInput={(params) => (
            <TextField {...params} sx={{ width: '96px !important' }} />
          )}
          options={mnIdOptions}
          onChange={(e, selectedOptions) =>
            (state.noteId = selectedOptions?.id || '')
          }
          value={value()}
          componentsProps={{
            paper: {
              sx: {
                width: 'fit-content',
              },
            },
          }}
        />
        {/* <Select
          disabled={
            disabled ||
            answer.scoring[scorerType].answerStatus === AnswerStatus.InCorrect
          }
          sx={{ width: 96, ...sx }}
          // options={mnIdOptions}
          // state={state}
          value={value()}
          // path="noteId"
          onChange={(e) => (state.noteId = e.target.value)}
        >
          {mnIdOptions.map((_mnIdOption) => {
            return (
              <MenuItem value={_mnIdOption.value} key={_mnIdOption.value}>
                {_mnIdOption.text}
              </MenuItem>
            )
          })}
        </Select> */}
      </Box>
    )
  }
)

const Header = observer(() => {
  return (
    <TableRow>
      <TableCell sx={{ width: '64px !important' }} />
      <TableCell sx={{ width: '64px !important' }}>MN ID</TableCell>
      <TableCell align="center" sx={{ width: '80px !important' }}>
        Status
      </TableCell>

      <TableCell>Findings</TableCell>
    </TableRow>
  )
})

const Answer = observer(
  ({
    disabled,
    answer,
    answerMutate,
    noteId,
    scorerType,
    pageDisabled,
  }: {
    disabled?: boolean
    answer?: IAnswer
    noteId?: string
    answerMutate?: KeyedMutator<any>
    scorerType: AssessmentScorerType
    pageDisabled?: boolean
  }) => {
    if (!answer) return null

    const { enqueueSnackbar } = useSnackbar()

    const { answerStore } = useRootStore()

    const isNeededToAdjudicate =
      answer?.scoring.firstScorer.answerStatus !==
        answer?.scoring.secondScorer.answerStatus ||
      answer?.scoring.firstScorer.noteId !== answer?.scoring.secondScorer.noteId

    const getColor = (status: AnswerStatus) => {
      switch (status) {
        case AnswerStatus.Correct:
          return green[500]
        case AnswerStatus.InCorrect:
          return red[500]
        case AnswerStatus.NotScored:
          return grey[500]
        default:
          return grey[500]
      }
    }

    const buttons = [
      {
        type: AnswerStatus.Correct,
        color: getColor(AnswerStatus.Correct),
        active:
          scorerType === AssessmentScorerType.Adjudicator
            ? answer.scoring.adjudicator.answerStatus === AnswerStatus.NotScored
              ? isNeededToAdjudicate
                ? false
                : answer.scoring.firstScorer.answerStatus ===
                  AnswerStatus.Correct
              : answer.scoring.adjudicator.answerStatus === AnswerStatus.Correct
            : answer.scoring[scorerType].answerStatus === AnswerStatus.Correct,
        onClick: async () => {
          try {
            await answerStore.markAsCorrect(answer._id, scorerType)
            answerMutate && answerMutate()
          } catch (error) {
            throw error
          }
        },
      },
      {
        type: AnswerStatus.InCorrect,
        color: getColor(AnswerStatus.InCorrect),
        active:
          scorerType === AssessmentScorerType.Adjudicator
            ? answer.scoring.adjudicator.answerStatus === AnswerStatus.NotScored
              ? isNeededToAdjudicate
                ? false
                : answer.scoring.firstScorer.answerStatus ===
                  AnswerStatus.InCorrect
              : answer.scoring.adjudicator.answerStatus ===
                AnswerStatus.InCorrect
            : answer.scoring[scorerType].answerStatus ===
              AnswerStatus.InCorrect,
        onClick: async () => {
          try {
            await answerStore.markAsIncorrect(answer._id, scorerType)
            answerMutate && answerMutate()
          } catch (error) {
            throw error
          }
        },
      },
    ]

    const onClickButton = async (button: any) => {
      if (disabled) return
      try {
        await button.onClick()
      } catch (error) {
        return enqueueSnackbar('Error!', { variant: 'error' })
      }

      answerMutate && answerMutate()

      enqueueSnackbar('Success', { variant: 'success' })
    }

    return (
      <Box sx={{ display: 'flex' }}>
        {buttons.map((button) => {
          return (
            <IconButton
              key={button.type}
              onClick={() => onClickButton(button)}
              disabled={pageDisabled}
            >
              {button.active ? (
                <Circle htmlColor={button.color} />
              ) : (
                <CircleOutlined htmlColor={button.color} />
              )}
            </IconButton>
          )
        })}
      </Box>
    )
  }
)
