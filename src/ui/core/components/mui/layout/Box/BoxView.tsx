import Box from '@mui/material/Box'
import { observer } from 'mobx-react'
function BoxView(props: any) {
  return <Box {...props} />
}
export default observer(BoxView)
