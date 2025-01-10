import Typography from '@mui/material/Typography'
import { observer } from 'mobx-react'
function TypographyView({ sx, ...rest }: any) {
  return (
    <Typography
      {...rest}
      style={{ textTransform: 'none' }}
      sx={{ whiteSpace: 'pre-line', textOverflow: 'ellipsis', ...sx }}
    />
  )
}
export default observer(TypographyView)
