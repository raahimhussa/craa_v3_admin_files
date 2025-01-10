import { WrappingFunction } from '@shopify/react-compose'
import { Alert } from '@utils'
import axios from 'axios'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
const withRightButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state, simulationsMutate } = props
    const rightButtons: any = [
      // {
      //   title: 'DELETE',
      //   onClick: async () => {
      //     const selectedRowIds = toJS(state.selectedRowIds)
      //     const params = {
      //       filter: {
      //         _id: {
      //           $in: selectedRowIds,
      //         },
      //       },
      //     }
      //     try {
      //       await axios.delete('v1/simulations', { params })
      //     } catch (error) {
      //       Alert.handle(error)
      //     } finally {
      //       simulationsMutate()
      //       state.selectedRowIds = []
      //     }
      //   },
      //   color: 'error',
      // },
    ]
    return <WrappedComponent {...props} rightButtons={rightButtons} />
  })

export default withRightButtons
