import { TextField } from '@mui/material'
import { action, reaction } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react'
import { MobxUtil } from 'src/utils'
function TextFieldView({
  variant = 'standard',
  editable = true,
  state = {},
  label = '',
  path = '',
  defaultValue = '',
  number = false,
  fullWidth = true,
  className = '',
  ...rest
}: any) {
  const localState = useLocalObservable(() => ({
    value: MobxUtil._get(state, path) || defaultValue,
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

  const onChange = action((e: { target: { value: any } }) => {
    if (editable) {
      if (number) {
        localState.value = parseFloat(e.target.value)
      } else {
        localState.value = e.target.value
      }
    }
  })

  let _label = label
  if (!_label) {
    _label = path
  }

  return (
    <TextField
      {...rest}
      fullWidth={fullWidth}
      label={className == 'show' ? _label : ''}
      variant={variant}
      onChange={onChange}
      value={localState.value}
      InputLabelProps={{
        shrink: true,
      }}
    />
  )
}

export default observer(TextFieldView)
