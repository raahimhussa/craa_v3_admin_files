import { Box, Button } from 'src/ui/core/components'
import { ButtonBase, SxProps, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { MobxUtil } from '@utils'
import { reaction } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react'
import uniqid from 'uniqid'
import { Item, ToggleButtonsViewProps } from './ToggleButtons'
function ToggleButtonsView(props: ToggleButtonsViewProps) {
  const {
    items = [
      {
        text: '1',
        value: '1',
      },
      {
        text: '2',
        value: '2',
      },
    ],
    state = {},
    path = '',
  } = props

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

  // const onChange = (_: any, value: string) => {
  //   localState.value = value
  // }

  const onClick = (value: any) => {
    localState.value = value
  }

  const renderItem = (item: Item) => {
    let _sx: SxProps = {
      bgcolor: 'white',
      color: 'black',
    }
    if (localState.value === item.value) {
      _sx = {
        bgcolor: 'primary.main',
        color: 'white',
        fontWeight: 600
      }
    }

    return (
      <ButtonBase
        onClick={() => onClick(item.value)}
        sx={{ flex: 1, ..._sx, height: 32 }}
        key={uniqid()}
      >
        {item.text}
      </ButtonBase>
    )
  }

  return (
    <Box sx={{ display: 'flex', width: 500, border: 1, borderColor: '#f1f1f1' }}>
      {items?.map(renderItem)}
    </Box>
  )
}
export default observer(ToggleButtonsView)
