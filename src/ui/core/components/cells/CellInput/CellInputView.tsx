import axios from 'axios'
import { toJS } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react'
import { KeyboardEventHandler } from 'react'
import { useRootStore } from 'src/stores'
import UiState from 'src/stores/ui'
// @ts-ignore
function CellInputView(props) {
  const { uiState: { alert }, uiState } = useRootStore()
  const { value: initialValue, row, column } = props
  const localState = useLocalObservable(() => ({
    value: initialValue,
  }))
  const mutateKey: keyof UiState = column.mutateKey || ''
  const accessor = column.id
  const collectionName = column.collectionName
  const itemId = row.original._id
  const version = column.version || 1
  const newValue = toJS(localState.value)
  const repository = column.repository
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value
    if (value === '') {
      if (typeof initialValue === 'number') {
        localState.value = 0
      } else {
        localState.value = ''
      }
    } else {
      if (typeof initialValue === 'number') {
        localState.value = parseFloat(value)
      } else {
        localState.value = value
      }
    }
  }

  const onKeyPressEnter: KeyboardEventHandler<HTMLInputElement> = async (e) => {
    if (e.key === 'Enter') {
      if (!column.collectionName) {
        throw new Error('you forgot to enter your collectionName into cell property ')
      }

      console.info(
        `collectionName: ${collectionName}, accessor: ${accessor}, newValue: ${newValue}, itemId: ${itemId}`
      )

      const body = {
        filter: {
          _id: itemId,
        },
        update: {
          [accessor]: newValue,
        },
      }
      try {
        if (repository) {
          await repository.update(body)
        } else {
          await axios.patch(`v${version}/${collectionName}`, body)
        }
      } catch (error) {
        return alert.error()
      }
      if (uiState[mutateKey]) {
        // @ts-ignore
        uiState[mutateKey]?.mutate && uiState[mutateKey].mutate()
      }
      return alert.success()
    }
  }
  const inputStyle = {
    padding: 0,
    margin: 0,
    border: 0,
    background: 'transparent',
  }
  return (
    <input
      style={inputStyle}
      value={localState.value}
      onChange={onChange}
      onKeyPress={onKeyPressEnter}
    />
  )
}
export default observer(CellInputView)
