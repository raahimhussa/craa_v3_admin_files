import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import { observer, useLocalObservable } from 'mobx-react'
import _ from 'lodash'
import { Option, TransferListProps } from './TransferList'
import { reaction, toJS } from 'mobx'
import { MobxUtil } from '@utils'

type LocalState = {
  options: Option[]
  value: Option[]
}

function TransferList(props: TransferListProps) {
  const { options = [], state = {}, path = '' } = props

  const defaultValue = MobxUtil._get(state, path)

  const _options = options.filter((option) => {
    const isExist = !!defaultValue?.find(({ value }: Option) => option.value === value)
    if (isExist) return false
    else return true
  })

  const localState: LocalState = useLocalObservable(() => ({
    options: _options,
    value: defaultValue || [],
  }))

  reaction(
    () => localState.value,
    (value) => MobxUtil._set(state, path, value)
  )

  reaction(
    () => MobxUtil._get(state, path),
    (value) => (localState.value = value)
  )

  const onClickCheckbox = (option: Option) => {
    option.checked = !option.checked
  }

  const onClickAllRightArrow = () => {
    localState.value = localState.options
    localState.options = []
  }

  const onClickRightArrow = () => {
    // 정적 상태 저장
    const options = toJS(localState.options)
    // 왼쪽에서 체크된 리스트 제거
    localState.options = localState.options.filter((option) => !option.checked)
    // 왼쪽에서 체크된 리스트 오른쪽으로 이동
    localState.value = options.filter((option) => option.checked)
  }

  const onClickLeftArrow = () => {
    // 정적 상태 저장
    const value = toJS(localState.value)
    // 왼쪽에서 체크된 리스트 제거
    localState.value = localState.value.filter((option) => !option.checked)
    // 왼쪽에서 체크된 리스트 오른쪽으로 이동
    localState.options = value.filter((option) => option.checked)
  }

  const onClickAllLeftArrow = () => {
    localState.options = localState.value
    localState.value = []
  }

  const customList = (options: Option[]) => {
    
    return (
      <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
        <List dense component="div" role="list">
          {options.map((option: Option) => {
            const labelId = `transfer-list-item-${option.value}-label`
            return (
              <ListItem
                key={option.value}
                role="listitem"
                button
                onClick={() => onClickCheckbox(option)}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={option.checked}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{
                      'aria-labelledby': labelId,
                    }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={option.text} />
              </ListItem>
            )
          })}
          <ListItem />
        </List>
      </Paper>
    )
  }

  return (
    <Grid container spacing={2}>
      <Grid item>{customList(localState.options)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={onClickAllRightArrow}
            disabled={localState.options.length === 0}
            aria-label="move all right"
          >
            ≫
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={onClickRightArrow}
            disabled={!localState.options.find((option) => option.checked)}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={onClickLeftArrow}
            disabled={!localState.value.find((option) => option.checked)}
            aria-label="move selected left"
          >
            &lt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={onClickAllLeftArrow}
            disabled={localState.value.length === 0}
            aria-label="move all left"
          >
            ≪
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList(localState.value)}</Grid>
    </Grid>
  )
}

export default observer(TransferList)
