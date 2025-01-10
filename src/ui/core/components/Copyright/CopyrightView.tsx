import { Typography } from 'src/ui/core/components'
import { Box } from '@mui/material'
import { observer } from 'mobx-react'
function CopyrightView({ logo = true, ...rest }: any) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" align="center">
        © Copyright 2022 CRA Assessments - All Rights Reserved
      </Typography>
    </Box>
  )
}
export default observer(CopyrightView)
