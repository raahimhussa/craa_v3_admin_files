import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import IUser, { LocalUser } from 'src/models/user/user.interface'
import { useEffect, useState } from 'react'

import ApexCharts from 'apexcharts'
import { ApexOptions } from 'apexcharts'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Folder from 'src/models/folder'
import IDomain from 'src/models/domain/domain.interface'
import Log from 'src/models/log'
import Rainbow from 'rainbowvis.js'
import ReactApexChart from 'react-apexcharts'
import { ScoreByDomain } from 'src/models/userSimulation/userSimulation.interface'
import SimDoc from 'src/models/simDoc'
import UserSimulation from 'src/models/userSimulation'
import { UserSimulationStatus } from 'src/utils/status'
import Viewport from 'src/models/viewport'
import _ from 'lodash'
import axios from 'axios'
import moment from 'moment'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

type UserInfoProps = {
  user: IUser & LocalUser
  userSimulation: UserSimulation
  domains: IDomain[]
  radarStatus: number
  folders: Folder[]
  logs: Log[]
  setIsLoading: any
  isLoading: boolean
  setExportData: any
  isFolder: boolean
  isTimeline: boolean
}

export default observer((props: UserInfoProps) => {
  const {
    user,
    domains,
    userSimulation,
    folders,
    logs,
    setIsLoading,
    isLoading,
    setExportData,
    isFolder,
    isTimeline,
  } = props
  console.log(folders)
  const { userSimulationStore, simDocStore, folderStore } = useRootStore()
  const [simDocs, setSimDocs] = useState<Array<SimDoc>>([])
  const [subFolders, setSubFolders] = useState<Array<Folder>>([])
  const [data, setData] = useState<any>({})
  const [docSeries, setDocSeries] = useState<any>({})
  const [docTimes, setDocTimes] = useState<any>({})
  const [folderData, setFolderData] = useState<any>({})
  const [docCnt, setDocCnt] = useState<any>({})
  const [docColors, setDocColors] = useState<any>({})
  const [docChartColors, setDocChartColors] = useState<any>([])
  const [expanded, setExpanded] = useState<string | false>(false)
  const [subExpanded, setSubExpanded] = useState<string | false>(false)
  // const colors = [
  //   'red',
  //   'orange',
  //   'green',
  //   'blue',
  //   'purple',
  //   'yellow',
  //   'black',
  //   'brown',
  //   'darkBlue',
  //   'dardRed',
  //   'darkGreen',
  // ]

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }
  const handleChangeSub =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setSubExpanded(isExpanded ? panel : false)
    }

  async function getSimdocs() {
    const subFolder = await folderStore.folderRepository.find({
      filter: {
        folderId: {
          //@ts-ignore
          $in: userSimulation?.simulation?.folderIds,
        },
        isDeleted: false,
      },
    })
    setSubFolders(subFolder)
    const subFolderIds = subFolder?.map((folder: any) => folder._id) || []
    const totalFolderIds = [
      //@ts-ignore
      ...userSimulation?.simulation?.folderIds,
      ...subFolderIds,
    ]
    const { data } = await simDocStore.simDocRepository.find({
      filter: {
        isDeleted: false,
        folderId: {
          $in: totalFolderIds,
        },
      },
      options: {
        multi: true,
      },
    })
    setSimDocs(data)
  }

  function getData() {
    let obj: any = {}
    let folderobj: any = {}
    let folderobj2: any = {}
    let docCnt: any = {}
    let docTimes: any = {}

    // 전체 문서를 돌면서
    simDocs.map((simDoc) => {
      let data: number[] = []
      let arr: number[] = []
      let datawithV: any = [[], [], []]
      let arrwithV: any = [[], [], []]
      // //각 로그와 비교
      logs.map((log, index) => {
        //해당 로그가 가지고 있는 심독(즉 보고 있는 심독)
        const simdocIds =
          log.viewports?.map((viewport: any) => viewport.simDoc?._id) || []
        // const currentVI = simdocIds.indexOf(simDoc._id)
        let currentVI: any = []
        simdocIds.forEach((id, i) => {
          if (simDoc._id === id) {
            currentVI.push(i)
          }
        })
        //만약 보고있는 심독 리스트에 해당 심독이 있다면 보고있는걸로 간주(배열에 해당 로그 시간 추가)
        if (simdocIds.includes(simDoc._id)) {
          arr.push(log.duration)
          currentVI.forEach((index: any) => {
            arrwithV[index].push(log.duration)
          })
          //심독 리스트에 해당 심독이 없다면 닫았거나 더이상 보지 않는걸로 간주
          // (쌓여있던 시간들을 마지막 시간 - 처음 시간) 즉 총 본 시간을 구한 뒤 데이터에 push 한 후 배열 리셋
        } else {
          const simdocIds =
            logs[index - 1]?.viewports?.map(
              (viewport: any) => viewport.simDoc?._id
            ) || []
          // const prevVI = simdocIds.indexOf(simDoc._id)
          let prevVI: any = []
          simdocIds.forEach((id, i) => {
            if (simDoc._id === id) {
              prevVI.push(i)
            }
          })
          arr.push(log.duration)
          // if (prevVI !== -1) {
          //   arrwithV[prevVI].push(log.duration)
          // }
          prevVI.forEach((index: any) => {
            arrwithV[index].push(log.duration)
          })
          if (arr.length !== 0) {
            data.push(arr[arr.length - 1] - arr[0])
          }
          for (let i = 0; i < 3; i++) {
            if (arrwithV[i].length !== 0) {
              // datawithV[i].push(
              //   arrwithV[i][arrwithV[i].length - 1] - arrwithV[i][0]
              // )
              datawithV[i].push([
                arrwithV[i][0],
                arrwithV[i][arrwithV[i].length - 1],
              ])
            }
          }
          arr = []
          arrwithV[0] = []
          arrwithV[1] = []
          arrwithV[2] = []
        }
      })
      // 로그 데이터를 다 확인 한 후 처음부터 끝까지 계속 본 심독이 있을 경우 data에 push 하는 과정을 못만났을 수도 있기 때문에 아직 담겨있는 데이터가 있다면 추가
      if (arr.length !== 0) {
        data.push(arr[arr.length - 1] - arr[0])
      }
      for (let i = 0; i < 3; i++) {
        if (arrwithV[i].length !== 0) {
          // datawithV[i].push(
          //   arrwithV[i][arrwithV[i].length - 1] - arrwithV[i][0]
          // )
          datawithV[i].push([
            arrwithV[i][0],
            arrwithV[i][arrwithV[i].length - 1],
          ])
        }
      }
      // 해당 document가 본 시간을 모두 더해서 obj에 저장
      obj[simDoc._id] = data.reduce((a, b) => a + b, 0)
      docTimes[simDoc.title] = [[], [], []]
      for (let i = 0; i < 3; i++) {
        docTimes[simDoc.title][i] = datawithV[i]
        // objWithV[i][simDoc._id] = datawithV[i].reduce(
        //   (a: any, b: any) => a + b,
        //   0
        // )
      }
      setDocTimes(docTimes)

      // simDoc이 가지고 있는 folderId로 folderobj에 데이터 추가
      if (folderobj[simDoc?.folderId!] == undefined) {
        folderobj[simDoc?.folderId!] = []
      }
      folderobj[simDoc?.folderId!].push(obj[simDoc._id])
      setData({ ...data, ...obj })
    })

    //sub folder아래 속한 doc 개수 구하기
    Object.keys(folderobj).map((key) => {
      // docCnt[key] = folderobj[key].length
      let arr: any = []
      simDocs.map((sim) => {
        if (sim.folderId === key) {
          arr.push(sim.title)
        }
      })
      docCnt[key] = arr
    })

    //서브 폴더가 가지고 있는 folderId로 folderobj2에 데이터 추가
    subFolders.map((folder: any) => {
      Object.keys(folderobj).map((key: any) => {
        if (folder._id === key) {
          if (
            folderobj2[folder.folderId] == undefined ||
            docCnt[folder.folderId] == undefined
          ) {
            folderobj2[folder.folderId] = []
            docCnt[folder.folderId] = []
          }
          folderobj2[folder.folderId].push(
            folderobj[key].reduce((a: any, b: any) => a + b, 0)
          )

          //해당 폴터 아래 속한 폴더의 doc개수도 추가
          docCnt[folder.folderId].push(docCnt[key])
        }
      })
    })
    let colObj: any = {}
    folders.map((folder, index) => {
      let numOfItems = 0
      if (docCnt[folder._id] !== undefined) {
        Array.isArray(docCnt[folder._id][0])
          ? docCnt[folder._id].map((arr: any) => {
              numOfItems += arr.length
            })
          : (numOfItems = docCnt[folder._id].length)
      }

      if (numOfItems > 0) {
        // let folderColor = colors[index]
        //@ts-ignore
        let folderColor = folder.color
        let rainbow = new Rainbow()
        rainbow.setNumberRange(1, numOfItems + 1)
        rainbow.setSpectrum(folderColor, 'white')
        let arr: any = []
        for (var i = 1; i <= numOfItems; i++) {
          var hexColour = rainbow.colourAt(i)
          arr.push('#' + hexColour)
        }
        colObj[folder._id] = arr
        let cnt = 0
        docCnt[folder._id].map((el: any, i: any) => {
          if (Array.isArray(el)) {
            el.map((doc) => {
              colObj[doc] = arr[cnt]
              cnt++
            })
          } else {
            colObj[el] = arr[i]
          }
        })
      }
    })
    setDocColors(colObj)
    setDocCnt(docCnt)
    setFolderData({ ...folderobj, ...folderobj2 })
    if (Object.keys(folderobj).length !== 0) {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getSimdocs()
  }, [])

  useEffect(() => {
    getData()
  }, [simDocs])

  useEffect(() => {
    let series: any = []
    let colors: any = []
    Object.keys(docTimes).map((doc) => {
      colors.push(docColors[doc])
      let v1: any = []
      let v2: any = []
      let v3: any = []
      docTimes[doc][0].map((el: any) => {
        v1.push({
          x: 'viewport 1',
          y: [el[0] * 1000, el[1] * 1000],
        })
      })
      docTimes[doc][1].map((el: any) => {
        v2.push({
          x: 'viewport 2',
          y: [el[0] * 1000, el[1] * 1000],
        })
      })
      docTimes[doc][2].map((el: any) => {
        v3.push({
          x: 'viewport 3',
          y: [el[0] * 1000, el[1] * 1000],
        })
      })
      v1.push({
        x: 'viewport 1',
        y: [0, 0],
      })
      v2.push({
        x: 'viewport 2',
        y: [0, 0],
      })
      v3.push({
        x: 'viewport 3',
        y: [0, 0],
      })
      series.push({
        name: doc,
        data: [...v1, ...v2, ...v3],
      })
    })
    const groupedData = _.groupBy(
      series.flatMap((doc: any) =>
        doc.data.map((d: any) => ({ ...d, docName: doc.name }))
      ),
      'x'
    )

    const groupedAndSortedData = _.mapValues(groupedData, (value) =>
      _.sortBy(
        value,
        (x) => x.y[0],
        (a, b) => b - a
      )
    )
    const filteredData = _.mapValues(groupedAndSortedData, (value) =>
      _.reject(value, (x) => x.y[0] === 0)
    )

    setDocSeries(series)
    setExportData(filteredData)
    setDocChartColors(colors)
  }, [docTimes])

  const options: any = {
    label: {
      show: true,
      formatter: (val: any) => {
        return new Date(val)
      },
    },
    chart: {
      height: 300,
      type: 'rangeBar',
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '90%',
        rangeBarGroupRows: true,
      },
    },
    colors: docChartColors,
    fill: {
      type: 'solid',
    },
    xaxis: {
      type: 'datetime',
      min: 0,
      max: userSimulation.usageTime * 1000,
    },
    legend: {
      show: false,
      position: 'bottom',
    },
    tooltip: {
      enabled: true,
      custom: function (opts: any) {
        var data =
          opts.w.globals.initialSeries[opts.seriesIndex].data[
            opts.dataPointIndex
          ]
        const start = moment
          //@ts-ignore
          .utc(opts.y1)
          .format('HH:mm:ss')
        const end = moment
          //@ts-ignore
          .utc(opts.y2)
          .format('HH:mm:ss')
        const title = opts.w.globals.seriesNames[opts.seriesIndex]
        const total = moment
          //@ts-ignore
          .utc(opts.y2 - opts.y1)
          .format('HH:mm:ss')
        return `<div style="width: 125px; height: 60px; text-align:center">
        <p style="font-size:12px; color:black;font-weight:600;background-color:#f2f2f2">${title}</p>
        <p style="font-size:11px;margin-top:0.1rem">${start} to ${end}</p>
        <p style="font-size:11px">Total : ${total}</p>
        </div>`
      },
    },
  }

  return (
    <>
      {isFolder ? (
        <Stack spacing={3} sx={{ px: 1, width: '60%' }}>
          {isLoading ? (
            <Skeleton variant="rectangular" width={'100%'} height={300} />
          ) : (
            <Card>
              {/* <CardHeader title="Folders" /> */}
              <CardContent>
                {folders.map((folder, index) => {
                  let lastI = 0
                  if (folderData[folder._id] !== undefined) {
                    return (
                      <Accordion
                        expanded={expanded === `panel${index}`}
                        onChange={handleChange(`panel${index}`)}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1bh-content"
                          id="panel1bh-header"
                          sx={{
                            bgcolor: '#f2f2f2 !important',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              width: '100%',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Typography
                              sx={{
                                flexShrink: 0,
                                fontSize: '13px',
                                width: '60%',
                              }}
                            >
                              {folder.name}
                            </Typography>
                            <Box
                              sx={{
                                height: '10px',
                                width: '45px',
                                bgcolor:
                                  docColors[folder._id] !== undefined
                                    ? docColors[folder._id][0]
                                    : '',
                              }}
                            ></Box>
                            <Typography
                              sx={{
                                flexShrink: 0,
                                fontSize: '13px',
                                width: '60px',
                                textAlign: 'right',
                              }}
                            >
                              {moment
                                //@ts-ignore
                                .utc(
                                  folderData[folder._id]?.reduce(
                                    (a: any, b: any) => a + b,
                                    0
                                  ) * 1000
                                )
                                .format('HH:mm:ss')}
                            </Typography>
                            <Typography
                              sx={{
                                flexShrink: 0,
                                fontSize: '13px',
                                mr: 2,
                                width: '40px',
                                textAlign: 'right',
                              }}
                            >
                              {`${(
                                (folderData[folder._id]?.reduce(
                                  (a: any, b: any) => a + b,
                                  0
                                ) /
                                  userSimulation.usageTime) *
                                100
                              ).toFixed(1)}%`}
                            </Typography>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          {subFolders.map((sub, subi) => {
                            if (
                              sub.folderId === folder._id &&
                              folderData[sub._id] !== undefined
                            ) {
                              return (
                                <Accordion
                                  expanded={subExpanded === `subpanel${subi}`}
                                  onChange={handleChangeSub(`subpanel${subi}`)}
                                >
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                    sx={{
                                      bgcolor:
                                        'rgb(242, 242, 242,0.6) !important',
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '100%',
                                        justifyContent: 'space-between',
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          flexShrink: 0,
                                          fontSize: '13px',
                                          width: '60%',
                                        }}
                                      >
                                        {sub.name}
                                      </Typography>
                                      <Box
                                        sx={{
                                          height: '10px',
                                          width: '45px',
                                          // bgcolor: 'violet',
                                        }}
                                      ></Box>
                                      <Typography
                                        sx={{
                                          flexShrink: 0,
                                          fontSize: '13px',
                                          width: '60px',
                                          textAlign: 'right',
                                        }}
                                      >
                                        {moment
                                          //@ts-ignore
                                          .utc(
                                            folderData[sub._id]?.reduce(
                                              (a: any, b: any) => a + b,
                                              0
                                            ) * 1000
                                          )
                                          .format('HH:mm:ss')}
                                      </Typography>
                                      <Typography
                                        sx={{
                                          flexShrink: 0,
                                          fontSize: '13px',
                                          mr: 2,
                                          width: '40px',
                                          textAlign: 'right',
                                        }}
                                      >
                                        {`${(
                                          (folderData[sub._id]?.reduce(
                                            (a: any, b: any) => a + b,
                                            0
                                          ) /
                                            userSimulation.usageTime) *
                                          100
                                        ).toFixed(1)}%`}
                                      </Typography>
                                    </Box>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    {simDocs.map((simdoc, simI) => {
                                      if (simdoc.folderId === sub._id) {
                                        lastI += 1
                                        return (
                                          <Box
                                            sx={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'space-between',
                                              pr: 2,
                                              mb: 0.3,
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: '60%',
                                              }}
                                            >
                                              <Box
                                                sx={{
                                                  width: '12px',
                                                  height: '12px',
                                                  bgcolor:
                                                    docColors[folder._id] !==
                                                    undefined
                                                      ? docColors[folder._id][
                                                          lastI - 1
                                                        ]
                                                      : '',
                                                  mr: 1,
                                                }}
                                              ></Box>
                                              <Typography
                                                sx={{
                                                  flexShrink: 0,
                                                  fontSize: '13px',
                                                }}
                                              >
                                                {simdoc.title}
                                              </Typography>
                                            </Box>
                                            <Box
                                              sx={{
                                                height: '10px',
                                                width: '45px',
                                              }}
                                            ></Box>
                                            <Typography
                                              sx={{
                                                flexShrink: 0,
                                                fontSize: '13px',
                                                width: '60px',
                                                textAlign: 'right',
                                              }}
                                            >
                                              {moment
                                                //@ts-ignore
                                                .utc(data[simdoc._id] * 1000)
                                                .format('HH:mm:ss')}
                                            </Typography>
                                            <Typography
                                              sx={{
                                                flexShrink: 0,
                                                fontSize: '13px',
                                                mr: 2,
                                                width: '40px',
                                                textAlign: 'right',
                                              }}
                                            >
                                              {`${
                                                //@ts-ignore
                                                (
                                                  (data[simdoc._id] /
                                                    userSimulation.usageTime) *
                                                  100
                                                ).toFixed(1)
                                              }%`}
                                            </Typography>
                                          </Box>
                                        )
                                      }
                                    })}
                                  </AccordionDetails>
                                </Accordion>
                              )
                            }
                          })}
                          {simDocs.map((simdoc) => {
                            if (simdoc.folderId === folder._id) {
                              lastI += 1
                              return (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    pr: 2,
                                    mb: 0.3,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      width: '60%',
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        width: '12px',
                                        height: '12px',
                                        bgcolor:
                                          docColors[folder._id] !== undefined
                                            ? docColors[folder._id][lastI - 1]
                                            : '',
                                        mr: 1,
                                      }}
                                    ></Box>
                                    <Typography
                                      sx={{
                                        flexShrink: 0,
                                        fontSize: '13px',
                                      }}
                                    >
                                      {simdoc.title}
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      height: '10px',
                                      width: '45px',
                                    }}
                                  ></Box>
                                  <Typography
                                    sx={{
                                      flexShrink: 0,
                                      fontSize: '13px',
                                      width: '60px',
                                      textAlign: 'right',
                                    }}
                                  >
                                    {moment
                                      //@ts-ignore
                                      .utc(data[simdoc._id] * 1000)
                                      .format('HH:mm:ss')}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      flexShrink: 0,
                                      fontSize: '13px',
                                      mr: 2,
                                      width: '40px',
                                      textAlign: 'right',
                                    }}
                                  >
                                    {`${
                                      //@ts-ignore
                                      (
                                        (data[simdoc._id] /
                                          userSimulation.usageTime) *
                                        100
                                      ).toFixed(1)
                                    }%`}
                                  </Typography>
                                </Box>
                              )
                            }
                          })}
                        </AccordionDetails>
                      </Accordion>
                    )
                  }
                })}
              </CardContent>
            </Card>
          )}
        </Stack>
      ) : (
        <></>
      )}
      {isTimeline ? (
        <Stack spacing={3} sx={{ px: 1, width: '100%' }}>
          {isLoading ? (
            <Skeleton variant="rectangular" width={'100%'} height={250} />
          ) : (
            <Card>
              <ReactApexChart
                options={options}
                series={docSeries}
                type="rangeBar"
                height={280}
              />
            </Card>
          )}
        </Stack>
      ) : (
        <></>
      )}
    </>
  )
})
