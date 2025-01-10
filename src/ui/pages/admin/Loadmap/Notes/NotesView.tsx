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
import { useEffect, useRef, useState } from 'react'

import ApexCharts from 'apexcharts'
import ClearIcon from '@mui/icons-material/Clear'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Folder from 'src/models/folder'
import IDomain from 'src/models/domain/domain.interface'
import { INote } from 'src/models/note/note.interface'
import Log from 'src/models/log'
import Rainbow from 'rainbowvis.js'
import ReactApexChart from 'react-apexcharts'
import { ScoreByDomain } from 'src/models/userSimulation/userSimulation.interface'
import SimDoc from 'src/models/simDoc'
import UserSimulation from 'src/models/userSimulation'
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
  selectedNote: INote
  setSelectedNote: any
  notes: any
  screenRecorders: any
}

export default observer((props: UserInfoProps) => {
  const { logs, userSimulation, isLoading, selectedNote, screenRecorders } =
    props
  const { screenRecorderStore } = useRootStore()
  const [show, setShow] = useState({
    isShow: false,
    width: 0,
    log: {
      note: { type: {}, viewport: { index: 0 }, text: '' },
      viewports: [[], [], []],
    },
  })
  const [series, setSeries] = useState<any[]>([])
  const [add, setAdd] = useState<any[]>([])
  const [editArr, setEditArr] = useState<any[]>([])
  const [compliance, setCompliance] = useState<any[]>([])
  const [notes, setNotes] = useState<any>({
    add: [],
    save: [],
    compliance: [],
    delete: [],
  })
  const chartContainer = useRef(null)

  useEffect(() => {
    const noteLogs = logs.filter(
      (log: any) =>
        log.event === 'saveNote' ||
        log.event === 'addNote' ||
        log.event === 'deleteNote'
    )
    let arr: any = []
    let deleteArr: any = []
    let addArr: any = []
    let compianceArr: any = []
    let saveArr: any = []
    let noteArr: any = { add: [], save: [], compliance: [], delete: [] }
    noteLogs.map((log: any) => {
      if (log.event === 'deleteNote') {
        deleteArr.push([
          log.duration * 1000,
          log.note.viewport.index == 0
            ? 3
            : log.note.viewport.index == 1
            ? 2
            : 1,
          log.note._id,
        ])
        noteArr['delete'].push(log)
      } else if (log.event === 'addNote') {
        if (log.note.type === 'monitoring') {
          addArr.push([
            log.duration * 1000,
            log.note.viewport.index == 0
              ? 3
              : log.note.viewport.index == 1
              ? 2
              : 1,
            log.note._id,
          ])
          noteArr['add'].push(log)
        } else {
          compianceArr.push([
            log.duration * 1000,
            log.note.viewport.index == 0
              ? 3
              : log.note.viewport.index == 1
              ? 2
              : 1,
            log.note._id,
          ])
          noteArr['compliance'].push(log)
        }
      } else if (log.event === 'saveNote') {
        saveArr.push([
          log.duration * 1000,
          log.note.viewport.index == 0
            ? 3
            : log.note.viewport.index == 1
            ? 2
            : 1,
          log.note._id,
        ])
        noteArr['save'].push(log)
      }
    })
    arr.push({
      name: 'add',
      data: addArr,
    })
    arr.push({
      name: 'save',
      data: saveArr,
    })
    arr.push({
      name: 'compliance',
      data: compianceArr,
    })
    arr.push({
      name: 'delete',
      data: deleteArr,
    })
    setSeries(arr)
    setNotes(noteArr)
  }, [])

  useEffect(() => {
    try {
      const points = document.querySelectorAll('.select-note')
      // console.log(points)
      for (let index = 0; index < points.length; index++) {
        points[index].classList.remove('select-note')
      }
      console.log(document.getElementsByClassName('select-note'))
      const point = document.getElementsByClassName(selectedNote?._id + '')
      // console.log(point)
      for (let index = 0; index < point.length; index++) {
        point[index].classList.add('select-note')
      }
    } catch (error) {
      console.log(error)
    }
  }, [selectedNote])

  let options: any = {
    chart: {
      height: 350,
      type: 'scatter',
      zoom: {
        enabled: false,
        type: 'xy',
      },
      events: {
        mounted: async function (chartContext: any, config: any) {
          try {
            const points =
              //@ts-ignore
              chartContainer?.current?.chart?.w.globals.dom.Paper.select(
                '.apexcharts-marker'
              ).members
            let addArr = []
            let arr = []
            let complianceArr = []
            for (let i = 0; i < points?.length; i++) {
              // if (points[i]?.node.getAttribute('r') == '0') {
              const index = points[i]?.node.getAttribute('index')
              if (index == '0') {
                addArr.push(i)
              } else if (index == '1') {
                arr.push(i)
              } else if (index == '2') {
                complianceArr.push(i)
              }
              // }
            }
          } catch (error) {
            console.log(error)
          }
        },
        updated: function (chartContext: any, config: any) {
          try {
            const points =
              //@ts-ignore
              chartContainer?.current?.chart?.w.globals.dom.Paper.select(
                '.apexcharts-marker'
              ).members
            let addArr = []
            let editArr = []
            let complianceArr = []
            for (let i = 0; i < points?.length; i++) {
              console.log(points[i]?.node)
              if (points[i]?.node.getAttribute('r') == '6') {
                const index = points[i]?.node.getAttribute('index')
                if (index == '0') {
                  addArr.push(i)
                } else if (index == '1') {
                  editArr.push(i)
                } else if (index == '2') {
                  complianceArr.push(i)
                }
              }
            }
            addArr.map((el, index) => {
              if (series[0].data[index]) {
                points[el].node.classList.add(series[0].data[index][2])
                // el.setAttribute('noteId', series[0]?.data[index][2])
              }
            })
            editArr.map((el, index) => {
              if (series[1].data[index]) {
                points[el].node.classList.add(series[1].data[index][2])
                // el.setAttribute('noteId', series[1]?.data[index][2])
              }
            })
            compliance.map((el, index) => {
              if (series[2].data[index]) {
                points[el].node.classList.add(series[2].data[index][2])
                // el.setAttribute('noteId', series[2]?.data[index][2])
              }
            })
          } catch (error) {
            console.log(error)
          }
        },
        dataPointMouseEnter: function (
          event: any,
          chartContext: any,
          config: any
        ) {
          var boundingRect =
            chartContext.w.globals.dom.baseEl.getBoundingClientRect()
          var x = event.clientX - boundingRect.left
          var y = event.clientY - boundingRect.top
          const typeArr: any = ['add', 'save', 'compliance', 'delete']
          const type = typeArr[config.seriesIndex]
          //@ts-ignore
          const duration = notes[type][config.dataPointIndex]?.duration
          setShow({
            isShow: true,
            // width: duration * 1000,
            width: x,
            //@ts-ignore
            log: notes[type][config.dataPointIndex],
          })
        },
        dataPointSelection: function (
          event: any,
          chartContext: any,
          config: any
        ) {
          const typeArr: any = ['add', 'save', 'compliance', 'delete']
          const type = typeArr[config.seriesIndex]
          //@ts-ignore
          const duration = notes[type][config.dataPointIndex]?.duration
          //@ts-ignore
          const recordId = notes[type][config.dataPointIndex]?.recordId
          screenRecorderStore.recordId = recordId
          screenRecorderStore
            .checkFileExists(
              //@ts-ignore
              `${userSimulation._id}_${recordId}`
            )
            .then((res) => {
              //@ts-ignore
              // setIsExist(res.data)
              screenRecorderStore.isExist = res.data
              // setIsExist(false)
            })
          const index = screenRecorders[0].recorders.findIndex(
            (record: any) => record.info.recordId === recordId
          )
          const start =
            index === 0
              ? 0
              : screenRecorders[0].recorders[index - 1]?.info?.startSec
          screenRecorderStore.play(duration, start)
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      type: 'datetime',
      min: 0,
      max: userSimulation.usageTime * 1000,
      labels: {
        show: false,
        hideOverlappingLabels: true,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      max: 3,
      min: 1,
      tickAmount: 3,
      labels: {
        show: false,
      },
    },
    colors: ['#0099ff', 'rgb(255, 153, 0)', '#00ffff', '#ff3300'],
    tooltip: {
      enabled: false,
    },
  }

  const boxRef: any = useRef(null)

  document.addEventListener('click', (event) => {
    if (boxRef.current && !boxRef.current.contains(event.target)) {
      //@ts-ignore
      setShow({ isShow: false, width: 0, log: {} })
    }
  })

  return (
    <>
      {isLoading ? (
        <Skeleton variant="rectangular" width={'100%'} height={80} />
      ) : (
        <Box sx={{ position: 'relative' }}>
          <Stack
            spacing={3}
            sx={{ px: 1, width: '100%', position: 'relative' }}
          >
            <Card
              sx={{
                pl: '3.4rem',
                position: 'relative',
              }}
            >
              <Typography
                sx={{
                  position: 'absolute',
                  top: 20,
                  left: 15,
                  fontSize: '11px',
                }}
              >
                Viewport 1
              </Typography>
              <Typography
                sx={{
                  position: 'absolute',
                  top: 39,
                  left: 15,
                  fontSize: '11px',
                }}
              >
                Viewport 2
              </Typography>
              <Typography
                sx={{
                  position: 'absolute',
                  top: 57,
                  left: 15,
                  fontSize: '11px',
                }}
              >
                Viewport 3
              </Typography>
              {/* <div id="chart"> */}
              <ReactApexChart
                options={options}
                series={series}
                type="scatter"
                height={80}
                ref={chartContainer}
              />
              {/* </div> */}
            </Card>
            {show.isShow ? (
              <Box
                ref={boxRef}
                className="tooltip"
                sx={{
                  position: 'absolute',
                  bottom: -200,
                  bgcolor: '#484848',
                  borderRadius: '6px',
                  p: 1,
                  height: '200px',
                  width: '400px',
                  // left: `${
                  //   (show.width / (userSimulation.usageTime * 1000)) * 100
                  // }%`,
                  left: `${show.width - 148}px`,
                }}
              >
                <Button
                  sx={{
                    position: 'absolute',
                    p: '0 !important',
                    right: 6,
                    minWidth: '20px',
                    height: '20px !important',
                  }}
                  onClick={() => {
                    //@ts-ignore
                    setShow({ isShow: false, width: 0, log: {} })
                  }}
                >
                  <ClearIcon
                    sx={{
                      fontSize: 17,
                    }}
                  />
                </Button>
                <Typography>
                  <span>Action : </span> {show.log?.note.type} note on VP
                  {show.log?.note.viewport.index + 1}
                </Typography>
                <Typography>
                  <span>VP1 : </span>
                  {/* @ts-ignore */}
                  {show.log.viewports[0].simDoc?.title}
                </Typography>
                <Typography>
                  <span>VP2 : </span>
                  {/* @ts-ignore */}
                  {show.log.viewports[1].simDoc?.title}
                </Typography>
                <Typography>
                  <span>VP3 : </span>
                  {/* @ts-ignore */}
                  {show.log.viewports[2].simDoc?.title}
                </Typography>
                <Typography>
                  <span>Page :</span> {/* @ts-ignore */}
                  {show.log.note.viewport.simDoc?.currentPage + 1}
                </Typography>
                <Typography
                  sx={{
                    width: '100%',
                    wordBreak: 'break-word',
                  }}
                >
                  <span>Note : </span>
                  {show.log.note.text}
                </Typography>
              </Box>
            ) : (
              <></>
            )}
          </Stack>
        </Box>
      )}
    </>
  )
})
