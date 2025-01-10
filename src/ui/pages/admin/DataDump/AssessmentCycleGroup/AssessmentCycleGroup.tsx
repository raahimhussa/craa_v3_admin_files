import AssessmentCycleGroupView from './AssessmentCycleGroupView'
import compose from '@shopify/react-compose'
import withREST from 'src/hocs/withREST'

export default compose<any>(
  withREST({
    collectionName: 'assessmentCycles',
    path: ({ assessmentCycleId }: { assessmentCycleId: string }) => {
      return `${assessmentCycleId}`
    },
    propName: 'assessmentCycle',
  })
)(AssessmentCycleGroupView)
