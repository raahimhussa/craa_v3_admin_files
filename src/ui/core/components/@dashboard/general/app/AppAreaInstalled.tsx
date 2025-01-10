import merge from 'lodash/merge'
import { useState } from 'react'
import ReactApexChart from 'react-apexcharts'
// @mui
import {
  Card,
  CardHeader,
  Box,
  TextField,
  CardProps,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material'
// components
import { BaseOptionChart } from 'src/ui/components/chart'
import { Info } from '@mui/icons-material'

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string
  subheader?: string
  info?: string
  chartLabels: string[]
  chartData: {
    year: string
    data: {
      name: string
      data: number[]
    }[]
  }[]
}

export default function AppAreaInstalled({
  title,
  subheader,
  chartLabels,
  chartData,
  info,
  ...other
}: Props) {
  const [seriesData, setSeriesData] = useState('2019')
  const colors: any = {
    'Pfizer - ICON': '#128474',
    'Pfizer - Parexel': 'rgb(79,38,131)',
    'Pfizer - Syneos': '#8a0050',
    'Pfizer - PPD': '#eb3300',
    'Average All': '#e6e600',
  }
  console.log(chartData)
  const handleChangeSeriesData = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSeriesData(event.target.value)
  }

  const chartOptions = merge(BaseOptionChart(), {
    colors: [
      colors[chartData[0]?.data[0]?.name],
      colors[chartData[0]?.data[1]?.name],
      colors[chartData[0]?.data[2]?.name],
      colors[chartData[0]?.data[3]?.name],
      colors[chartData[0]?.data[4]?.name],
    ],
    xaxis: {
      categories: chartLabels,
    },
    yaxis: {
      max: 100,
    },
    markers: {
      size: 4,
    },
    stroke: {
      curve: 'straight',
      dashArray: chartData[0]?.data?.map((el) => {
        if (el.name === 'Average All' || el.name === 'Trendline') {
          return 8
        } else {
          return 0
        }
      }),
    },
  })

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        // subheader={subheader}
        // action={
        //   <TextField
        //     select
        //     fullWidth
        //     value={seriesData}
        //     SelectProps={{ native: true }}
        //     onChange={handleChangeSeriesData}
        //     sx={{
        //       '& fieldset': { border: '0 !important' },
        //       '& select': {
        //         pl: 1,
        //         py: 0.5,
        //         pr: '24px !important',
        //         typography: 'subtitle2',
        //       },
        //       '& .MuiOutlinedInput-root': {
        //         borderRadius: 0.75,
        //         bgcolor: 'background.neutral',
        //       },
        //       '& .MuiNativeSelect-icon': {
        //         top: 4,
        //         right: 0,
        //         width: 20,
        //         height: 20,
        //       },
        //     }}
        //   >
        //     {chartData.map((option) => (
        //       <option key={option.year} value={option.year}>
        //         {option.year}
        //       </option>
        //     ))}
        //   </TextField>
        // }
      />

      {chartData.map((item) => (
        <Box key={item.year} sx={{ mt: 3, mx: 3 }} dir="ltr">
          {item.year === seriesData && (
            <ReactApexChart
              type="line"
              series={item.data}
              options={chartOptions}
              height={364}
            />
          )}
        </Box>
      ))}
      <Tooltip title={info} followCursor>
        <IconButton
          sx={{
            minWidth: '10px !important',
            p: 0,
            position: 'absolute',
            top: 25,
            left: 200,
          }}
        >
          <Info
            sx={{
              fontSize: 15,
              opacity: 0.8,
            }}
          />
        </IconButton>
      </Tooltip>
    </Card>
  )
}
