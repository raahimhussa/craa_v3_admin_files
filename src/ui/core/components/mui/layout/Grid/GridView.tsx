import { Grid } from '@mui/material'
import { observer } from 'mobx-react'
function GridView({ ...rest }) {
  return <Grid {...rest} />
}
export default observer(GridView)
