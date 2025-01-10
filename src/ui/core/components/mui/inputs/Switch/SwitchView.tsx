import Switch from '@mui/material/Switch'
import { MobxUtil } from '@utils'
import { action, reaction, runInAction } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react'
import { SwitchProps } from './Switch'
function SwitchView(props: SwitchProps) {
  const { state = {}, path = '', onChange = () => null } = props

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

  const _onChange = action((e: React.ChangeEvent<HTMLInputElement>) => {
    localState.value = e.target.checked
    runInAction(() => onChange(e, localState.value))
  })

  return <Switch {...props} checked={localState.value} onChange={_onChange} />
}

export default observer(SwitchView)
