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
import 'zingchart/es6'
//@ts-ignore
import ZingChart from 'zingchart-react'
// EXPLICITLY IMPORT MODULE
import 'zingchart/modules-es6/zingchart-depth.min.js'
import { Info } from '@mui/icons-material'
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
  subTitle: string
  info?: string
  total: number
  percent: number
  height?: number
}

export default function AppGuageChart({
  title,
  subTitle,
  percent,
  total,
  height,
  sx,
  info,
  ...other
}: Props) {
  const theme = useTheme()

  const chartOptions = {
    type: 'gauge',
    globals: {
      fontSize: 10,
    },
    plotarea: {
      marginTop: subTitle === '' ? 55 : 50,
    },
    plot: {
      size: '100%',
      // valueBox: {
      //   placement: 'center',
      //   text: '%v', //default
      //   fontSize: 15,
      //   rules: [
      //     {
      //       rule: '%v >= 700',
      //       text: '%v<br>EXCELLENT',
      //     },
      //     {
      //       rule: '%v < 700 && %v > 640',
      //       text: '%v<br>Good',
      //     },
      //     {
      //       rule: '%v < 640 && %v > 580',
      //       text: '%v<br>Fair',
      //     },
      //     {
      //       rule: '%v <  580',
      //       text: '%v<br>Bad',
      //     },
      //   ],
      // },
    },
    tooltip: {
      borderRadius: 5,
    },
    scaleR: {
      aperture: 270,
      minValue: 0,
      maxValue: 270,
      step: 50,
      center: {
        visible: false,
      },
      tick: {
        visible: false,
      },
      item: {
        offsetR: 0,
        rules: [
          {
            rule: '%i == 9',
            offsetX: 15,
          },
        ],
      },
      labels: ['', '', '', '', '', '', ''],
      ring: {
        size: subTitle === '' ? 35 : 30,
        rules: [
          {
            rule: '%v >= 0 && %v <= 134',
            'background-color': '#FF4842',
          },
          {
            rule: '%v >= 135 && %v <= 215',
            'background-color': '#FFC107',
          },
          {
            rule: '%v >= 216 && %v <= 270',
            'background-color': '#00AB55',
          },
        ],
      },
    },
    refresh: {
      type: 'feed',
      transport: 'js',
      url: 'feed()',
      interval: 1500,
      resetTimeout: 1000,
    },
    series: [
      {
        values: [total], // starting value
        backgroundColor: '#404040',
        indicator: [10, 0, 0, 0, 0.3],
        animation: {
          effect: 2,
          method: 1,
          sequence: 4,
          speed: 900,
        },
      },
    ],
  }

  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 3,
        ...sx,
        width: '100%',
        height: '100%',
      }}
      {...other}
    >
      <Box sx={{ flexGrow: 1, height: '100%' }}>
        <Typography
          variant="subtitle2"
          sx={{
            position: 'absolute',
            zIndex: 2,
          }}
        >
          {title}
          {subTitle === '' ? (
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
          ) : (
            <></>
          )}
        </Typography>
        <Box
          sx={{
            height: '100%',
            position: 'absolute',
            top: 0,
            bgcolor: 'transparent',
            width: '100%',
            left: 0,
            mt: subTitle !== '' ? -4 : 0,
          }}
          className="zingchart"
        >
          <ZingChart
            data={chartOptions}
            height={subTitle === '' ? '230px' : '200px'}
            width="100%"
          />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            zIndex: 2,
            bottom: 0,
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pb: subTitle !== '' ? 6 : 2,
          }}
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
              width={25}
              height={25}
              icon={
                percent >= 0 ? 'eva:trending-up-fill' : 'eva:trending-down-fill'
              }
            />
          </IconWrapperStyle>
          <Typography
            variant={subTitle === '' ? 'h3' : 'h4'}
            sx={{
              color: percent < 0 ? '#FF4842' : '#00AB55',
              ml: 0.5,
            }}
          >
            {Math.abs(percent).toFixed(0)}%
          </Typography>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            zIndex: 2,
            bottom: 0,
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: '12.5px',
              lineHeight: 1.2,
              textAlign: 'center',
              mt: -5.5,
              width: '90%',
            }}
          >
            {subTitle}
          </Typography>
        </Box>
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
