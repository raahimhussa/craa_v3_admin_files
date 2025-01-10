import {
  Box,
  Card,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'

import AddCircleIcon from '@mui/icons-material/AddCircle'
import Assessment from 'src/models/assessment'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import UserSimulation from 'src/models/userSimulation'
import axios from 'axios'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'
import withFindOne from 'src/hocs/withFindOne'

const ResultsSummaryView = ({
  userSimulation,
  setResultSummary,
  resultSummary,
}: {
  userSimulation: UserSimulation
  setResultSummary: any
  resultSummary: any
}) => {
  const [keyConcepts, setKeyConcepts] = useState({})
  const [bkeyConcepts, setbKeyConcepts] = useState({})
  const [baseline, setBaseline] = useState<UserSimulation>()

  function getfindings(sim: UserSimulation) {
    let obj = {}
    sim.results?.identifiedScoreByMainDomain.map(async (domain) => {
      //@ts-ignore
      let arr = []
      const tmp: any[] = []
      await domain.notIdentifiedFindings.map(async (finding) => {
        const { data } = await axios.get(`v2/findings/${finding._id}`)
        console.log({ data })
        if (
          tmp.find((_keyconcept) => _keyconcept._id === data[0].keyconcept._id)
        ) {
          return
        }
        arr.push(data[0].keyconcept.description)
        tmp.push(data[0].keyconcept)
      })
      //@ts-ignore
      obj[domain.domainId] = arr
    })
    console.log({ obj })
    if (sim.simulationType === 'Baseline') {
      setbKeyConcepts(obj)
    } else {
      //@ts-ignore
      setKeyConcepts(obj)
    }
  }

  async function getBaselineData() {
    const params = {
      filter: {
        userId: userSimulation.userId,
        simulationType: 'Baseline',
      },
    }
    const { data } = await axios.get(`v2/userSimulations`, { params })
    setBaseline(data[0])
    getfindings(data[0])
  }

  useEffect(() => {
    getBaselineData()
    if (userSimulation.simulationType !== 'Baseline') {
      getfindings(userSimulation)
    }
    let columns: string[] = [' ', 'Baseline Score', 'Assigned Training Modules']
    let rows: any = []
    let isPass: boolean[] = []
    userSimulation?.results?.scoreByMainDomain.map((result, index) => {
      const notIncludes = ['IEC Reporting', 'IRB Reporting', 'EC Reporting']
      if (notIncludes.includes(result.name)) return null
      let arr = []
      arr.push(result.name)
      arr.push(`${result?.score?.toFixed(0) || 0}%`)
      arr.push(result.pass ? 'not assigned' : 'assigned')
      rows.push(arr)
      isPass.push(result.pass)
    })
    setResultSummary({ rows: rows, columns: columns, pass: isPass })
  }, [])

  return (
    <Box>
      <Typography sx={{ fontWeight: 700, mb: 0.5, mt: 4 }}>
        Results Summary
      </Typography>
      <Typography
        sx={{
          fontWeight: 500,
          mb: 1,
          mt: 2,
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        * Click{' '}
        <AddCircleIcon
          sx={{ color: '#a6a6a6', fontSize: 17, mx: 0.1, mr: 0.3 }}
        />{' '}
        to view <b> key monitoring concepts </b> that were <b> missed </b> in
        the simulation.
      </Typography>
      <Card className="preview_card" sx={{ width: '50%' }}>
        <Table className="preview_table">
          <TableHead>
            <TableCell width={'1%'} />
            <TableCell className="title" />
            <TableCell width="10%">Baseline Score</TableCell>
            {userSimulation.simulationType === 'Followup' ? (
              <TableCell width="10%">Followup Score</TableCell>
            ) : (
              <></>
            )}
            {userSimulation.simulationType === 'Baseline' ? (
              <TableCell width="15%">
                Assigned Training Modules (passed?)
              </TableCell>
            ) : (
              <></>
            )}
          </TableHead>
          <TableBody>
            {userSimulation?.results?.scoreByMainDomain.map((result, index) => {
              const notIncludes = [
                'IEC Reporting',
                'IRB Reporting',
                'EC Reporting',
              ]
              const [open, setOpen] = useState(false)
              if (notIncludes.includes(result.name)) return null

              return (
                <>
                  <TableRow key={index}>
                    <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                      >
                        {open ? (
                          <RemoveCircleIcon sx={{ color: '#a6a6a6' }} />
                        ) : (
                          <AddCircleIcon sx={{ color: '#a6a6a6' }} />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell className="preview-body-cell title">
                      {result.name}
                    </TableCell>
                    <TableCell
                      className="preview-body-cell"
                      sx={{
                        bgcolor: baseline?.results?.scoreByMainDomain.filter(
                          (el) => el.domainId === result.domainId
                        )[0].pass
                          ? 'green'
                          : '#f3f338',
                        fontWeight: 600,
                        color: baseline?.results?.scoreByMainDomain.filter(
                          (el) => el.domainId === result.domainId
                        )[0].pass
                          ? 'white'
                          : 'black',
                      }}
                    >
                      {`${
                        baseline?.results?.scoreByMainDomain
                          .filter((el) => el.domainId === result.domainId)[0]
                          ?.score?.toFixed(0) || 0
                      }%`}
                    </TableCell>
                    {userSimulation.simulationType === 'Followup' ? (
                      <TableCell
                        className="preview-body-cell"
                        sx={{
                          bgcolor: result.pass ? 'green' : '#f3f338',
                          fontWeight: 600,
                          color: result.pass ? 'white' : 'black',
                        }}
                      >
                        {`${result?.score?.toFixed(0) || 0}%`}
                      </TableCell>
                    ) : (
                      <></>
                    )}
                    {userSimulation.simulationType === 'Baseline' ? (
                      <TableCell className="preview-body-cell">
                        {result.pass ? 'not assigned' : 'assigned'}
                      </TableCell>
                    ) : (
                      <></>
                    )}
                  </TableRow>
                  <TableRow>
                    <TableCell className="no-padding"></TableCell>
                    <TableCell className="no-padding" colSpan={3}>
                      <Collapse in={open} timeout="auto" unmountOnExit>
                        {userSimulation.simulationType === 'Baseline' ? (
                          <Box sx={{ margin: 1 }}>
                            <ul
                              style={{
                                textAlign: 'left',
                                paddingLeft: '0',
                              }}
                            >
                              {
                                //@ts-ignore
                                bkeyConcepts[result.domainId]?.map((key) => (
                                  <li
                                    style={{
                                      padding: '0.2rem',
                                    }}
                                  >
                                    {key}
                                  </li>
                                ))
                              }
                            </ul>
                          </Box>
                        ) : (
                          <Box sx={{ margin: 1 }}>
                            {
                              //@ts-ignore
                              keyConcepts[result.domainId]?.map((key) => (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    mb: 0.5,
                                  }}
                                >
                                  {
                                    //@ts-ignore
                                    bkeyConcepts[result.domainId]?.includes(
                                      key
                                    ) ? (
                                      <span
                                        style={{
                                          backgroundColor: '#17a2b8',
                                          color: 'white',
                                          fontWeight: 500,
                                          padding: '0.1rem 0.3rem',
                                          borderRadius: '5px',
                                          height: '15px',
                                          fontSize: '12px',
                                          marginRight: '0.1rem',
                                        }}
                                      >
                                        B
                                      </span>
                                    ) : (
                                      <></>
                                    )
                                  }
                                  <span
                                    style={{
                                      backgroundColor: '#dc3545',
                                      color: 'white',
                                      fontWeight: 500,
                                      padding: '0.1rem 0.3rem',
                                      borderRadius: '5px',
                                      height: '15px',
                                      fontSize: '12px',
                                      marginRight: '0.3rem',
                                    }}
                                  >
                                    F
                                  </span>
                                  <Typography
                                    sx={{
                                      fontSize: '13px',
                                      fontWeight: 400,
                                      textAlign: 'left',
                                      lineHeight: 1.3,
                                    }}
                                  >
                                    {key}
                                  </Typography>
                                </Box>
                              ))
                            }
                          </Box>
                        )}
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              )
            })}
          </TableBody>
        </Table>
      </Card>
      {userSimulation.simulationType === 'Followup' ? (
        <Box
          sx={{
            width: '50%',
            textAlign: 'center',
            mt: 1,
          }}
        >
          <span
            style={{
              backgroundColor: '#17a2b8',
              color: 'white',
              fontWeight: 500,
              padding: '0.05rem 0.3rem',
              borderRadius: '5px',
              height: '10px',
              fontSize: '12px',
              marginRight: '0.2rem',
            }}
          >
            B
          </span>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 500,
              marginRight: '0.3rem',
            }}
          >
            Baseline
          </span>
          <span
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              fontWeight: 500,
              padding: '0.05rem 0.3rem',
              borderRadius: '5px',
              height: '10px',
              fontSize: '12px',
              marginRight: '0.2rem',
            }}
          >
            F
          </span>
          <span
            style={{
              fontSize: '13.5px',
              fontWeight: 500,
            }}
          >
            Follwup
          </span>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  )
}
export default compose<any>()(observer(ResultsSummaryView))
