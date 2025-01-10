import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
const withRightButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state, clientsMutate, clients } = props
    const rightButtons: any = [
      // {
      //   title: 'Delete',
      //   onClick: async () => {
      //     const selectedRowIds = toJS(state.selectedRowIds)
      //     const data = {
      //       filter: {
      //         _id: {
      //           $in: selectedRowIds,
      //         },
      //       },
      //       update: {
      //         isDeleted: true,
      //       },
      //     }
      //     try {
      //       await axios.patch('v1/clients', data)
      //     } catch (error) {
      //       Alert.handle(error)
      //     } finally {
      //     }
      //     clientsMutate()
      //     state.selectedRowIds = {}
      //   },
      //   color: 'error',
      // },
    ]
    return <WrappedComponent {...props} rightButtons={rightButtons} />
  })

export default withRightButtons
