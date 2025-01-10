import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { observer, useLocalObservable } from 'mobx-react'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { MobxUtil } from '@utils'
import TextField from '@mui/material/TextField'
import { reaction } from 'mobx'

function DateTimePickerView(props: any) {
  const { state = {}, path = '' } = props

  const localState: {
    value: Date | null
  } = useLocalObservable(() => ({
    value: MobxUtil._get(state, path) || null,
  }))

  reaction(
    () => localState.value,
    () => MobxUtil._set(state, path, localState.value)
  )

  reaction(
    () => MobxUtil._get(state, path),
    () => {
      localState.value = MobxUtil._get(state, path)
    }
  )

  const onChange: (
    date: Date | null,
    keyboardInputValue?: string | undefined
  ) => void = (date) => {
    localState.value = date
  }

  const onClose: (
    date: Date | null,
    keyboardInputValue?: string | undefined
  ) => void = (date) => {}

  return (
    //@ts-ignore
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        {...props}
        renderInput={(props) => <TextField {...props} fullWidth size="small" />}
        value={localState.value}
        onChange={onChange}
        onClose={onClose}
        sx={{ width: '100px !important' }}
      />
    </LocalizationProvider>
  )
}
export default observer(DateTimePickerView)
