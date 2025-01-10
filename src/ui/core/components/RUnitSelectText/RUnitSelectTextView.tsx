import { Box, InputAdornment, TextField } from '@mui/material'
import { observer, useLocalObservable } from 'mobx-react'

import { MobxUtil } from '@utils'
import { reaction } from 'mobx'

type Props = {
  value?: string
  onChangeText?: (text: string) => void
  unit?: string
}

function RUnitSelectTextView(props: Props & any) {
  const { value = '', unit = 'unit', onChangeText } = props

  const onChange:
    | React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
    | undefined = (event) => {
    onChangeText(event.target.value)
  }

  return (
    <TextField
      {...props}
      size="small"
      variant="outlined"
      type="text"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" sx={{ pl: 1 }}>
            <Box sx={{ pr: 1, borderRight: '1px solid gray' }}>{unit}</Box>
          </InputAdornment>
        ),
      }}
      InputLabelProps={{
        shrink: true,
      }}
      onChange={onChange}
      value={value}
    />
  )
}
export default observer(RUnitSelectTextView)
