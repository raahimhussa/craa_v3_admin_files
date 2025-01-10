import { AdminButton } from '@components/DataGrid/DataGrid'
import DeleteDialogue from '@components/DeleteDialogue/DeleteDialogue'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
const withRightButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state } = props
    const {
      findingStore,
      uiState: { modal },
    } = useRootStore()
    const { enqueueSnackbar } = useSnackbar()
    const [open, setOpen] = useState<boolean>(false)

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

      const onDelete = async () => {
        try {
          await findingStore.repository.update(params)
        } catch (error) {
          console.error(error)
          return enqueueSnackbar('error', {
            variant: 'error',
          })
        }
        modal.close()
        props.findingsMutate && props.findingsMutate()
        state.selectedRowIds = []
      }

      modal.open(
        'findingsMultiDelete',
        <DeleteDialogue
          open={true}
          handleClose={() => modal.close()}
          onDelete={onDelete}
          title={`Are you sure you want to delete selected ${
            toJS(state.selectedRowIds).length
          } findings?`}
          text={
            "This item will be deleted permanently. You can't undo this action."
          }
          yesText={'Delete'}
          noText={'Cancel'}
        />
      )
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
