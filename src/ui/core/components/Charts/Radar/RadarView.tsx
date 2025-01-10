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

function RadarView({ domains }: Props) {
  const data = {
    series: [
      {
        name: 'ICON-NA',
        data: [69, 48, 45, 42, 48],
      },
      {
        name: 'ICON-ROW',
        data: [71, 55, 55, 51, 56],
      },
      {
        name: 'Other-NA',
        data: [67, 33, 54, 41, 41],
      },
      {
        name: 'Other-ROW',
        data: [75, 59, 69, 57, 56],
      },
      {
        name: 'Parexel-NA',
        data: [67, 50, 47, 39, 47],
      },
      {
        name: 'Parexel-ROW',
        data: [67, 48, 53, 49, 50],
      },
    ],
  }

  // FIXME - Domain name?
  const options: ApexOptions = {
    chart: {
      type: 'radar',
      dropShadow: {
        enabled: true,
        blur: 1,
        left: 1,
        top: 1,
      },
    },
    title: {
      text: 'Domain Performance',
    },
    stroke: {
      width: 2,
    },
    fill: {
      opacity: 0.1,
    },
    markers: {
      size: 0,
    },
    xaxis: {
      categories: [
        'The Informed Consent Process',
        'Source Data Review', // FIXME - Protocol Requirement  => Source Data Review (need to read domain name from db)
        'IRB/IEC Sunmission and Approval',
        ['Source Documentation, CRF,', 'Source-to-CRF Review'],
        [
          'Potential Fraud, Scientific Misconduct',
          'and Delegation of Authority',
        ],
      ],
    },
  }

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={data.series}
        type="radar"
        height={500}
        width={700}
      />
    </div>
  )
}
export default observer(RadarView)
