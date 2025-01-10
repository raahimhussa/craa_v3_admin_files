import Link from '@mui/material/Link'

import { observer } from 'mobx-react'
import { Typography } from 'src/ui/core/components'
function LinkView({ children, href = '/', ...rest }: any) {
  return (
    <Link href={href}>
      <Typography variant="button" color="primary">
        {children}
      </Typography>
    </Link>
  )
}
export default observer(LinkView)
