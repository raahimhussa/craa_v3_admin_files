import { AdminLogScreen } from 'src/utils/status'
import { ButtonProps } from '@mui/material'
import { Column } from 'react-table'
import DataGridView from './DataGridView'
import { RootStore } from 'src/stores/root'
import UiState from 'src/stores/ui'
import compose from '@shopify/react-compose'
import withButtons from './withButtons'
import withColumns from './withColumns'
import withMeta from './withMeta'
import withStyle from './withStyle'

export enum Type {
  Number = 'number',
  String = 'string',
  Boolean = 'boolean',
  Date = 'date',
}
export enum CellType {
  Expander = 'expander',
  Editable = 'editable',
  SubComponent = 'subComponent',
  Date = 'date',
}

export type AdminButton = {
  title: string
  isVisible?: boolean
  color: string
} & ButtonProps

export interface IAdminColumn {
  type?: Type
  cellType?: CellType
  renderRowSubComponent?: any
  modalKey?: string
  storeKey?: keyof RootStore
  collectionName?: string
  edit?: (props: any) => void
  remove?: (props: any) => void
  Cell?: any
  optionCollectionName?: string
  optionTextField?: string
  version?: number
  mutateKey?: keyof UiState
  mutate?: any
  onUpdate?: (row: any) => void
  headerClassName?: string
  hideDelete?: boolean
  screen?: AdminLogScreen
}

export type AdminColumn = Column & IAdminColumn

export type DataGridProps = {
  buttons: boolean
  header: boolean
  state: any
}

export type HocComponentProps = {}

export type DataGridViewProps = DataGridProps & HocComponentProps

export default compose<any>(
  withColumns,
  withButtons,
  withMeta,
  withStyle
)(DataGridView)
