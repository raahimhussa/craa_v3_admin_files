import { AdminButton } from 'src/ui/core/components/DataGrid/DataGrid'
import Swal from 'sweetalert2'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'
const withRightButtons: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const { state } = props
    const {
      fileStore,
      uiState: { files },
    } = useRootStore()
    const { enqueueSnackbar } = useSnackbar()
    const onClickDelete = async () => {
      const selectedRowIds = toJS(state.selectedRowIds)
      if (selectedRowIds.length === 0) {
        return enqueueSnackbar('Please select at least one row', {
          variant: 'warning',
        })
      }

      const params = {
        filter: {
          _id: {
            $in: selectedRowIds,
          },
        },
        update: {
          isDeleted: true,
        },
      }
      try {
        await fileStore.repository.update(params)
      } catch (error) {
        console.error(error)
        return enqueueSnackbar('error', {
          variant: 'error',
        })
      }

      files.mutate && files.mutate()
      props.filesMutate && props.filesMutate()

      state.selectedRowIds = []
    }

    const rightButtons: AdminButton[] = [
      {
        title: 'Delete',
        onClick: onClickDelete,
        color: 'error',
      },
    ]
    return <WrappedComponent {...props} rightButtons={rightButtons} />
  })

export default withRightButtons
