import SearchInput from 'src/ui/core/components/SearchInput/SearchInput'
import {} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { matchSorter } from 'match-sorter'
import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import { useRootStore } from 'src/stores'
import axios from 'axios'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

function TimelineView() {
  const data = {
    series: [
      {
        name: 'Study Logs',
        data: [
          {
            x: 'Viewport 1',
            y: [0, 3],
          },
          {
            x: 'Viewport 1',
            y: [5, 22],
          },
          {
            x: 'Viewport 1',
            y: [36, 49],
          },
          {
            x: 'Viewport 1',
            y: [50, 80],
          },
        ],
      },
      {
        name: 'IEC Documents',
        data: [
          {
            x: 'Viewport 1',
            y: [3, 5],
          },
          {
            x: 'Viewport 1',
            y: [22, 36],
          },
        ],
      },
      {
        name: 'Study Logs',
        data: [
          {
            x: 'Viewport 2',
            y: [0, 10],
          },
          {
            x: 'Viewport 2',
            y: [26, 30],
          },
          {
            x: 'Viewport 2',
            y: [42, 49],
          },
          {
            x: 'Viewport 2',
            y: [50, 80],
          },
        ],
      },
      {
        name: 'IEC Documents',
        data: [
          {
            x: 'Viewport 2',
            y: [10, 26],
          },
          {
            x: 'Viewport 2',
            y: [30, 42],
          },
        ],
      },
      {
        name: 'Study Logs',
        data: [
          {
            x: 'Viewport 3',
            y: [0, 15],
          },
          {
            x: 'Viewport 3',
            y: [18, 30],
          },
          {
            x: 'Viewport 3',
            y: [39, 49],
          },
          {
            x: 'Viewport 3',
            y: [50, 80],
          },
        ],
      },
      {
        name: 'IEC Documents',
        data: [
          {
            x: 'Viewport 3',
            y: [15, 18],
          },
          {
            x: 'Viewport 3',
            y: [30, 39],
          },
        ],
      },
      {
        name: 'Study Logs',
        data: [
          {
            x: 'Viewport 4',
            y: [0, 3],
          },
          {
            x: 'Viewport 4',
            y: [5, 22],
          },
          {
            x: 'Viewport 4',
            y: [36, 49],
          },
          {
            x: 'Viewport 4',
            y: [50, 80],
          },
        ],
      },
      {
        name: 'IEC Documents',
        data: [
          {
            x: 'Viewport 4',
            y: [3, 5],
          },
          {
            x: 'Viewport 4',
            y: [22, 36],
          },
        ],
      },
    ],
  }
  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'rangeBar',
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '85%',
        rangeBarGroupRows: true,
      },
    },
    colors: ['#ffa500', '#800080'],
    fill: {
      type: 'solid',
    },
    yaxis: {
      labels: {
        offsetX: 1,
      },
    },
    xaxis: {
      min: 0,
      max: 80,
      tickAmount: 8,
      labels: {
        formatter: function (val: any) {
          if (val == 60) {
            return '1h'
          } else if (val > 60) {
            return val - 60
          } else {
            return val
          }
        },
      },
    },
    legend: {
      show: false,
    },
  }

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={data.series}
        type="rangeBar"
        height={350}
        width={'100%'}
      />
    </div>
  )
}
export default observer(TimelineView)
