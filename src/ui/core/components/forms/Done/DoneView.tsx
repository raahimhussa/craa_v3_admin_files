import { Spacer, Typography } from 'src/ui/core/components'
import Box from '@mui/material/Box'
import { observer } from 'mobx-react'
function DoneView({ ...rest }: any) {
  return (
    <Box>
      <Typography variant="h3">Acceptance Notice</Typography>
      <Spacer spacing={5} />
      <Typography>
        {`You have accepted the CRAA Privacy Policy. An email verification link
        has been sent to you. \n
        If you do not receive the email verification
        message within a few minutes, please check your Jink/Spam email folder
        just in case the verification message got delivered there instead of
        your inbox. \n
        Please contact us
        help@craassessments.com
        
        `}
      </Typography>
    </Box>
  )
}
export default observer(DoneView)
