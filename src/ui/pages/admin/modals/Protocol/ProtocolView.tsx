import {
  Alert,
  AlertTitle,
  CardContent,
  CardHeader,
  Divider,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Box, TextField } from 'src/ui/core/components'
import { observer, useLocalObservable } from 'mobx-react'

import Card from '@mui/material/Card'
import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import { DocKind } from 'src/models/doc/doc.interface'
import Files from './Files/Files'
// import Files from 'src/ui/core/components/tables/Files/Files'
import Grid from '@mui/material/Grid'
import PaginationTable from 'src/ui/components/PaginationTable'
import { Utils } from '@utils'
import { toJS } from 'mobx'
import { useEffect } from 'react'
import { useRootStore } from 'src/stores'

function ProtocolView(props: any) {
  const { state, files, onClose } = props
  const {
    docStore,
    uiState: { docs },
  } = useRootStore()

  useEffect(() => {
    docStore.form.kind = DocKind.Protocol
  }, [])

  const getFileSize = () => {
    let convertedFileSize = ''
    if (Utils.bytesToKiloBytes(docStore.form?.file?.size || 0) > 1023) {
      convertedFileSize =
        Utils.bytesToMegaBytes(docStore.form?.file?.size || 0).toFixed(1) +
        ' MB'
    } else {
      convertedFileSize =
        Utils.bytesToKiloBytes(docStore.form?.file?.size || 0).toFixed(0) +
        ' KB'
    }
    return convertedFileSize
  }

  return (
    <DetailLayout
      store={docStore}
      mutate={docs.mutate}
      onClose={onClose}
      label={'Protocol'}
    >
      <Box
        sx={{
          bgcolor: 'rgb(242, 243, 243)',
          p: 2,
          height: 'calc(100vh - 220px)',
        }}
      >
        <Grid container>
          <Grid item xs={12} className="paper-grid" sx={{ mb: 2 }}>
            <Grid item xs={12} sm={8} md={6} lg={4}>
              <InputLabel sx={{ mb: 1 }}>Title</InputLabel>
              <TextField
                state={docStore}
                path="form.title"
                variant="outlined"
                placeholder="Title"
              />
            </Grid>
          </Grid>
          <Grid
            item
            xs={8}
            className="paper-grid"
            sx={{ height: 'calc(100vh - 396px)' }}
          >
            <Files />
          </Grid>
          <Grid xs={0.1} />
          <Grid item xs={3.9}>
            {docStore.form.file ? (
              <Card>
                <CardHeader title={docStore.form.file.name} />
                <Divider />
                <CardContent>
                  <Grid container>
                    <Grid item xs={3}>
                      <Typography>Path</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography>
                        {docStore?.form?.file?.path || ''}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>Size</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography>{getFileSize()}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>Type</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography>
                        {docStore?.form?.file?.mimeType || ''}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent>
                  <Alert severity="warning">
                    <AlertTitle>Select only one file</AlertTitle>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>
    </DetailLayout>
  )
}
export default observer(ProtocolView)
