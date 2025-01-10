import { Alert } from '@utils'
import { WrappingFunction } from '@shopify/react-compose'
import axios from 'axios'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'
const withRightButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state, templatesMutate, templates } = props
    const { dialogStore } = useRootStore()
    // const rightButtons = [
    //   {
    //     title: 'Delete',
    //     onClick: async () => {
    //       const selectedRowIds = toJS(state.selectedRowIds)
    //       const data = {
    //         filter: {
    //           _id: {
    //             $in: selectedRowIds,
    //           },
    //         },
    //         update: {
    //           isDeleted: true,
    //         },
    //       }
    //       try {
    //         await axios.patch('v1/templates', data)
    //       } catch (error) {
    //         Alert.handle(error)
    //       }

    //       templatesMutate()
    //       dialogStore.success()
    //       state.selectedRowIds = {}
    //     },
    //     color: 'error',
    //   },
    // ]
    return <WrappedComponent {...props} rightButtons={[]} />
  })

export default withRightButtons
