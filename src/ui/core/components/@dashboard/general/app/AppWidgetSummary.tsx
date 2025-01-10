import ReactApexChart from 'react-apexcharts'
// @mui
import { alpha, useTheme, styled } from '@mui/material/styles'
import {
  Box,
  Card,
  Typography,
  Stack,
  CardProps,
  Tooltip,
  IconButton,
} from '@mui/material'

// utils
import { fNumber, fPercent } from 'src/utils/formatNumber'
// components
import Iconify from 'src/ui/components/Iconify'
import { Info } from '@mui/icons-material'
import { InfoIcon } from 'src/theme/overrides/CustomIcons'

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  width: 24,
  height: 24,
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.success.main,
  backgroundColor: alpha(theme.palette.success.main, 0.16),
}))

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string
  total: number
  percent: number
  chartColor: string
  info: string
  chartData: number[]
  ytd: number
}

export default function AppWidgetSummary({
  title,
  percent,
  total,
  chartColor,
  chartData,
  sx,
  ytd,
  info,
  ...other
}: Props) {
  const theme = useTheme()

  const chartOptions = {
    colors: [chartColor],
    chart: { sparkline: { enabled: true } },
    plotOptions: { bar: { columnWidth: '68%', borderRadius: 2 } },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (seriesName: number | string) => fNumber(seriesName),
        title: {
          formatter: (seriesName: number | string) => '',
        },
      },
      marker: { show: false },
    },
  }

  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 3,
        ...sx,
        height: '100%',
      }}
      {...other}
    >
      <Box sx={{ flexGrow: 1, height: '100%' }}>
        <Typography variant="subtitle2">
          {title}
          <Tooltip title={info} followCursor>
            <IconButton
              sx={{
                minWidth: '10px !important',
                p: 0,
                ml: 0.3,
                mt: -0.2,
              }}
            >
              <Info
                sx={{
                  fontSize: 15,
                }}
              />
            </IconButton>
          </Tooltip>
        </Typography>
        <Typography variant="h2" sx={{ textAlign: 'right', mt: 1 }}>
          {fNumber(total)}
          <span style={{ fontSize: '15px', marginLeft: 10 }}>Total</span>
        </Typography>
        <Typography variant="h3" sx={{ textAlign: 'right' }}>
          {fNumber(ytd)}
          <span style={{ fontSize: '15px', marginLeft: 10 }}>YTD</span>
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ mt: 2, mb: 1, justifyContent: 'flex-start' }}
        >
          <IconWrapperStyle
            sx={{
              ...(percent < 0 && {
                color: 'error.main',
                bgcolor: alpha(theme.palette.error.main, 0.16),
              }),
            }}
          >
            <Iconify
              width={20}
              height={20}
              icon={
                percent >= 0 ? 'eva:trending-up-fill' : 'eva:trending-down-fill'
              }
            />
          </IconWrapperStyle>
          <Typography
            component="span"
            variant="h5"
            // sx={{
            //   fontSize: '18px',
            // }}
          >
            {percent > 0 && '+'}
            {percent}
          </Typography>
          <span
            style={{
              fontSize: '13px',
              lineHeight: 1,
              marginLeft: 10,
              fontWeight: 600,
            }}
          >
            Last
            <br /> week
          </span>
        </Stack>
      </Box>

      {/* <ReactApexChart
        type="bar"
        series={[{ data: chartData }]}
        options={chartOptions}
        width={60}
        height={36}
      /> */}
    </Card>
  )
}
