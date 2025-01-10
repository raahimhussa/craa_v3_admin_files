import { WrappingFunction } from '@shopify/react-compose'
import { Alert } from '@utils'
import axios from 'axios'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
// 깃에서 제외 대상이라 이름을 변경합니다.
const withRightButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state, logsMutate, logs } = props
    const rightButtons = [
      {
        title: 'Delete',
        onClick: async () => {
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
            await axios.patch('v1/logs', data)
          } catch (error) {
            Alert.handle(error)
          } finally {
          }
          logsMutate()
          state.selectedRowIds = {}
        },
        color: 'error',
      },
    ]
    return <WrappedComponent {...props} rightButtons={rightButtons} />
  })

export default withRightButtons
