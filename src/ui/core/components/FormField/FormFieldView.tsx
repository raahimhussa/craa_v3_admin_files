import { observer } from 'mobx-react'
import { FormFieldViewProps } from './FormField'
import Typography from 'src/ui/core/components/Typography/Typography'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'

function FormFieldView(props: FormFieldViewProps) {
  const { children, label = '', description = '', sx = {} } = props
  return (
    <Box sx={sx}>
      {label && (
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {label}
        </Typography>
      )}
      {description && (
        <Alert sx={{ m: 0, py: 0, mb: 2 }} severity="info">
          {description}
        </Alert>
      )}
      {children}
    </Box>
  )
}
export default observer(FormFieldView)
