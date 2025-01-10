import compose from '@shopify/react-compose'
import NoteView from './NoteView'
export type NoteProps = {
  state: any
}
export type HocComponentProps = {
  user: any
}
export type NoteViewProps = NoteProps & HocComponentProps

export default compose<NoteProps>()(NoteView)
