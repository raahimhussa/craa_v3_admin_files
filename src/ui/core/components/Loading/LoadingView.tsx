import { CircularProgress, CircularProgressProps } from '@mui/material'
import { observer } from 'mobx-react'
function CircularProgressView(props: CircularProgressProps) {
  return <CircularProgress {...props} />
}
export default observer(CircularProgressView)
