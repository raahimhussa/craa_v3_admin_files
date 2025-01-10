import {} from '@mui/material'

import React, { useEffect, useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import { ApexOptions } from 'apexcharts'
import Domain from 'src/models/domain'
import IconButton from '@mui/material/IconButton'
import ReactApexChart from 'react-apexcharts'
import RemoveIcon from '@mui/icons-material/Remove'
import SearchInput from 'src/ui/core/components/SearchInput/SearchInput'
import axios from 'axios'
import { matchSorter } from 'match-sorter'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

type Props = {
  domains: Domain[]
}

function BoxPlotView({ domains }: Props) {
  const data = {
    series: [
      {
        type: 'boxPlot',
        data: [
          {
            x: 'Baseline',
            y: [0, 35, 49, 62, 98],
          },
          {
            x: `Followup 1 - ${
              domains.find((_domain) => _domain.visibleId === 1)?.name
            }`,
            y: [0, 25, 49, 62, 99],
          },
          {
            x: `Followup 1 - ${
              domains.find((_domain) => _domain.visibleId === 2)?.name
            }`,
            y: [0, 45, 61, 78, 99],
          },
          {
            x: `Followup 1 - ${
              domains.find((_domain) => _domain.visibleId === 6)?.name
            }`,
            y: [27, 73, 88, 99, 99],
          },
          {
            x: `Followup 1 - ${
              domains.find((_domain) => _domain.visibleId === 8)?.name
            }`,
            y: [0, 50, 77, 88, 99],
          },
          {
            x: `Followup 1 - ${
              domains.find((_domain) => _domain.visibleId === 11)?.name
            }`,
            y: [0, 38, 62, 81, 99],
          },
        ],
      },
      // {
      //   type: 'scatter',
      //   data: [
      //     { x: 'Followup 3 - The Informed Consent Process', y: 0 },
      //     {
      //       x: 'Followup 3 - The Informed Consent Process',
      //       y: 40,
      //     },
      //   ],
      // },
    ],
  }
  const options: ApexOptions = {
    chart: {
      type: 'boxPlot',
      height: 350,
    },
    title: {
      text: 'Simulation Score Distribution',
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
    xaxis: {
      type: 'category',
      labels: {
        maxHeight: 330,
        rotate: -50,
      },
    },
  }

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={data.series}
        type="boxPlot"
        height={580}
        width={850}
      />
    </div>
  )
}
export default observer(BoxPlotView)
