import { observer } from 'mobx-react'
import { Typography, Uploader } from 'src/ui/core/components'
import { reaction } from 'mobx'
import Paper from '@mui/material/Paper'
function FileView(props: any) {
  const { state } = props
  reaction(
    () => state.files,
    (files) => (state.file = files[0])
  )

  return (
    <Paper elevation={3} sx={{ p: 2, m: 2 }}>
      <Typography variant="h5">File</Typography>
      <Uploader state={state} path="files" />
      <Typography>{state.file.name || ''}</Typography>
    </Paper>
  )
}
export default observer(FileView)
