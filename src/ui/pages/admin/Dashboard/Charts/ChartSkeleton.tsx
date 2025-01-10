import { useTheme } from '@mui/material/styles'
import { Grid, Skeleton } from '@mui/material'

// ----------------------------------------------------------------------

function ChartSkeleton(props: any) {
  const theme = useTheme()

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
        <Skeleton
          variant="rectangular"
          sx={{ height: '100%', bgcolor: '#e6e6e6' }}
          animation="wave"
        />
      </Grid>

      <Grid item xs={12} md={2.3}>
        <Skeleton
          variant="rectangular"
          sx={{ height: '100%', bgcolor: '#e6e6e6' }}
          animation="wave"
        />
      </Grid>
      <Grid item xs={12} md={2.8}>
        <Skeleton
          variant="rectangular"
          sx={{ height: '100%', bgcolor: '#e6e6e6' }}
          animation="wave"
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
        <Skeleton
          variant="rectangular"
          sx={{ height: '100%', bgcolor: '#e6e6e6' }}
          animation="wave"
        />
      </Grid>

      <Grid item xs={12} md={2.3}>
        <Skeleton
          variant="rectangular"
          sx={{ height: '100%', bgcolor: '#e6e6e6' }}
          animation="wave"
        />
      </Grid>
      <Grid item xs={12}>
        <Skeleton
          variant="rectangular"
          sx={{ height: '100%', bgcolor: '#e6e6e6' }}
          animation="wave"
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={2.4}
        sx={{
          height: '234px',
          mt: -2,
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{ height: '100%', bgcolor: '#e6e6e6' }}
          animation="wave"
        />
      </Grid>

      <Grid
        item
        xs={12}
        md={2.4}
        sx={{
          mt: -2,
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{ height: '100%', bgcolor: '#e6e6e6' }}
          animation="wave"
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={2.4}
        sx={{
          mt: -2,
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{ height: '100%', bgcolor: '#e6e6e6' }}
          animation="wave"
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={2.4}
        sx={{
          mt: -2,
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{ height: '100%', bgcolor: '#e6e6e6' }}
          animation="wave"
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={2.4}
        sx={{
          mt: -2,
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{ height: '100%', bgcolor: '#e6e6e6' }}
          animation="wave"
        />
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <Skeleton
          variant="rectangular"
          sx={{ height: '300px', bgcolor: '#e6e6e6' }}
          animation="wave"
        />
      </Grid>
    </>
  )
}
export default ChartSkeleton
