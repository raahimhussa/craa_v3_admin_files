import { Stack } from '@mui/material'
import { observer } from 'mobx-react'
import { StackViewProps } from './Stack'
function StackView(props: StackViewProps) {
  return <Stack {...props} />
}
export default observer(StackView)
