import AssessmentCycle from '../../../../pages/admin/AssessmentCycle/AssessmentCycle'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const {
      uiState: { modal, assessmentCycles },
      assessmentCycleStore,
    } = useRootStore()
    const leftButtons = [
      {
        title: 'New',
        onClick: () => {
          assessmentCycleStore.resetForm()
          assessmentCycles.mutate = async () => {
            props.assessmentCyclesMutate &&
              (await props.assessmentCyclesMutate())
            props.countMutate && (await props.countMutate())
          }
          modal.open('AssessmentCycle', <AssessmentCycle />)
        },
      },
    ]

    return <WrappedComponent {...props} leftButtons={leftButtons} />
  })

export default withLeftButtons
