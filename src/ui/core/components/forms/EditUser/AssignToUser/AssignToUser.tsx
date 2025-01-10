import AssignToUserView from './AssignToUserView'
import { EditorProps } from '@toast-ui/react-editor'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withREST from 'src/hocs/withREST'
export default compose<any>(
  withREST({
    collectionName: 'clientUnits',
    path: () => '',
  }),
  withFind({
    collectionName: 'userAssessmentCycles',
    getFilter: (props: any) => {
      const { userId } = props
      return {
        userId,
        isDeleted: false,
      }
    },
  })
)(AssignToUserView)
