import { WrappingFunction } from '@shopify/react-compose'
import axios from 'axios'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
const withRightButtons: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const { state, assessmentCyclesMutate } = props
    const rightButtons: any = [
      // {
      //   title: 'Delete',
      //   onClick: async () => {
      //     const selectedRowIds = toJS(state.selectedRowIds)
      //     const params = {
      //       _id: {
      //         $in: selectedRowIds,
      //       },
      //     }
      //     await axios.delete('v1/assessmentCycles', { params })
      //     assessmentCyclesMutate()
      //     state.selectedRowIds = []
      //   },
      //   color: 'error',
      // },
    ]
    return <WrappedComponent {...props} rightButtons={rightButtons} />
  })

export default withRightButtons
