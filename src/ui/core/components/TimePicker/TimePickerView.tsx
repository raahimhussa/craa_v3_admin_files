import { observer, useLocalObservable } from 'mobx-react'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import TextField from '@mui/material/TextField'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'

// InPregress
function TimePickerView(props: any) {
  const timePicker: { date: Date | null } = useLocalObservable(() => ({
    date: null,
  }))

  const onChange: (
    date: Date | null,
    keyboardInputValue?: string | undefined
  ) => void = (date, keyboardInputValue) => {
    timePicker.date = date
  }

  return (
    //@ts-ignore
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        label="Basic example"
        value={timePicker.date}
        onChange={onChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  )
}
export default observer(TimePickerView)
