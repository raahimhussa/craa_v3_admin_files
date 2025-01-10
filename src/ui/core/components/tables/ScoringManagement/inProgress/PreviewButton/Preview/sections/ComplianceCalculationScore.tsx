import {
  Box,
  Card,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'

import Assessment from 'src/models/assessment'
import Note from 'src/models/note'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'
import palette from 'src/theme/palette'
import { withFind } from '@hocs'
import withFindOne from 'src/hocs/withFindOne'

const ComplianceCalculationScoreView = ({
  notes,
  setCompliance,
}: {
  notes: Note[]
  setCompliance: any
}) => {
  const [study, setStudy] = useState({
    nop: { correct: 0, incorrect: 0 },
    nosh: { correct: 0, incorrect: 0 },
    percent: { correct: 0, incorrect: 0 },
  })
  const [rescue, setRescue] = useState({ correct: 0, incorrect: 0 })

  function getSummary() {
    let studyObj = {
      nop: { correct: 0, incorrect: 0 },
      nosh: { correct: 0, incorrect: 0 },
      percent: { correct: 0, incorrect: 0 },
    }
    let rescueObj = { correct: 0, incorrect: 0 }
    console.log({ notes })
    notes.map(async (note) => {
      //study medication
      if (note.complianceNote.percent !== '') {
        Number(note.complianceNote.taken) ===
        note.viewport?.simDoc?.numberOfPillsTakenBySubject
          ? studyObj.nop.correct++
          : studyObj.nop.incorrect++
        Number(note.complianceNote.shouldTaken) ===
        note.viewport?.simDoc?.numberOfPillsPrescribed
          ? studyObj.nosh.correct++
          : studyObj.nosh.incorrect++
        Number(note.complianceNote.percent) ===
        Number(
          (
            (note.viewport?.simDoc?.numberOfPillsTakenBySubject! /
              note.viewport?.simDoc?.numberOfPillsPrescribed!) *
            100
          ).toFixed(0)
        )
          ? studyObj.percent.correct++
          : studyObj.percent.incorrect++
      } else {
        Number(note.complianceNote.taken) ===
        note.viewport?.simDoc?.numberOfPillsTakenBySubject
          ? rescueObj.correct++
          : rescueObj.incorrect++
      }
      setStudy(studyObj)
      setRescue(rescueObj)
    })
  }

  useEffect(() => {
    getSummary()
  }, [])

  useEffect(() => {
    let columns1: string[] = [
      'Study Drug',
      '% Correct',
      'Correct',
      'Incorrect',
      'Total',
    ]
    let columns2: string[] = [
      'Rescue Medication',
      '% Correct',
      'Correct',
      'Incorrect',
      'Total',
    ]
    let columns3: string[] = [
      'Calculation',
      'result',
      'CRA Input',
      'Answer Key',
    ]
    let rows1: any = [
      [
        'Number of pills taken by subject',
        `${(
          (study.nop.correct / (study.nop.correct + study.nop.incorrect)) *
          100
        ).toFixed(0)}
    %`,
        study.nop.correct,
        study.nop.incorrect,
        study.nop.correct + study.nop.incorrect,
      ],
      [
        'Number of pills that should have been taken by subject',
        `${(
          (study.nosh.correct / (study.nosh.correct + study.nosh.incorrect)) *
          100
        ).toFixed(0)}
    %`,
        study.nosh.correct,
        study.nosh.incorrect,
        study.nosh.correct + study.nop.incorrect,
      ],
      [
        'Percent(%) Compliance',
        `${(
          (study.percent.correct /
            (study.percent.correct + study.percent.incorrect)) *
          100
        ).toFixed(0)}
    %`,
        study.percent.correct,
        study.percent.incorrect,
        study.percent.correct + study.percent.incorrect,
      ],
    ]
    let rows2: any = [
      [
        'Number of pills taken by subject',
        `${(
          (rescue.correct / (rescue.correct + rescue.incorrect)) *
          100
        ).toFixed(0)}
  %`,
        rescue.correct,
        rescue.incorrect,
        rescue.correct + rescue.incorrect,
      ],
    ]
    let rows3: any = []
    notes.map((note) => {
      if (note.viewport?.simDoc?.kind === 'StudyMedication') {
        rows3.push([note.viewport?.simDoc?.title, ' ', ' ', ' '])
        rows3.push([
          'Number of pills taken by subject',
          Number(note.complianceNote.taken) ===
          note.viewport?.simDoc?.numberOfPillsTakenBySubject
            ? 'Correct'
            : 'Incorrect',
          note.complianceNote.taken,
          note.viewport?.simDoc?.numberOfPillsTakenBySubject,
        ])
        rows3.push([
          'Number of pills that should have been taken by subject',
          Number(note.complianceNote.shouldTaken) ===
          note.viewport?.simDoc?.numberOfPillsPrescribed
            ? 'Correct'
            : 'Incorrect',
          note.complianceNote.shouldTaken,
          note.viewport?.simDoc?.numberOfPillsPrescribed,
        ])
        rows3.push([
          'Percent(%) Compliance',
          note.complianceNote.percent ===
          (
            (note.viewport?.simDoc?.numberOfPillsTakenBySubject! /
              note.viewport?.simDoc?.numberOfPillsPrescribed!) *
            100
          ).toFixed(0)
            ? 'Correct'
            : 'Incorrect',
          note.complianceNote.percent,
          `${(
            (note.viewport?.simDoc?.numberOfPillsTakenBySubject! /
              note.viewport?.simDoc?.numberOfPillsPrescribed!) *
            100
          ).toFixed(0)}%`,
        ])
      } else {
        rows3.push([note.viewport?.simDoc?.title, ' ', ' ', ' '])
        rows3.push([
          'Number of pills taken by subject',
          Number(note.complianceNote.taken) ===
          note.viewport?.simDoc?.numberOfPillsTakenBySubject
            ? 'Correct'
            : 'Incorrect',
          note.complianceNote.taken,
          note.viewport?.simDoc?.numberOfPillsTakenBySubject,
        ])
      }
    })
    setCompliance({
      summary: {
        study: { rows: rows1, column: columns1 },
        rescue: { rows: rows2, column: columns2 },
      },
      detail: { rows: rows3, column: columns3 },
    })
  }, [study, rescue])

  return (
    <Box>
      {notes.length !== 0 ? (
        <>
          <Typography sx={{ fontWeight: 700, mb: 0.5, mt: 4 }}>
            Compliance Calculation Score
          </Typography>
          <Divider />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mt: 2,
            }}
          >
            <Box sx={{ width: '49%' }}>
              <Typography sx={{ fontWeight: 700, mb: 1, fontSize: '14.5px' }}>
                Summary
              </Typography>
              <Card className="preview_card">
                <Table className="preview_table">
                  <TableHead>
                    <TableCell width={'50%'}>Study Drug</TableCell>
                    <TableCell>% Correct</TableCell>
                    <TableCell>Correct</TableCell>
                    <TableCell>Incorrect</TableCell>
                    <TableCell>Total</TableCell>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Number of pills taken by subject</TableCell>
                      <TableCell>
                        {(
                          (study.nop.correct /
                            (study.nop.correct + study.nop.incorrect)) *
                          100
                        ).toFixed(0)}
                        %
                      </TableCell>
                      <TableCell>{study.nop.correct}</TableCell>
                      <TableCell>{study.nop.incorrect}</TableCell>
                      <TableCell>
                        {study.nop.correct + study.nop.incorrect}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        Number of pills that should have been taken by subject
                      </TableCell>
                      <TableCell>
                        {(
                          (study.nosh.correct /
                            (study.nosh.correct + study.nosh.incorrect)) *
                          100
                        ).toFixed(0)}
                        %
                      </TableCell>
                      <TableCell>{study.nosh.correct}</TableCell>
                      <TableCell>{study.nosh.incorrect}</TableCell>
                      <TableCell>
                        {study.nosh.correct + study.nosh.incorrect}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Percent(%) Compliance</TableCell>
                      <TableCell>
                        {(
                          (study.percent.correct /
                            (study.percent.correct + study.percent.incorrect)) *
                          100
                        ).toFixed(0)}
                        %
                      </TableCell>
                      <TableCell>{study.percent.correct}</TableCell>
                      <TableCell>{study.percent.incorrect}</TableCell>
                      <TableCell>
                        {study.percent.correct + study.percent.incorrect}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
              <Card className="preview_card" sx={{ mt: 2 }}>
                <Table className="preview_table">
                  <TableHead>
                    <TableCell width={'50%'}>Rescue Medication</TableCell>
                    <TableCell>% Correct</TableCell>
                    <TableCell>Correct</TableCell>
                    <TableCell>Incorrect</TableCell>
                    <TableCell>Total</TableCell>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Number of pills taken by subject</TableCell>
                      <TableCell>
                        {rescue.correct + rescue.incorrect === 0
                          ? 0
                          : (
                              (rescue.correct /
                                (rescue.correct + rescue.incorrect)) *
                              100
                            ).toFixed(0)}
                        %
                      </TableCell>
                      <TableCell>{rescue.correct}</TableCell>
                      <TableCell>{rescue.incorrect}</TableCell>
                      <TableCell>{rescue.correct + rescue.incorrect}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
            </Box>
            <Box sx={{ width: '49%' }}>
              <Typography sx={{ fontWeight: 700, mb: 1, fontSize: '14.5px' }}>
                Details
              </Typography>
              <Card className="preview_card">
                <Table className="preview_table">
                  <TableHead>
                    <TableCell>Calculation</TableCell>
                    <TableCell>Result</TableCell>
                    <TableCell>CRA Input</TableCell>
                    <TableCell>Answer Key</TableCell>
                  </TableHead>
                  <TableBody>
                    {notes.map((note) => {
                      return note.viewport?.simDoc?.kind ===
                        'StudyMedication' ? (
                        <>
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              sx={{
                                bgcolor: '#cccccc',
                                fontWeight: 700,
                              }}
                            >
                              {note.viewport?.simDoc?.title}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              Number of pills taken by subject
                            </TableCell>
                            <TableCell
                              sx={{
                                bgcolor:
                                  Number(note.complianceNote.taken) ===
                                  note.viewport?.simDoc
                                    ?.numberOfPillsTakenBySubject
                                    ? palette.light.button.green
                                    : palette.light.button.red,
                                color: 'white',
                                fontWeight: 500,
                              }}
                            >
                              {Number(note.complianceNote.taken) ===
                              note.viewport?.simDoc?.numberOfPillsTakenBySubject
                                ? 'Correct'
                                : 'Incorrect'}
                            </TableCell>
                            <TableCell>{note.complianceNote.taken}</TableCell>
                            <TableCell>
                              {
                                note.viewport?.simDoc
                                  ?.numberOfPillsTakenBySubject
                              }
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              Number of pills that should have been taken by
                              subject
                            </TableCell>
                            <TableCell
                              sx={{
                                bgcolor:
                                  Number(note.complianceNote.shouldTaken) ===
                                  note.viewport?.simDoc?.numberOfPillsPrescribed
                                    ? palette.light.button.green
                                    : palette.light.button.red,
                                color: 'white',
                                fontWeight: 500,
                              }}
                            >
                              {Number(note.complianceNote.shouldTaken) ===
                              note.viewport?.simDoc?.numberOfPillsPrescribed
                                ? 'Correct'
                                : 'Incorrect'}
                            </TableCell>
                            <TableCell>
                              {note.complianceNote.shouldTaken}
                            </TableCell>
                            <TableCell>
                              {note.viewport?.simDoc?.numberOfPillsPrescribed}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Percent(%) Compliance</TableCell>
                            <TableCell
                              sx={{
                                bgcolor:
                                  note.complianceNote.percent ===
                                  (
                                    (note.viewport?.simDoc
                                      ?.numberOfPillsTakenBySubject! /
                                      note.viewport?.simDoc
                                        ?.numberOfPillsPrescribed!) *
                                    100
                                  ).toFixed(0)
                                    ? palette.light.button.green
                                    : palette.light.button.red,
                                color: 'white',
                                fontWeight: 500,
                              }}
                            >
                              {note.complianceNote.percent ===
                              (
                                (note.viewport?.simDoc
                                  ?.numberOfPillsTakenBySubject! /
                                  note.viewport?.simDoc
                                    ?.numberOfPillsPrescribed!) *
                                100
                              ).toFixed(0)
                                ? 'Correct'
                                : 'Incorrect'}
                            </TableCell>
                            <TableCell>
                              {note.complianceNote.percent}%
                            </TableCell>
                            <TableCell>
                              {(
                                (note.viewport?.simDoc
                                  ?.numberOfPillsTakenBySubject! /
                                  note.viewport?.simDoc
                                    ?.numberOfPillsPrescribed!) *
                                100
                              ).toFixed(0)}
                              %
                            </TableCell>
                          </TableRow>
                        </>
                      ) : (
                        <>
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              sx={{
                                bgcolor: '#cccccc',
                                fontWeight: 700,
                              }}
                            >
                              {note.viewport?.simDoc?.title}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              Number of pills taken by subject
                            </TableCell>
                            <TableCell
                              sx={{
                                bgcolor:
                                  Number(note.complianceNote.taken) ===
                                  note.viewport?.simDoc
                                    ?.numberOfPillsTakenBySubject
                                    ? palette.light.button.green
                                    : palette.light.button.red,
                                color: 'white',
                                fontWeight: 500,
                              }}
                            >
                              {Number(note.complianceNote.taken) ===
                              note.viewport?.simDoc?.numberOfPillsTakenBySubject
                                ? 'Correct'
                                : 'Incorrect'}
                            </TableCell>
                            <TableCell>{note.complianceNote.taken}</TableCell>
                            <TableCell>
                              {
                                note.viewport?.simDoc
                                  ?.numberOfPillsTakenBySubject
                              }
                            </TableCell>
                          </TableRow>
                        </>
                      )
                    })}
                  </TableBody>
                </Table>
              </Card>
            </Box>
          </Box>
        </>
      ) : (
        <></>
      )}
    </Box>
  )
}
export default compose<any>(
  withFind({
    collectionName: 'notes',
    version: 2,
    getFilter: ({
      userId,
      userSimulationId,
    }: {
      userId: string
      userSimulationId: string
    }) => ({
      'viewport.userSimulationId': userSimulationId,
      type: 'compliance',
      userId: userId,
    }),
  })
)(observer(ComplianceCalculationScoreView))
