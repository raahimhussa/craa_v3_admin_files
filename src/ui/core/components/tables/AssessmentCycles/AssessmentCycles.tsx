import { withFind, withState } from '@hocs'

import AssessmentCyclesView from './AssessmentCyclesView'
import compose from '@shopify/react-compose'
import withColumns from './withColumns'
import withLeftButtons from './withLeftButtons'
import withRightButtons from './withRightButtons'
const getState = (props: any) => {
  return {
    selectedRowIds: [],
  }
}

export default compose<any>(
  withState(getState),
  withColumns,
  withLeftButtons,
  withRightButtons
)(AssessmentCyclesView)
