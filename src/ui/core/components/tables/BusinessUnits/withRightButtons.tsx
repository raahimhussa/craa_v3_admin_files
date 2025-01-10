import { Alert } from '@utils'
import { WrappingFunction } from '@shopify/react-compose'
import axios from 'axios'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
const withRightButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state, businessUnitsMutate, businessUnits, clientUnit } = props
    const rightButtons = [
      {
        title: 'Delete',
        onClick: async () => {
          const selectedRowIds = toJS(state.selectedRowIds)

          try {
            await Promise.all(
              selectedRowIds.map(
                async (buId: string) =>
                  await axios.delete(`v1/clientUnits/${clientUnit._id}/${buId}`)
              )
            )
          } catch (error) {
            Alert.handle(error)
          } finally {
          }
          // businessUnitsMutate()
          state.selectedRowIds = {}
        },
        color: 'error',
      },
    ]
    return <WrappedComponent {...props} rightButtons={rightButtons} />
  })

export default withRightButtons
