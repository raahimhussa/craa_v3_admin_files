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
  Tooltip,
  IconButton,
} from '@mui/material'
// components
import { BaseOptionChart } from 'src/ui/components/chart'
import { Info } from '@mui/icons-material'

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string
  info?: string
  subheader?: string
  chartLabels: string[]
  chartData: {
    year: string
    data: {
      name: string
      data: number[]
    }[]
  }[]
}

export default function BankingBalanceStatistics({
  title,
  subheader,
  chartLabels,
  chartData,
  info,
  ...other
}: Props) {
  const [seriesData, setSeriesData] = useState('Year')

  const handleChangeSeriesData = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSeriesData(event.target.value)
  }

  const chartOptions = merge(BaseOptionChart(), {
    colors: ['#b3b3b3', '#666666', '#1a1a1a'],
    stroke: {
      show: true,
      width: 1,
      colors: ['transparent'],
    },
    xaxis: {
      categories: chartLabels,
    },
    yaxis: {
      max: 100,
      min: 0,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}%`,
      },
    },
  })

  return (
    <Card
      {...other}
      sx={{
        height: '100%',
      }}
    >
      <Tooltip title={info} followCursor>
        <IconButton
          sx={{
            minWidth: '10px !important',
            p: 0,
            position: 'absolute',
            top: 25,
            left: 155,
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
      <CardHeader
        title={title}
        subheader={subheader}
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
              type="bar"
              series={item.data}
              options={chartOptions}
              height={364}
            />
          )}
        </Box>
      ))}
    </Card>
  )
}
