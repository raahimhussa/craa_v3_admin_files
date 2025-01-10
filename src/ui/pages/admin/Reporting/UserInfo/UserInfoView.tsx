import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import IUser, { LocalUser } from 'src/models/user/user.interface'
import { useEffect, useState } from 'react'

import { ApexOptions } from 'apexcharts'
import IDomain from 'src/models/domain/domain.interface'
import ReactApexChart from 'react-apexcharts'
import { ScoreByDomain } from 'src/models/userSimulation/userSimulation.interface'
import UserSimulation from 'src/models/userSimulation'
import { UserSimulationStatus } from 'src/utils/status'
import _ from 'lodash'
import axios from 'axios'
import { observer } from 'mobx-react'
import User from 'src/models/user'

type UserInfoProps = {
  user: IUser & LocalUser
  userBaseline: UserSimulation
  userFollowups: UserSimulation[]
  domains: IDomain[]
  radarStatus: number
  setShowLogs: any
  showLogs: boolean
}

export default observer((props: UserInfoProps) => {
  const {
    user,
    domains,
    userBaseline,
    userFollowups,
    radarStatus,
    setShowLogs,
    showLogs,
  } = props
  const [series, setSeries] = useState<any>([])
  useEffect(() => {
    ;(async () => {
      try {
        //baseline
        const { data } = await axios.get(
          `v3/dataDump/simulationAvg/${userBaseline?.simulationId}/${user?.profile?.clientUnitId}`
        )
        const params = {
          filter: {
            _id: userBaseline?.simulationId,
          },
        }
        const simTitle = await axios.get('/v1/simulations', { params })
        const score =
          userBaseline?.results?.scoreByDomain?.reduce(
            (accumulator, currentValue) => accumulator + currentValue.score,
            0
          ) / userBaseline?.results?.scoreByDomain?.length
        // const scores = [0, 80, 75, 90, 95, 85, 70, 100, 60, 90, 80, 75, 85]
        const scores = data.filter((val: any) => val !== null)
        const min = Math.min(...scores)
        const q1 = scores.slice().sort((a: any, b: any) => a - b)[
          Math.floor(scores.length / 4)
        ]
        const q2 = scores.slice().sort((a: any, b: any) => a - b)[
          Math.floor(scores.length / 2)
        ]
        const q3 = scores.slice().sort((a: any, b: any) => a - b)[
          Math.floor(scores.length / 4) * 3
        ]
        const max = Math.max(...scores)

        let obj: any = [
          {
            type: 'boxPlot',
            data: [
              {
                x: simTitle.data.name,
                y: [min, q1, q2, q3, max],
              },
            ],
          },
          {
            name: 'score',
            type: 'scatter',
            data: [
              {
                x: simTitle.data.name,
                y: score,
              },
            ],
          },
        ]

        //followups

        Promise.all(
          userFollowups.map(async (followup: any) => {
            const { data } = await axios.get(
              `v3/dataDump/simulationAvg/${followup.simulationId}/${user?.profile?.clientUnitId}`
            )
            const params = {
              filter: {
                _id: followup.simulationId,
              },
            }
            const simTitle = await axios.get('/v1/simulations', { params })
            const score =
              followup.results?.scoreByDomain?.reduce(
                (accumulator: any, currentValue: any) =>
                  accumulator + currentValue.score,
                0
              ) / followup?.results?.scoreByDomain?.length
            // const scores = [0, 80, 75, 90, 95, 85, 70, 100, 60, 90, 80, 75, 85]
            const scores = data.filter((val: any) => val !== null)
            const min = Math.min(...scores)
            const q1 = scores.slice().sort((a: any, b: any) => a - b)[
              Math.floor(scores.length / 4)
            ]
            const q2 = scores.slice().sort((a: any, b: any) => a - b)[
              Math.floor(scores.length / 2)
            ]
            const q3 = scores.slice().sort((a: any, b: any) => a - b)[
              Math.floor(scores.length / 4) * 3
            ]
            const max = Math.max(...scores)
            obj[0].data.push({
              x: simTitle.data.name,
              y: [min, q1, q2, q3, max],
            })
            obj[1].data.push({
              x: simTitle.data.name,
              y: score,
            })
          })
        ).then((val) => {
          console.log(obj)
          setSeries(obj)
        })
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  const options: ApexOptions = {
    chart: {
      type: 'boxPlot',
      height: 350,
      zoom: {
        enabled: false,
        type: 'xy',
      },
    },
    // title: {
    //   text: 'Score Distribution',
    //   align: 'left',
    // },
    legend: {
      show: false,
    },
    plotOptions: {
      boxPlot: {
        colors: {
          upper: '#5C4742',
          lower: '#A5978B',
        },
      },
    },
    yaxis: {
      max: 110,
      min: -10,
      tickAmount: 12,
      labels: {
        formatter: function (val) {
          if (val === 0 || val === 100 || val === 50) {
            return val + ''
          } else {
            return ''
          }
        },
      },
    },
    xaxis: {
      labels: {
        rotate: -60,
      },
    },
  }

  return (
    <Stack spacing={3} sx={{ px: 1 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            User Info
          </Typography>
          <Typography variant="body1">{user.name}</Typography>
          <Typography
            color="text.secondary"
            component={'span'}
            variant="caption"
            gutterBottom
          >
            {_.upperFirst(user.profile?.status) || 'Inactive'} Status
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Chip clickable color="info" label={user.email || 'unknown'} />
          </Box>
        </CardContent>
        <CardActions>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              setShowLogs(!showLogs)
            }}
          >
            Log
          </Button>
          {/* <Button variant="outlined">Notes</Button> */}
        </CardActions>
      </Card>
      <Card>
        <Alert>
          <Typography
            sx={{
              fontSize: '12px !important',
            }}
          >
            Client :{' '}
            {
              // @ts-ignore
              user.client?.name
            }
          </Typography>
          <Typography
            sx={{
              fontSize: '12px !important',
            }}
          >
            Country :{' '}
            {
              // @ts-ignore
              user.country?.name
            }
          </Typography>
          <Typography
            sx={{
              fontSize: '12px !important',
            }}
          >
            Title : {user.profile?.title}
          </Typography>
          <Typography
            sx={{
              fontSize: '12px !important',
            }}
          >
            Monitoring Experience : {user.profile?.monitoring} year
          </Typography>
        </Alert>
      </Card>
      <Card sx={{ p: 1 }}>
        <Typography variant="subtitle2">Score Distribution</Typography>
        {userBaseline === undefined && userFollowups.length === 0 ? (
          <Box
            sx={{
              width: '100%',
              height: '250px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography>No Data Available.</Typography>
          </Box>
        ) : series.length === 0 ? (
          <Skeleton variant="rectangular" sx={{ height: '240px', mt: 0.5 }} />
        ) : (
          <div id="chart">
            <ReactApexChart
              options={options}
              series={series}
              type="boxPlot"
              height={250}
            />
          </div>
        )}
        {radarStatus === 0 ? null : (
          <DomainPerformance
            domains={domains}
            userBaseline={userBaseline}
            userFollowups={userFollowups}
            radarStatus={radarStatus}
            user={user}
          />
        )}
      </Card>
    </Stack>
  )
})

type DomainPerformanceProps = {
  userBaseline: UserSimulation
  userFollowups: UserSimulation[]
  domains: IDomain[]
  radarStatus: number
  user: any
}

const DomainPerformance = observer((props: DomainPerformanceProps) => {
  const { userBaseline, userFollowups, domains, radarStatus, user } = props
  const [series, setSeries] = useState([])
  useEffect(() => {
    ;(async () => {
      setSeries([])
      let bArr: number[] = []
      let fArr: number[] = []
      try {
        const bAvg = await axios.get(
          `/v3/dataDump/domainAvg/${userBaseline?.simulationId}/${user.profile.clientUnitId}`
        )
        domains.map((_domain) => {
          bArr.push(bAvg.data[_domain._id])
        })
        const fAvg = await axios.get(
          `/v3/dataDump/domainAvg/Followup/${user.profile.clientUnitId}`
        )
        domains.map((_domain) => {
          fArr.push(fAvg.data[_domain._id])
        })
        const params = {
          filter: {
            _id: userBaseline.simulationId,
          },
        }
        const simTitle = await axios.get('/v1/simulations', { params })
        const baselineScores = getChartSeriesData(
          userBaseline?.results?.scoreByMainDomain
        )
        let chartData: any = [
          {
            name: `${user.profile.lastName}: ${simTitle.data.name}`,
            // data: [34, 44, 32, 34, 55, 43, 58, 0],
            data: baselineScores,
          },

          {
            name: `Avg: ${simTitle.data.name}`,
            data: bArr,
          },
          {
            name: `Avg: Followups`,
            data: fArr,
          },
          // ...getFollowupSeries(),
        ]
        if (radarStatus === 2) {
          chartData.push({
            name: `${user.profile.lastName}: Followups`,
            // data: [34, 44, 32, 34, 55, 43, 58, 0],
            data: getFollowupSeries(baselineScores),
          })
        }
        setSeries(chartData)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [radarStatus])

  const getChartSeriesData = (scoreByDomains: ScoreByDomain[]) => {
    return domains.map((_domain) => {
      return (
        scoreByDomains?.find((_score) => _score.domainId === _domain._id)
          ?.score || 0
      )
    })
  }

  const getFollowupSeries: any = (baselineScores: any) => {
    let arr: any = []
    domains.map((_domain, index) => {
      const followup = userFollowups.find((el) => el.domainId === _domain._id)
      if (followup) {
        arr.push(
          followup?.results.scoreByMainDomain.find(
            (el) => el.domainId === _domain._id
          )?.score || 0
        )
      } else {
        arr.push(baselineScores[index])
      }
    })
    return arr
  }

  var options = {
    chart: {
      height: 350,
      type: 'radar',
    },
    // title: {
    //   text: 'Domain Performance',
    // },
    xaxis: {
      categories: domains.map((domain) => {
        if (domain.name.length > 20) {
          const half = Math.floor(domain.name.length / 2)
          const firstHalf = domain.name.slice(0, half)
          const secondHalf = domain.name.slice(half)
          return [firstHalf, secondHalf]
        } else {
          return domain.name
        }
      }),
      labels: {
        style: {
          fontSize: '8px',
        },
      },
    },
    yaxis: {
      max: 100,
      min: 0,
      tickAmount: 2,
      labels: {
        formatter: function (val: number) {
          if (val === 100 || val === 50) {
            return val + ''
          } else {
            return ''
          }
        },
      },
    },
  }

  return (
    <Card
      sx={{
        p: 0.5,
        mt: 1,
      }}
    >
      <Typography variant="subtitle2">Domain Performance</Typography>
      {series.length === 0 ? (
        <Skeleton variant="rectangular" sx={{ height: '320px', mt: 0.5 }} />
      ) : (
        <ReactApexChart
          type="radar"
          // @ts-ignore
          options={options}
          series={series}
          height={320}
        />
      )}
    </Card>
  )
})
