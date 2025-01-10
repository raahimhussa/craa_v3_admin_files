import { InputBase } from '@mui/material'
import axios from 'axios'
import { toJS } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react'
import pluralize, { singular } from 'pluralize'
import { KeyboardEventHandler } from 'react'
import { useRootStore } from 'src/stores'
import Swal from 'sweetalert2'
import { useSWRConfig } from 'swr'
// @ts-ignore
function CellInputView(props) {
  const { value: initialValue, row, column } = props
  const rootStore = useRootStore()
  const localState = useLocalObservable(() => ({
    value: initialValue,
  }))

  const { cache, mutate } = useSWRConfig()
  const matchMutate = (key: string) => {
    const regex = new RegExp(key)
    if (!(cache instanceof Map)) {
      throw new Error('matchMutate requires the cache provider to be a Map instance')
    }

    const keys = []

    for (const key of cache.keys()) {
      if (regex.test(key)) {
        keys.push(key)
      }
    }
    const mutations = keys.map((key) => mutate(key))

    return Promise.all(mutations)
  }

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
      const accessor = column.id
      const collectionName = column.collectionName
      const version = column.version || 1
      const itemId = row.original._id
      const newValue = toJS(localState.value)
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
        await axios.patch(`v${version}/${collectionName}`, body)

        Swal.fire({
          heightAuto: false,
          title: 'Success',
          icon: 'success'
        })
        matchMutate(collectionName)
      } catch (error) {

        Swal.fire({
          heightAuto: false,
          title: 'Error',
          icon: 'error'
        })
      }
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
