import { Divider, InputLabel, Typography } from '@mui/material'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import { DocKind } from 'src/models/doc/doc.interface'
import Files from './Files/Files'
import Grid from '@mui/material/Grid'
import { TextField } from 'src/ui/core/components'
import { Utils } from '@utils'
import { observer } from 'mobx-react'
import { useEffect } from 'react'
import { useRootStore } from 'src/stores'

function StudyDocumentView(props: any) {
  const { files, state, onClose } = props
  const {
    docStore,
    uiState: { docs },
  } = useRootStore()
  useEffect(() => {
    docStore.form.kind = DocKind.StudyDocument
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

  useEffect(() => {
    if (state.selectedRowIds.length > 0) {
      docStore.form.file = files?.find((file: any) =>
        state.selectedRowIds.includes(file._id)
      )
    }
  }, [JSON.stringify(state.selectedRowIds)])

  return (
    <DetailLayout
      store={docStore}
      mutate={docs.mutate}
      onClose={onClose}
      label={'Study Document'}
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
export default observer(StudyDocumentView)
