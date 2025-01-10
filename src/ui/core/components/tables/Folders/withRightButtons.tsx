import { WrappingFunction } from '@shopify/react-compose'
import { Alert } from '@utils'
import axios from 'axios'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
const withRightButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state, foldersMutate, folders } = props

    const onClickDelete = async () => {
      const selectedRowIds = toJS(state.selectedRowIds)
      const data = {
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
        await axios.patch('v1/folders', data)
      } catch (error) {
        Alert.handle(error)
      } finally {
      }
      foldersMutate()
      state.selectedRowIds = {}
    }

    const rightButtons = [
      {
        title: 'Delete',
        onClick: onClickDelete,
        color: 'error',
      },
    ]
    return <WrappedComponent {...props} rightButtons={rightButtons} />
  })

export default withRightButtons
