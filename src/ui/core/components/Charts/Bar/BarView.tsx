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

function BarView() {
  const data = {
    series: [
      {
        data: [63, 37, 53, 57, 52, 67, 75, 45, 66, 53, 55, 56, 69],
      },
    ],
  }
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 50,
    },
    theme: {
      palette: 'palette3',
    },
    title: {
      text: 'All Domains',
      align: 'left',
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        distributed: true,
      },
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: [
        'CCRA',
        'CRA',
        'CRA I',
        'CRA II',
        'CRA junior',
        'CRAA',
        'IHCRA',
        'Principal CRA',
        'SMA I',
        'Senior CRA I',
        'Senior CRA II',
        'Sr SMA',
        'All',
      ],
    },
  }

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={data.series}
        type="bar"
        height={250}
        width={700}
      />
    </div>
  )
}
export default observer(BarView)
