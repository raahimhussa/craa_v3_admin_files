import { InputAdornment, TextField } from '@mui/material'
import { observer, useLocalObservable } from 'mobx-react'

import { MobxUtil } from '@utils'
import { reaction } from 'mobx'

type Props = {
  value?: number
  onChangeNumber?: (amount: number) => void
  unit?: string
  disabled?: boolean
}

function RUnitSelectNumberView(props: Props & any) {
  const { value = 0, unit = 'hour', onChangeNumber } = props

  const onChange:
    | React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
    | undefined = (event) => {
    if (parseInt(event.target.value) > 0) {
      onChangeNumber(parseInt(event.target.value))
    }
  }

  return (
    <TextField
      {...props}
      size="small"
      variant="outlined"
      type="number"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" sx={{ pl: 1 }}>
            {unit}
          </InputAdornment>
        ),
      }}
      InputLabelProps={{
        shrink: true,
      }}
      onChange={onChange}
      value={value}
      disabled={props.disabled}
    />
  )
}
export default observer(RUnitSelectNumberView)
