import compose from '@shopify/react-compose'
import { EditorProps } from '@toast-ui/react-editor'
import EditorView from './EditorView'
export default compose<
  EditorProps & {
    state?: any
    path?: string
  }
>()(EditorView)
