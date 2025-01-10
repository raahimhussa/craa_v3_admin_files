import Checkbox from '@mui/material/Checkbox'
import { MobxUtil } from '@utils'
import { action, reaction, runInAction } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react'
import { CheckboxProps } from './Checkbox'
function CheckboxView(props: CheckboxProps) {
  const { state, path, onChange } = props
  const localState = useLocalObservable(() => ({
    value: MobxUtil._get(state, path),
  }))

  reaction(
    () => localState.value,
    () => MobxUtil._set(state, path, localState.value)
  )

  reaction(
    () => MobxUtil._get(state, path),
    () => (localState.value = MobxUtil._get(state, path))
  )

  const _onChange = action((e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    localState.value = checked
    runInAction(() => onChange && onChange(e, localState.value))
  })

  return <Checkbox {...props} checked={localState.value} onChange={_onChange} />
}

export default observer(CheckboxView)
