// import Clients from 'src/ui/core/components/tables/Clients/Clients'
// import PaginationTable from 'src/ui/components/PaginationTable'
// import { observer } from 'mobx-react'
// import { Box, ListItem, MenuItem, Select } from '@mui/material'
// function DashboardView() {
//   return (
//     <>
//       <Box
//         sx={{
//           width: '250px',
//           bgcolor: 'white',
//           mt: 2,
//         }}
//       >
//         <Select fullWidth size="small" placeholder="Select vendor">
//           <MenuItem>test</MenuItem>
//         </Select>
//       </Box>
//       <Box>

//       </Box>

//     </>
//   )
// }
// export default observer(DashboardView)
// @mui
import { useTheme } from '@mui/material/styles'
import {
  Container,
  Grid,
  Stack,
  Button,
  Box,
  MenuItem,
  Select,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material'
// components
// sections
import {
  AppWidget,
  // AppWelcome,
  // AppFeatured,
  // AppNewInvoice,
  // AppTopAuthors,
  // AppTopRelated,
  AppAreaInstalled,
  AppWidgetSummary,
  AppCurrentDownload,
  AppTopInstalledCountries,
} from 'src/ui/core/components/@dashboard/general/app'
import { observer } from 'mobx-react'
import { BankingBalanceStatistics } from 'src/ui/core/components/@dashboard/general/banking'
import AppWidgetOverSummary from '@components/@dashboard/general/app/AppGuageChart'
import AppGuageChart from '@components/@dashboard/general/app/AppGuageChart'
import { Info } from '@mui/icons-material'
import ChartSkeleton from './ChartSkeleton'
import { useEffect } from 'react'

// ----------------------------------------------------------------------

function ChartsView(props: any) {
  const theme = useTheme()
  const { dashboard, countries, clientId, vendorId } = props
  let countryList: any = []
  let trendData: any = []
  //{ name: 'China', rate: 72, code: 'cn' },
  console.log(props)
  // const data = [
  //   { x: 1, y: 2 },
  //   { x: 2, y: 3 },
  //   { x: 3, y: 5 },
  //   { x: 4, y: 6 },
  //   // Add more data points here
  // ];

  if (
    vendorId !== 'all' &&
    dashboard.passRateByVendor.find((el: any) => el.name === 'Trendline') ===
      undefined
  ) {
    let data: any = []
    dashboard.passRateByVendor[0].data.map((el: any, index: any) => {
      data.push({ x: index + 1, y: Number(el) })
    })
    const trendline = calculateTrendline(data)
    trendData = dashboard.passRateByVendor[0].data.map(
      (el: any, index: any) => {
        return Math.ceil(trendline.slope * (index + 1) + trendline.intercept)
      }
    )
    dashboard.passRateByVendor.push({ name: 'Trendline', data: trendData })
    console.log(dashboard.passRateByVendor)
  }
  Object.keys(dashboard?.countryDatas)?.map((countryId) => {
    const country = countries.find((country: any) => country._id === countryId)
    countryList.push({
      name: country.name,
      rate: (dashboard.countryDatas[countryId] / dashboard.countryTotal) * 100,
      code: country.code.toLowerCase(),
    })
  })

  // Calculate the trendline
  function calculateTrendline(data: any) {
    console.log(data)
    const n = data.length
    let sumX = 0
    let sumY = 0
    let sumXY = 0
    let sumXX = 0

    for (let i = 0; i < n; i++) {
      const point = data[i]
      sumX += point.x
      sumY += point.y
      sumXY += point.x * point.y
      sumXX += point.x * point.x
    }
    console.log(sumX)
    console.log(sumY)
    console.log(sumXY)
    console.log(sumXX)
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    return { slope, intercept }
  }

  return (
    <>
      <Grid
        item
        xs={12}
        md={2.3}
        sx={{
          height: '270px',
        }}
      >
        <AppWidgetSummary
          title="Total accounts"
          percent={dashboard.userLastweekCnt}
          total={dashboard.userTotalCnt}
          ytd={dashboard.userYTDCnt}
          chartColor={theme.palette.primary.main}
          chartData={[5, 18, 12, 51, 68, 11, 39, 37, 27, 20]}
          info="Count of registered user accounts in the CRAA system"
        />
      </Grid>

      <Grid item xs={12} md={2.3}>
        <AppWidgetSummary
          title="Completed sim process"
          percent={dashboard.simCompletedLastweekCnt}
          total={dashboard.simCompletedTotalCnt}
          ytd={dashboard.simCompletedYTDcnt}
          chartColor={theme.palette.chart.blue[0]}
          chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
          info="Count of users that have completed the simulation and training process
            "
        />
      </Grid>
      <Grid item xs={12} md={2.8}>
        <AppGuageChart
          title="Pass Rate (Past 3 months)"
          percent={
            dashboard.passRateAllDomainsThreeMonths -
            dashboard.passRateAllDomainsPrevThreeMonths
          }
          total={dashboard.passRateAllDomains * 2.7}
          subTitle=""
          info="Percent of users that passed the minimum threshold score of 67% for all 5 domains in the simulation process in the past 3 months, including either Baseline or Follow-up simulations Trend number compares the recent 3 month pass rate with the pass rate from the previous 3 month period. Green up arrow indicates improvement in scores, red down arrow indicates decreased average pass rate"
        />
      </Grid>
      <Grid item xs={12} md={2.3}>
        {/* <AppWidgetOverSummary
            title="Ongoing"
            percent={0.2}
            total={4876}
            ytd={145}
            chartColor={theme.palette.chart.blue[0]}
            chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
          />
           */}
        <AppWidget
          title="Ongoing"
          total={dashboard.ongoingTotalCnt}
          icon={'eva:person-fill'}
          number={dashboard.ongoingMonthCnt}
          period={3}
          periodTxt="mths"
          info="Count of users that have created an account in the CRAA portal, but have not completed the simulation process. Number below that indicates count of users that have been in the CRAA system for over 3 months"
        />
      </Grid>

      <Grid item xs={12} md={2.3}>
        <AppWidget
          title="Pending verification"
          total={dashboard.pendingUserTotalCnt}
          number={dashboard.pendingUserWeekCnt}
          period={1}
          periodTxt="week"
          icon={'eva:email-fill'}
          color="warning"
          info="Count of users that have completed the simulation process, but have not had their status updated in the Pfizer LMS. Number below that indications count of users that have completed status with no LMS update for over a week."
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle2">
          Pass Rate by Domain
          <Tooltip
            title={
              'Percent of users that passed the minimum threshold score of 67% for each of the 5 domains in the simulation process in the past 3 months, including either Baseline or Follow-up simulations. Trend number compares the recent 3 month pass rate with the pass rate from the previous 3 month period. Green up arrow indicates improvement in scores, red down arrow indicates decrease in scores'
            }
            followCursor
          >
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
      </Grid>
      {dashboard.domains
        .filter((el: any) => el.name !== 'IRB/IEC Reporting')
        .map((domain: any) => {
          return (
            <Grid
              item
              xs={12}
              md={2.4}
              sx={{
                height: '234px',
                mt: -2,
              }}
            >
              <AppGuageChart
                subTitle={domain.name}
                percent={Number(
                  (
                    dashboard?.passRatePerDomains[domain._id] -
                    dashboard?.passRatePerDomainsPrevThreeMonths[domain._id]
                  ).toFixed(0)
                )}
                total={
                  dashboard?.passRatePerDomains[domain._id]?.toFixed(0) * 2.7
                }
                title=""
              />
            </Grid>
          )
        })}
      <Grid item xs={12} md={12} lg={12}>
        <AppAreaInstalled
          info="Percent of users that passed all 5 domains with a completed status date in the month indicated."
          title="Pass Rate by Vendor"
          subheader="(+43%) than last year"
          chartLabels={dashboard.passRateByVendorMonths
            .sort(function (a: any, b: any) {
              //@ts-ignore
              return new Date(a) - new Date(b)
            })
            .map((dateStr: any) => {
              const [year, month] = dateStr.split('-')
              const date = new Date(`${year}-${month}-01`)
              const options: any = { year: 'numeric', month: 'short' }
              const formattedDate = date.toLocaleString('en-US', options)
              return formattedDate
            })}
          chartData={[
            {
              year: '2019',
              // data: [
              //   { name: 'ICON', data: [25, 41, 54, 51, 44, 62, 54, 91, 150] },
              //   { name: 'PPD', data: [10, 43, 32, 51, 53, 23, 56, 88, 123] },
              //   {
              //     name: 'Parexel',
              //     data: [23, 54, 34, 56, 67, 62, 34, 91, 99],
              //   },
              //   {
              //     name: 'Syneos',
              //     data: [78, 66, 45, 87, 66, 78, 69, 56, 148],
              //   },
              //   {
              //     name: 'Average All',
              //     data: [160, 45, 100, 56, 155, 88, 99, 77, 45],
              //   },
              // ],
              data:
                vendorId === 'all'
                  ? dashboard.passRateByVendor.filter(
                      (val: any) =>
                        !val.name.includes('Test') &&
                        !val.name.includes('EPS') &&
                        !val.name.includes('Other')
                    )
                  : dashboard.passRateByVendor.filter(
                      (val: any) => !val.name.includes('Average')
                    ),
            },
          ]}
        />
      </Grid>
      {vendorId === 'all' ? (
        <>
          <Grid item xs={12} md={6} lg={6}>
            <BankingBalanceStatistics
              info="Breakdown of users accounts created in past 3 months by title provided in the user profile."
              title="Title by Vendor"
              subheader=""
              chartLabels={['ICON', 'Parexel', 'Syneos', 'PPD', 'Average']}
              chartData={[
                {
                  year: 'Year',
                  data: dashboard.breakdownByTitle,
                },
              ]}
              // chartLabels={['ICON', 'Parexel', 'Syneos', 'PPD', 'Average']}
              // chartData={[
              //   {
              //     year: 'Week',
              //     data: [
              //       {
              //         name: 'SCRA',
              //         data: [20, 10, 60, 40, 33],
              //       },
              //       {
              //         name: 'CRA II',
              //         data: [30, 50, 30, 30, 35],
              //       },
              //       {
              //         name: 'IHCRA/CRA I',
              //         data: [50, 40, 10, 30, 33],
              //       },
              //     ],
              //   },
              // ]}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3.5}>
            <AppCurrentDownload
              info="User accounts created in the past 3 months, breakdown by vendor"
              title="Breakdown by vendor"
              chartColors={['#128474', 'rgb(79,38,131)', '#8a0050', '#eb3300']}
              chartData={[
                {
                  label: 'ICON',
                  value: dashboard.breakdownByVendor['Pfizer - ICON']?.length,
                },
                {
                  label: 'PPD',
                  value: dashboard.breakdownByVendor['Pfizer - PPD']?.length,
                },
                {
                  label: 'Parexel',
                  value:
                    dashboard.breakdownByVendor['Pfizer - Parexel']?.length,
                },
                {
                  label: 'Syneos',
                  value: dashboard.breakdownByVendor['Pfizer - Syneos']?.length,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={2} lg={2.5}>
            <AppTopInstalledCountries
              info="Ranking of countries by pass rate, includes data from users with simulation process complete date within the past 3 months."
              title="Top Performing Countries"
              // list={[
              //   { name: 'China', rate: 72, code: 'cn' },
              //   { name: 'Sweden', rate: 68, code: 'se' },
              //   { name: 'Australia', rate: 60, code: 'au' },
              //   { name: 'Malaysia', rate: 58, code: 'my' },
              //   { name: 'Argentina', rate: 52, code: 'ar' },
              //   { name: 'Croatia', rate: 50, code: 'hr' },
              //   { name: 'South Africa', rate: 49, code: 'za' },
              //   { name: 'Ireland', rate: 49, code: 'ie' },
              //   { name: 'Mexico', rate: 45, code: 'mx' },
              //   { name: 'Estonia', rate: 42, code: 'ee' },
              // ].map((country, index) => ({
              //   id: 'id',
              //   name: country.name,
              //   rate: country.rate,
              //   code: country.code,
              // }))}
              list={countryList
                .sort((a: any, b: any) => b.rate - a.rate)
                .slice(0, 10)
                .map((country: any, index: any) => ({
                  id: 'id',
                  name: country.name,
                  rate: country.rate,
                  code: country.code,
                }))}
            />
          </Grid>
        </>
      ) : (
        <></>
      )}
    </>
  )
}
export default observer(ChartsView)
