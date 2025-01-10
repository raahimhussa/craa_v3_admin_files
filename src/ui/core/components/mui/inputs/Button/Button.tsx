import LoadingButton from '@mui/lab/LoadingButton'
import { ButtonProps } from '@mui/material'
import { observer } from 'mobx-react'
function ButtonView(props: ButtonProps & {
  loading?: boolean
}) {
  return <LoadingButton {...props} fullWidth />
}
export default observer(ButtonView)
