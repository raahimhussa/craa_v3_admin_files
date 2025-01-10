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
  InputLabel,
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
import Charts from './Charts/Charts'
import { useState } from 'react'

// ----------------------------------------------------------------------

function DashboardView(props: any) {
  const { clientUnits } = props
  const [clientUnitId, setClientUnitId] = useState<any>('')
  const [vendorId, setVendorId] = useState<any>('')
  const [businessUnitId, setBusinessUnitId] = useState<string>('')
  const pfizerId = clientUnits.find((el: any) => el.name === 'Pfizer')._id
  const vendors = clientUnits
    .filter((el: any) => el.vendor === pfizerId)
    .map((el: any) => el._id)

  return (
    <Container
      //@ts-ignore
      maxWidth={'xxl'}
      sx={{
        height: 'calc(100vh - 70px)',
        overflowY: 'scroll',
      }}
    >
      <Grid container spacing={3}>
        <Grid
          container
          spacing={3}
          xs={12}
          sx={{
            p: 3,
            pb: 0,
          }}
        >
          <Grid
            item
            xs={2.4}
            sx={{
              // bgcolor: 'white',
              mt: 2,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: '13px',
              }}
            >
              Client
            </Typography>
            <Select
              fullWidth
              size="small"
              placeholder="Select vendor"
              className="whiteSelect"
              onChange={(e: any) => {
                if (e.target.value === pfizerId) {
                  setVendorId('all')
                }
                setClientUnitId(e.target.value)
              }}
              value={clientUnitId}
            >
              {clientUnits
                ?.filter(
                  (el: any) => el.vendor === '' || el.vendor === undefined
                )
                ?.map((client: any) => (
                  <MenuItem value={client._id}>{client.name}</MenuItem>
                ))}
            </Select>
          </Grid>
          {clientUnitId !== '' ? (
            clientUnitId ===
            clientUnits.find((el: any) => el.name === 'Pfizer')._id ? (
              <Grid
                item
                xs={2.3}
                sx={{
                  // bgcolor: 'white',
                  mt: 2,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: '13px',
                  }}
                >
                  Vendors
                </Typography>
                <Select
                  fullWidth
                  size="small"
                  placeholder="Select vendor"
                  className="whiteSelect"
                  onChange={(e: any) => {
                    setVendorId(e.target.value)
                  }}
                  value={vendorId}
                >
                  <MenuItem value={'all'}>All</MenuItem>
                  {clientUnits
                    ?.filter(
                      (el: any) =>
                        el.vendor === pfizerId &&
                        el.name !== 'Pfizer - Other' &&
                        el.name !== 'Pfizer - EPS'
                    )
                    ?.map((client: any) => (
                      <MenuItem value={client._id}>{client.name}</MenuItem>
                    ))}
                </Select>
              </Grid>
            ) : (
              <Grid
                item
                xs={2.3}
                sx={{
                  // bgcolor: 'white',
                  mt: 2,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: '13px',
                  }}
                >
                  Business Units
                </Typography>
                <Select
                  fullWidth
                  size="small"
                  placeholder="Select vendor"
                  className="whiteSelect"
                  onChange={(e: any) => {
                    setBusinessUnitId(e.target.value)
                  }}
                >
                  {clientUnits
                    ?.find((el: any) => el._id === clientUnitId)
                    ?.businessUnits?.map((bu: any) => (
                      <MenuItem value={bu._id}>{bu.name}</MenuItem>
                    ))}
                </Select>
              </Grid>
            )
          ) : (
            <></>
          )}
        </Grid>
        {clientUnitId !== '' ? (
          <Charts
            clientId={clientUnitId}
            vendorId={vendorId}
            businessUnitId={businessUnitId}
            vendors={vendors}
            pfizerId={pfizerId}
          />
        ) : (
          <></>
        )}
      </Grid>
    </Container>
  )
}
export default observer(DashboardView)
