import merge from 'lodash/merge'
import ReactApexChart from 'react-apexcharts'
// @mui
import { useTheme, styled } from '@mui/material/styles'
import {
  Card,
  Typography,
  Box,
  CardProps,
  Tooltip,
  IconButton,
} from '@mui/material'
// utils
import { fNumber } from 'src/utils/formatNumber'
// theme
import { ColorSchema } from 'src/theme/palette'
// components
import Iconify from 'src/ui/components/Iconify'
import { BaseOptionChart } from 'src/ui/components/chart'
import { Info } from '@mui/icons-material'

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  // alignItems: 'center',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.primary.darker,
  flexDirection: 'column',
  justifyContent: 'flex-start',
}))

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 120,
  height: 120,
  opacity: 0.12,
  position: 'absolute',
  right: theme.spacing(-3),
  color: theme.palette.common.white,
}))

// ----------------------------------------------------------------------

interface Props extends CardProps {
  icon: string
  title: string
  periodTxt: string
  info: string
  total: number
  color?: ColorSchema
  number: number
  period: number
}

export default function AppWidget({
  periodTxt,
  title,
  total,
  icon,
  color = 'primary',
  number,
  period,
  info,
  ...other
}: Props) {
  const theme = useTheme()

  const chartOptions = merge(BaseOptionChart(), {
    colors: [theme.palette[color].main],
    chart: { sparkline: { enabled: true } },
    legend: { show: false },
    plotOptions: {
      radialBar: {
        hollow: { size: '78%' },
        track: { margin: 0 },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: 6,
            color: theme.palette.common.white,
            fontSize: theme.typography.subtitle2.fontSize,
          },
        },
      },
    },
  })

  return (
    <RootStyle
      sx={{
        bgcolor: theme.palette[color].darker,
        height: '100%',
      }}
      {...other}
    >
      {/* <ReactApexChart
        type="radialBar"
        series={[100]}
        options={chartOptions}
        width={86}
        height={86}
      /> */}
      <Typography
        variant="subtitle2"
        sx={{
          color: 'white',
          mb: 1,
        }}
      >
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
                color: 'white',
                opacity: 0.8,
              }}
            />
          </IconButton>
        </Tooltip>
      </Typography>
      <Box sx={{ ml: 1, color: 'common.white' }}>
        <Typography variant="h2"> {fNumber(total)}</Typography>
        <Typography variant="h6" sx={{ opacity: 0.72 }}>
          <span style={{ fontSize: '30px' }}>{number}</span> Over {period}{' '}
          {periodTxt}
        </Typography>
      </Box>
      <IconStyle icon={icon} />
    </RootStyle>
  )
}
