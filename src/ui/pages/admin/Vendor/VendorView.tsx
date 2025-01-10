import {
  Button,
  Grid,
  InputLabel,
  TextField as MuiTxtfield,
  Paper,
} from '@mui/material'
import { TextField, Typography } from 'src/ui/core/components'
import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import ClearIcon from '@mui/icons-material/Clear'
import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import Stack from '@mui/material/Stack'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

function VendorView({ mutate }: { mutate: any }) {
  const {
    clientUnitStore,
    uiState: { clientUnits },
  } = useRootStore()

  const [titles, setTitles] = useState(
    clientUnitStore.form.titles == undefined ? [] : clientUnitStore.form.titles
  )

  useEffect(() => {
    clientUnitStore.form.titles = titles
  }, [titles])

  return (
    <DetailLayout store={clientUnitStore} mutate={mutate}>
      <Box sx={{ bgcolor: 'rgb(242, 243, 243)' }}>
        <Grid container sx={{ p: 2 }}>
          {/* <Typography variant="h5">Add Client</Typography> */}
          <Grid item xs={12}>
            <Paper className="paper-grid">
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <InputLabel sx={{ mb: 1 }}>Client Name</InputLabel>
                <TextField
                  size="small"
                  state={clientUnitStore}
                  path="form.name"
                  // label="ClientName"
                  placeholder="Client Name"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={4}>
                <InputLabel sx={{ mb: 1, mt: 2 }}>Titles</InputLabel>
                {titles?.map((title, index) => (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <MuiTxtfield
                      fullWidth
                      size="small"
                      // label="ClientName"
                      variant="outlined"
                      value={title}
                      onChange={(e) => {
                        var arr = titles
                        arr[index] = e.target.value
                        setTitles([...arr])
                      }}
                      sx={{ mb: 1 }}
                    />
                    <Button
                      onClick={() => {
                        let arr = titles
                        arr.splice(index, 1)
                        setTitles([...arr])
                      }}
                    >
                      <ClearIcon />
                    </Button>
                  </Box>
                ))}
                <Button
                  sx={{
                    display: 'block',
                  }}
                  onClick={() => {
                    //@ts-ignore
                    setTitles([...titles, ''])
                  }}
                >
                  Add title
                </Button>
              </Grid>
            </Paper>
          </Grid>
          {/* <TextField size="small" state={clientStore} path='form.whitelist' label="Email Doamin" /> */}
        </Grid>
      </Box>
    </DetailLayout>
  )
}
export default observer(VendorView)
