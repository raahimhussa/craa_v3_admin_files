import merge from 'lodash/merge'
import ReactApexChart from 'react-apexcharts'
// @mui
import { useTheme, styled } from '@mui/material/styles'
import { Card, CardHeader, CardProps, IconButton, Tooltip } from '@mui/material'
// utils
import { fNumber } from 'src/utils/formatNumber'
// components
import { BaseOptionChart } from 'src/ui/components/chart'
import { Info } from '@mui/icons-material'

// ----------------------------------------------------------------------

const CHART_HEIGHT = 392
const LEGEND_HEIGHT = 72

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important' as 'relative',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}))

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string
  info?: string
  subheader?: string
  chartData: {
    label: string
    value: number
  }[]
  chartColors?: string[]
}

export default function AppCurrentDownload({
  title,
  subheader,
  chartData,
  chartColors,
  info,
  ...other
}: Props) {
  const theme = useTheme()

  const chartLabels = chartData.map((i) => i.label)

  const chartSeries = chartData.map((i) => i.value)
  let total = 0
  chartData.map((i) => {
    total += i.value
  })

  const chartOptions = merge(BaseOptionChart(), {
    colors: chartColors,
    labels: chartLabels,
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName: string) =>
          ((Number(seriesName) / total) * 100).toFixed(0) + '%',
        title: {
          formatter: (seriesName: string) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            value: {
              formatter: (val: number) => {
                return ((val / total) * 100).toFixed(0) + '%'
              },
            },
            total: {
              formatter: (w: { globals: { seriesTotals: number[] } }) => {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0)
                return 100 + '%'
              },
            },
          },
        },
      },
    },
  })

  return (
    <Card {...other}>
      <Tooltip title={info} followCursor>
        <IconButton
          sx={{
            minWidth: '10px !important',
            p: 0,
            position: 'absolute',
            top: 25,
            left: 209,
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
      <CardHeader title={title} subheader={subheader} />

      <ChartWrapperStyle dir="ltr">
        <ReactApexChart
          type="donut"
          series={chartSeries}
          options={chartOptions}
          height={280}
        />
      </ChartWrapperStyle>
    </Card>
  )
}
