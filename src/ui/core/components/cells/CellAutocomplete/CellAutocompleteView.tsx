import axios from 'axios'
import pluralize from 'pluralize'
import { Autocomplete } from 'src/ui/core/components'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import UiState from 'src/stores/ui'

function CellAutocompleteView(props: any) {
  const { column, state } = props
  const {
    dialogStore,
    uiState: { alert },
    uiState,
  } = useRootStore()
  const { mutateKey, onUpdate }: { mutateKey: keyof UiState; onUpdate: any } =
    column
  const optionCollectionName = column.optionCollectionName
  const collectionName = column.collectionName
  const singularCollectionName = pluralize.singular(collectionName)

  const options = props[optionCollectionName]?.map((doc: any) => ({
    text: doc[props.column.optionTextField],
    value: doc._id,
  }))

  const accessor = props.column.id

  const onChange = async () => {
    const value = eval(`state.${singularCollectionName}.${accessor}`)
    const body = {
      filter: {
        _id: state[singularCollectionName]._id,
        isDeleted: false,
      },
      update: {
        [accessor]: value,
      },
    }

    try {
      await axios.patch(`v1/${collectionName}`, body)
    } catch (error) {
      return alert.error()
    }
    if (uiState[mutateKey]) {
      // @ts-ignore
      uiState[mutateKey].mutate && uiState[mutateKey].mutate()
    }
    alert.success()
    if (onUpdate) {
      onUpdate(props.row.original)
    }
  }
  return (
    <Autocomplete
      onChange={onChange}
      options={options}
      state={state[singularCollectionName]}
      path={accessor}
    />
  )
}

export default observer(CellAutocompleteView)
