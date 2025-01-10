import { TimePickerProps } from '@mui/x-date-pickers/TimePicker'
import TimePickerView from './TimePickerView'
import compose from '@shopify/react-compose'
//@ts-ignore
export default compose<TimePickerProps<any, any> & any>()(TimePickerView)
