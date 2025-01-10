import { withState } from '@hocs'
import compose from '@shopify/react-compose'
import withPayload from 'src/hocs/withPayload'
import TemplateView from './TemplateView'

const getState = (props: any) => {
  const { isEditMode, row } = props
  const state = {
    selectedRowIds: [],
    template: {
      key: '',
      title: '',
      htmlContent: '',
    },
  }
  if (isEditMode) {
    state.template = { ...row }
  }
  return state
}
export default compose<any>(withPayload('template'), withState(getState))(TemplateView)
