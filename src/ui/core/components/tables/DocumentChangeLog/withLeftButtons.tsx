import AssessmentType from 'src/ui/pages/admin/modals/AssessmentType/AssessmentType'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state } = props
    const {
      uiState: { modal, assessmentTypes },
      assessmentTypeStore,
    } = useRootStore()

    const leftButtons: any[] = [
      // {
      //   title: 'Manage Reviewers',
      //   onClick: () => {
      //     assessmentTypeStore.resetForm()
      //     assessmentTypes.mutate = async () => {
      //       props.assessmentTypesMutate && (await props.assessmentTypesMutate())
      //       props.countMutate && (await props.countMutate())
      //     }
      //     modal.open('AssessmentType', <AssessmentType />)
      //   },
      //   color: 'primary',
      // },
    ]

    return (
      <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
    )
  })

export default withLeftButtons
