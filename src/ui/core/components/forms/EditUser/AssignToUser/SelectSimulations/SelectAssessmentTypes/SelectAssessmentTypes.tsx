import { EditorProps } from '@toast-ui/react-editor'
import SelectAssessmentTypesView from './SelectAssessmentTypesView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withREST from 'src/hocs/withREST'
export default compose<any>(
  withFind({
    collectionName: 'assessmentTypes',
    getFilter: (props: any) => {
      const { assessmentTypeIds } = props
      return {
        _id: { $in: assessmentTypeIds },
        isDeleted: false,
      }
    },
  })
)(SelectAssessmentTypesView)
