import compose from '@shopify/react-compose'
import TransferListView from './TransferListView'

export type Option = {
  text: string
  value: string
  checked: boolean
}
export type TransferListProps = {
  options?: Array<Option>
  title?: string
  state?: any
  path?: string
}
export type HocComponentProps = {}
export type TransferListViewProps = TransferListProps & HocComponentProps
export default compose<TransferListViewProps>()(TransferListView)
