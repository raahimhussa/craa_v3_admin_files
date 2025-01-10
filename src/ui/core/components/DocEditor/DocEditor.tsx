import { withFind } from '@hocs'
import compose from '@shopify/react-compose'
import { EditorProps } from '@toast-ui/react-editor'
import DocEditorView from './DocEditorView'
export default compose(
  withFind({
    collectionName: 'documentVariables',
    getFilter: (props: any) => {
      return {
        groupId: props.groupId,
        isDeleted: false,
      }
    },
  })
)(DocEditorView)
